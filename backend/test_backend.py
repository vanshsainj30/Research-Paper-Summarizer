"""
Test script for Research Paper Summarizer Backend
Run this to verify your backend is working correctly
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test if server is running"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Server is running")
            print(f"Response: {response.json()}")
            return True
        else:
            print("❌ Server returned error:", response.status_code)
            return False
    except Exception as e:
        print("❌ Could not connect to server:", str(e))
        print("Make sure backend is running on port 8000")
        return False

def test_model_health():
    """Test if model is loaded"""
    print("\nTesting model health...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        data = response.json()
        if data.get("model_loaded"):
            print("✅ Model loaded successfully")
            print(f"Device: {data.get('device')}")
            return True
        else:
            print("❌ Model not loaded")
            return False
    except Exception as e:
        print("❌ Error checking model:", str(e))
        return False

def test_summarize():
    """Test text summarization"""
    print("\nTesting summarization...")
    
    sample_text = """
    Machine learning is a subset of artificial intelligence that enables 
    systems to learn and improve from experience without being explicitly 
    programmed. It focuses on the development of computer programs that 
    can access data and use it to learn for themselves. The process of 
    learning begins with observations or data, such as examples, direct 
    experience, or instruction, in order to look for patterns in data and 
    make better decisions in the future. The primary aim is to allow 
    computers to learn automatically without human intervention or 
    assistance and adjust actions accordingly. Machine learning algorithms 
    are often categorized as supervised or unsupervised. Supervised learning 
    algorithms can apply what has been learned in the past to new data using 
    labeled examples to predict future events. Unsupervised learning 
    algorithms are used when the information used to train is neither 
    classified nor labeled.
    """
    
    try:
        response = requests.post(
            f"{BASE_URL}/summarize",
            json={
                "text": sample_text,
                "max_length": 150,
                "min_length": 60
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Summarization successful")
            print(f"\nOriginal length: {data['original_length']} words")
            print(f"Summary length: {data['summary_length']} words")
            print(f"Compression: {data['compression_ratio']}%")
            print(f"\nSummary:\n{data['summary']}")
            return True
        else:
            print("❌ Summarization failed:", response.status_code)
            print(response.json())
            return False
    except Exception as e:
        print("❌ Error during summarization:", str(e))
        return False

def run_all_tests():
    """Run all tests"""
    print("="*60)
    print("Research Paper Summarizer - Backend Tests")
    print("="*60)
    
    tests = [
        test_health_check,
        test_model_health,
        test_summarize
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print("\n" + "="*60)
    print("Test Results")
    print("="*60)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("✅ All tests passed! Backend is working correctly.")
    else:
        print("❌ Some tests failed. Check the errors above.")

if __name__ == "__main__":
    run_all_tests()
