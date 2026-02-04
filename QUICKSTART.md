# Quick Start Guide

## Step-by-Step Instructions

### 1. Backend Setup (5-10 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python main.py
```

**Expected output:**
```
INFO: Loading PEGASUS model...
INFO: Using device: cuda (or cpu)
INFO: Model loaded successfully!
INFO: Uvicorn running on http://0.0.0.0:8000
```

Keep this terminal running!

---

### 2. Frontend Setup (3-5 minutes)

Open a NEW terminal window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend server
npm start
```

**Expected output:**
```
Compiled successfully!
Local: http://localhost:3000
```

Browser will automatically open!

---

### 3. Test the Application

1. Go to http://localhost:3000
2. Click "Upload PDF" or "Paste Text"
3. Upload a PDF or paste sample text
4. Adjust summary length slider
5. Click "Generate Summary"
6. Wait 10-30 seconds
7. View your summary!

---

### Sample Text to Test

If you don't have a PDF handy, paste this:

```
Artificial intelligence (AI) has revolutionized various industries in recent years. 
Machine learning, a subset of AI, enables computers to learn from data without explicit 
programming. Deep learning, using neural networks with multiple layers, has achieved 
remarkable results in image recognition, natural language processing, and game playing. 
Convolutional neural networks excel at computer vision tasks, while recurrent neural 
networks are suited for sequential data. Transformer models, introduced in 2017, have 
become the foundation for modern NLP applications. These models use self-attention 
mechanisms to process input sequences in parallel, making them more efficient than 
recurrent architectures. Pre-trained language models like BERT and GPT have demonstrated 
impressive performance on various benchmarks. Transfer learning allows these models to 
be fine-tuned on specific tasks with limited data. The attention mechanism enables models 
to focus on relevant parts of the input when making predictions. Recent advances include 
few-shot learning, where models can adapt to new tasks with minimal examples. Ethical 
considerations around AI deployment include bias, privacy, and societal impact. The field 
continues to evolve rapidly with new architectures and training techniques emerging 
regularly. Applications span healthcare, finance, autonomous vehicles, and creative tasks. 
Future directions include more efficient models, better interpretability, and stronger 
reasoning capabilities.
```

---

## Troubleshooting

### Backend won't start?
- Check Python version: `python --version` (need 3.8+)
- Make sure virtual environment is activated (see `(venv)` in terminal)
- Try: `pip install --upgrade pip` then reinstall requirements

### Frontend won't start?
- Check Node version: `node --version` (need 14+)
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Model download stuck?
- First run downloads ~2.3GB model
- Check internet connection
- Wait 10-15 minutes
- Check disk space (need 5GB free)

### Can't connect to backend?
- Make sure backend terminal shows "Uvicorn running"
- Try http://localhost:8000 in browser
- Check firewall settings

---

## Quick Test

Run the test script to verify backend:

```bash
cd backend
python test_backend.py
```

Should show all tests passing ✅

---

## Port Usage

- Backend: http://localhost:8000
- Frontend: http://localhost:3000

Make sure these ports are not in use by other applications.

---

## What's Running?

### Backend Terminal:
- FastAPI server
- PEGASUS model loaded in memory
- Handles API requests

### Frontend Terminal:
- React development server
- Hot reload enabled
- Serves UI

---

## Stopping the Application

1. Frontend: Press `Ctrl+C` in frontend terminal
2. Backend: Press `Ctrl+C` in backend terminal
3. Deactivate venv: `deactivate`

---

## Next Time You Run

### Backend:
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

### Frontend:
```bash
cd frontend
npm start
```

That's it! Model only downloads once.

---

## File Locations

- Code: Where you placed the project
- Model Cache: `~/.cache/huggingface/`
- Logs: Backend terminal output

---

## Need Help?

1. Check error messages carefully
2. Review SETUP_GUIDE.md for detailed help
3. Check README.md for documentation
4. Google the specific error message
5. Ensure all prerequisites are installed

---

Good luck! 🚀
