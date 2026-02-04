# Detailed Setup Guide - Research Paper Summarizer

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Python 3.8 or higher installed
- [ ] Node.js 14 or higher installed
- [ ] npm (comes with Node.js)
- [ ] 4GB+ RAM available
- [ ] 5GB+ disk space for model and dependencies
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access
- [ ] Stable internet connection (for initial setup)

---

## 🔍 Verify Prerequisites

### Check Python Installation
```bash
python --version
# Should show: Python 3.8.x or higher

# If not installed, download from: https://www.python.org/downloads/
```

### Check Node.js Installation
```bash
node --version
# Should show: v14.x.x or higher

npm --version
# Should show: 6.x.x or higher

# If not installed, download from: https://nodejs.org/
```

---

## 🖥️ Backend Setup (Detailed)

### Step 1: Navigate to Backend Directory
```bash
# From project root
cd research-paper-summarizer/backend
```

### Step 2: Create Python Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 3: Upgrade pip
```bash
pip install --upgrade pip
```

### Step 4: Install Python Dependencies
```bash
pip install -r requirements.txt
```

**This will install:**
- FastAPI (web framework)
- Uvicorn (ASGI server)
- Transformers (HuggingFace library)
- PyTorch (deep learning framework)
- PyMuPDF (PDF processing)
- Other utilities

**Installation time:** 5-10 minutes depending on internet speed

### Step 5: Download PEGASUS Model (First Run Only)

When you first run the application, it will automatically download the PEGASUS model.

```bash
python main.py
```

**Expected output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Loading PEGASUS model...
INFO:     Using device: cuda  # or cpu
Downloading model files... [This happens on first run]
INFO:     Model loaded successfully!
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Model download:**
- Size: ~2.3 GB
- Time: 5-15 minutes (depending on internet speed)
- Location: `~/.cache/huggingface/` (automatic)

### Step 6: Test Backend

Open browser and go to: `http://localhost:8000`

You should see:
```json
{
  "status": "running",
  "message": "Research Paper Summarizer API",
  "model": "google/pegasus-arxiv",
  "device": "cpu"
}
```

### Step 7: Test Health Endpoint

Visit: `http://localhost:8000/health`

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu"
}
```

---

## 🎨 Frontend Setup (Detailed)

### Step 1: Open New Terminal

Keep the backend terminal running. Open a new terminal window.

### Step 2: Navigate to Frontend Directory
```bash
# From project root
cd research-paper-summarizer/frontend
```

### Step 3: Install Node Dependencies
```bash
npm install
```

**This will install:**
- React and React-DOM
- React Scripts (build tools)
- Tailwind CSS
- PostCSS and Autoprefixer
- Other utilities

**Installation time:** 2-5 minutes

### Step 4: Start Development Server
```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view research-paper-summarizer in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

The browser will automatically open to `http://localhost:3000`

---

## ✅ Verification Steps

### 1. Check Both Servers Are Running

**Backend:** `http://localhost:8000`
- Should show JSON response

**Frontend:** `http://localhost:3000`
- Should show the application UI

### 2. Test PDF Upload

1. Find a small PDF file (or download a research paper)
2. Drag and drop onto the upload area
3. Should see extracted text preview
4. File size should be under 10MB

### 3. Test Text Paste

1. Click "Paste Text" tab
2. Copy and paste this sample text:

```
Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves. The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future. The primary aim is to allow computers to learn automatically without human intervention or assistance and adjust actions accordingly. Machine learning algorithms are often categorized as supervised or unsupervised. Supervised learning algorithms can apply what has been learned in the past to new data using labeled examples to predict future events. Unsupervised learning algorithms are used when the information used to train is neither classified nor labeled. These algorithms study data looking for patterns that can be used to group objects.
```

3. Adjust summary length slider
4. Click "Generate Summary"

### 4. Expected Summary Result

After processing (10-20 seconds), you should see:
- Green "Generated Summary" box
- Summary text (shorter than original)
- Statistics showing:
  - Original word count
  - Summary word count
  - Compression ratio %

