"""
Research Paper Summarizer - Backend API
FastAPI application with HuggingFace PEGASUS model
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import torch
from transformers import PegasusTokenizer, PegasusForConditionalGeneration
import pymupdf  # PyMuPDF
import io
import logging
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Research Paper Summarizer API",
    description="AI-powered research paper summarization using PEGASUS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
tokenizer = None
device = None
max_input_tokens = None

class TextInput(BaseModel):
    text: str
    max_length: Optional[int] = 200
    min_length: Optional[int] = 80

class SummaryResponse(BaseModel):
    summary: str
    original_length: int
    summary_length: int
    compression_ratio: float

class PDFResponse(BaseModel):
    text: str
    word_count: int
    page_count: int


@app.on_event("startup")
async def load_model():
    """
    Load the PEGASUS model on startup to avoid loading it on every request.
    This is crucial for production performance.
    """
    global model, tokenizer, device
    
    try:
        logger.info("Loading PEGASUS model...")
        
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {device}")
        
        model_name = "google/pegasus-arxiv"
        tokenizer = PegasusTokenizer.from_pretrained(model_name)
        model = PegasusForConditionalGeneration.from_pretrained(model_name)

        model_max = getattr(model.config, "max_position_embeddings", None)
        tokenizer_max = getattr(tokenizer, "model_max_length", None)
        candidates = [v for v in [model_max, tokenizer_max] if isinstance(v, int)]
        global max_input_tokens
        max_input_tokens = min(candidates) if candidates else 512
        logger.info(f"Using max input tokens: {max_input_tokens}")
        
        model = model.to(device)
        model.eval()  # Set to evaluation mode
        
        logger.info("Model loaded successfully!")
        
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise


def clean_text(text: str) -> str:
    """
    Clean and preprocess extracted text.
    Removes excessive whitespace, special characters, etc.
    """
    text = re.sub(r'\s+', ' ', text)
    
    text = re.sub(r'[^\w\s\.\,\;\:\!\?\-\(\)]', '', text)
    
    text = re.sub(r'\b\d+\s*$', '', text, flags=re.MULTILINE)
    
    return text.strip()


def extract_text_from_pdf(pdf_bytes: bytes) -> tuple[str, int]:
    """
    Extract text from PDF using PyMuPDF.
    Returns: (extracted_text, page_count)
    """
    try:
        pdf_document = pymupdf.open(stream=pdf_bytes, filetype="pdf")
        page_count = pdf_document.page_count
        
        full_text = ""
        for page_num in range(page_count):
            page = pdf_document[page_num]
            full_text += page.get_text()
        
        pdf_document.close()
        
        full_text = clean_text(full_text)
        
        return full_text, page_count
    
    except Exception as e:
        logger.error(f"Error extracting PDF: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract PDF: {str(e)}")


def chunk_text(text: str, max_tokens: Optional[int] = None) -> list[str]:
    """
    Split long text into chunks that fit within model's max input length.
    PEGASUS model has a max input length that varies by checkpoint.
    """
    if max_tokens is None:
        max_tokens = max_input_tokens or 512
    tokens = tokenizer.encode(text, truncation=False)
    
    if len(tokens) <= max_tokens:
        return [text]
    
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        test_chunk = current_chunk + " " + sentence if current_chunk else sentence
        test_tokens = tokenizer.encode(test_chunk, truncation=False)
        
        if len(test_tokens) <= max_tokens:
            current_chunk = test_chunk
        else:
            if current_chunk:
                chunks.append(current_chunk)
            current_chunk = sentence
    
    if current_chunk:
        chunks.append(current_chunk)
    
    return chunks


def generate_summary(text: str, max_length: int = 200, min_length: int = 80) -> str:
    """
    Generate abstractive summary using PEGASUS model.
    Handles long documents by chunking and combining summaries.
    """
    try:
        chunks = chunk_text(text, max_tokens=max_input_tokens)
        
        summaries = []
        
        for i, chunk in enumerate(chunks):
            logger.info(f"Summarizing chunk {i + 1}/{len(chunks)}")
            inputs = tokenizer.encode(
                chunk,
                return_tensors="pt",
                max_length=max_input_tokens,
                truncation=True
            ).to(device)
            
            with torch.no_grad():
                summary_ids = model.generate(
                    inputs,
                    max_length=max_length,
                    min_length=min_length,
                    length_penalty=2.0,
                    num_beams=2,
                    early_stopping=True,
                    do_sample=False  # Deterministic output
                )
            
            summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            summaries.append(summary)
        
        if len(summaries) > 1:
            combined_text = " ".join(summaries)
            final_summary = generate_summary(combined_text, max_length, min_length)
            return final_summary
        return summaries[0]
    
    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "message": "Research Paper Summarizer API",
        "model": "google/pegasus-arxiv",
        "device": str(device)
    }


@app.post("/upload_pdf", response_model=PDFResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF file and extract text from it.
    
    Args:
        file: PDF file upload
    
    Returns:
        PDFResponse with extracted text and metadata
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB")
    
    extracted_text, page_count = extract_text_from_pdf(contents)
    
    if not extracted_text:
        raise HTTPException(status_code=400, detail="No text could be extracted from PDF")
    
    word_count = len(extracted_text.split())
    
    return PDFResponse(
        text=extracted_text,
        word_count=word_count,
        page_count=page_count
    )


@app.post("/summarize", response_model=SummaryResponse)
async def summarize_text(input_data: TextInput):
    """
    Generate an abstractive summary of the input text.
    
    Args:
        input_data: TextInput with text and optional length parameters
    
    Returns:
        SummaryResponse with summary and statistics
    """
    if not input_data.text or len(input_data.text.strip()) < 100:
        raise HTTPException(
            status_code=400,
            detail="Text is too short. Minimum 100 characters required."
        )
    
    if input_data.max_length < input_data.min_length:
        raise HTTPException(
            status_code=400,
            detail="max_length must be greater than min_length"
        )
    
    summary = generate_summary(
        input_data.text,
        max_length=input_data.max_length,
        min_length=input_data.min_length
    )
    
    original_length = len(input_data.text.split())
    summary_length = len(summary.split())
    compression_ratio = round((1 - summary_length / original_length) * 100, 2)
    
    return SummaryResponse(
        summary=summary,
        original_length=original_length,
        summary_length=summary_length,
        compression_ratio=compression_ratio
    )


@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify model is loaded.
    """
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "device": str(device) if device else "unknown"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
