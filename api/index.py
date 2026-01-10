# Vercel Serverless API - Lightweight version without heavy ML dependencies
# Deepfake detection is handled by Hugging Face Space

import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Bhartiya-Election AI Backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str
    language: Optional[str] = "en"

class Explanation(BaseModel):
    highlightedWords: List[str]
    reason: str

class ContextLink(BaseModel):
    title: str
    excerpt: str
    url: str

class AnalyzeResponse(BaseModel):
    isFake: bool
    confidence: float
    originalText: str
    explanation: Explanation
    contextLinks: List[ContextLink]

# Gemini Configuration
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found")

genai.configure(api_key=API_KEY)

generation_config = {
    "temperature": 0.2,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
    system_instruction="""You are an expert Fact Checker and Rumor Buster for the Indian Election context. 
    Your task is to verify rumors and misinformation with high precision.

    You must support ALL 22 Scheduled Languages of India: Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu.

    IMPORTANT: The 'reason', 'contextLinks.title', and 'contextLinks.excerpt' fields MUST BE IN THE SAME LANGUAGE as the input rumor text.
    
    Output must be a strictly valid JSON object with the following schema:
    {
      "isFake": boolean,
      "confidence": float (0.0 to 1.0),
      "explanation": {
        "highlightedWords": [string],
        "reason": string
      },
      "contextLinks": [
        {
          "title": string,
          "excerpt": string,
          "url": string
        }
      ]
    }
    """,
)

@app.get("/")
async def root():
    return {"message": "Bhartiya Election AI Backend - Lightweight Vercel Version"}

@app.post("/analyze")
async def analyze_rumor(request: AnalyzeRequest):
    """Analyze rumor for misinformation"""
    try:
        prompt = f"""Analyze this claim about Indian elections and determine if it's fake or misleading:

"{request.text}"

Provide a detailed fact-check with evidence."""

        response = model.generate_content(prompt)
        result = json.loads(response.text)
        result["originalText"] = request.text
        
        return result
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    query: str
    language: Optional[str] = "en"

@app.post("/chat-constitutional")
async def chat_constitutional(request: ChatRequest):
    """Constitutional AI chat endpoint"""
    try:
        language_map = {
            "en": "English",
            "hi": "Hindi",
            "bn": "Bengali",
            "te": "Telugu",
            "mr": "Marathi",
            "ta": "Tamil",
            "gu": "Gujarati",
            "kn": "Kannada",
            "ml": "Malayalam",
            "pa": "Punjabi",
        }
        
        target_lang = language_map.get(request.language, "English")
        
        prompt = f"""You are a Constitutional AI assistant for Indian elections.
Target Language: {target_lang}

User Query: {request.query}

Provide a helpful, accurate response about Indian elections, voting rights, or electoral processes.
Respond in {target_lang}."""

        chat_model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config={"temperature": 0.7, "max_output_tokens": 1024},
        )
        
        response = chat_model.generate_content(prompt)
        
        return {"response": response.text}
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/latest-news")
async def get_latest_news():
    """Get latest election news"""
    news = [
        {
            "id": 1,
            "title": "Election Commission Announces Dates for State Assembly Elections",
            "excerpt": "The Election Commission has announced the schedule for upcoming state assembly elections...",
            "date": "2024-01-15",
            "source": "ECI Official",
        },
        {
            "id": 2,
            "title": "New Voter Registration Drive Launched",
            "excerpt": "A nationwide voter registration drive has been launched to include first-time voters...",
            "date": "2024-01-14",
            "source": "PIB",
        },
    ]
    return {"news": news}

# Note: Deepfake detection and Voice features are NOT included in this lightweight version
# Those features run on Hugging Face Space where there are no size limits

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