---

## 🚨 Common Setup Issues & Solutions

### Issue 1: Python Module Not Found

**Error:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```bash
# Make sure virtual environment is activated
# Look for (venv) in terminal

# If not activated:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Then reinstall:
pip install -r requirements.txt
```

### Issue 2: Port Already in Use

**Error:**
```
ERROR: Address already in use
```

**Solution:**
```bash
# Find and kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9

# Or change port in main.py:
# uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Issue 3: npm Install Fails

**Error:**
```
npm ERR! code EACCES
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# If still fails, delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: CORS Error in Browser

**Error:**
```
Access to fetch at 'http://localhost:8000' has been blocked by CORS policy
```

**Solution:**
1. Ensure backend is running
2. Check backend terminal for errors
3. Restart backend server
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue 5: Model Download Fails

**Error:**
```
OSError: Can't load model for 'google/pegasus-arxiv'
```

**Solution:**
```bash
# Check internet connection
# Ensure sufficient disk space (3GB+)

# Manually download model:
python
>>> from transformers import PegasusTokenizer, PegasusForConditionalGeneration
>>> tokenizer = PegasusTokenizer.from_pretrained("google/pegasus-arxiv")
>>> model = PegasusForConditionalGeneration.from_pretrained("google/pegasus-arxiv")
>>> exit()
```

### Issue 6: Out of Memory

**Error:**
```
RuntimeError: CUDA out of memory
```

**Solution:**
Edit `main.py` to force CPU:
```python
# Change line in load_model():
device = torch.device("cpu")  # Force CPU instead of auto-detect
```

### Issue 7: React Build Issues

**Error:**
```
'react-scripts' is not recognized
```

**Solution:**
```bash
# Reinstall react-scripts
npm install react-scripts --save

# Or install globally
npm install -g react-scripts
```

---

## 🔧 Environment Variables (Optional)

Create `.env` file in backend directory:

```env
# Backend Configuration
HOST=0.0.0.0
PORT=8000
WORKERS=1

# Model Configuration
MODEL_NAME=google/pegasus-arxiv
DEVICE=auto  # auto, cpu, or cuda

# File Upload Limits
MAX_FILE_SIZE_MB=10
MAX_TEXT_LENGTH=50000
```

Load in `main.py`:
```python
from dotenv import load_dotenv
import os

load_dotenv()
PORT = int(os.getenv("PORT", 8000))
```

---

## 📦 Production Build

### Backend Production

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Production

```bash
# Build optimized production bundle
npm run build

# Serve with static server
npm install -g serve
serve -s build -p 3000
```

---

## 🐳 Docker Setup (Advanced)

### Backend Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8000

CMD ["python", "main.py"]
```

### Frontend Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-p", "3000"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - model_cache:/root/.cache/huggingface

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  model_cache:
```

Run with:
```bash
docker-compose up
```

---

## ✨ First-Time Setup Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 14+ installed
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] PEGASUS model downloaded
- [ ] Backend server running on port 8000
- [ ] Frontend dependencies installed
- [ ] Frontend server running on port 3000
- [ ] Can access both URLs in browser
- [ ] Tested PDF upload successfully
- [ ] Tested text paste successfully
- [ ] Generated at least one summary

---

## 🎯 Quick Start Commands

Once everything is set up, use these commands:

**Start Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

**Start Frontend:**
```bash
cd frontend
npm start
```

**Stop Servers:**
- Press `Ctrl+C` in each terminal

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HuggingFace Transformers](https://huggingface.co/docs/transformers)
- [PEGASUS Paper](https://arxiv.org/abs/1912.08777)

---

## 🤝 Need Help?

If you encounter issues not covered here:

1. Check the error message carefully
2. Google the specific error
3. Check if all dependencies are installed
4. Verify Python and Node versions
5. Restart both servers
6. Clear caches (npm, pip, browser)

---

**Setup complete! You're ready to use the Research Paper Summarizer.** 🎉
