import os
import json
import typing
import typing
import tempfile
import base64
import io
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from gtts import gTTS
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv
from deepfake_detection import DeepfakeDetector
import shutil

load_dotenv() # Load environment variables from .env file

app = FastAPI(title="Bhartiya-Election AI Backend")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL (e.g., http://localhost:3000)
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

# --- Gemini Configuration ---
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=API_KEY)

# Use a model that supports JSON mode if possible, or prompt engineering
generation_config = {
    "temperature": 0.2,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash", # Using available 2.0 Flash model
    generation_config=generation_config,
    system_instruction="""You are an expert Fact Checker and Rumor Buster for the Indian Election context. 
    Your task is to verify rumors and misinformation with high precision.

    You must support ALL 22 Scheduled Languages of India: Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu.

    IMPORTANT: The 'reason', 'contextLinks.title', and 'contextLinks.excerpt' fields MUST BE IN THE SAME LANGUAGE as the input rumor text. If the input is in one of these languages, the response MUST be in that same language.
    
    Output must be a strictly valid JSON object with the following schema:
    {
      "isFake": boolean,
      "confidence": float (0.0 to 1.0),
      "explanation": {
        "highlightedWords": [string] (Extract EXACT symbols, words, or short phrases from the input text that are factually incorrect, sensationalist, or misleading. Do NOT change the words.),
        "reason": string (A detailed, step-by-step analysis explaining WHY the claim is fake/misleading. Cite specific contradictions with official rules or logic.)
      },
      "contextLinks": [
        {
          "title": string (Source Title),
          "excerpt": string (Relevant quote from source),
          "url": string (Link to official source e.g., eci.gov.in, pib.gov.in, reputable news)
        }
      ]
    }
    
    If the claim is VAGUE or OPINION, treat it as 'isFake': false (or neutral) but low confidence.
    If the claim is unrelated to elections/politics, simply verify it as best as possible.
    """
)

# Chat Model for Audio Conversation
chat_model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={
        "response_mime_type": "application/json"
    },
    system_instruction="""You are a helpful Indian Election Rumor Buster assistant.
    Listen to the user query.
    1. If they ask a general question, answer it.
    2. If they share a rumor, verify it briefly.
    3. ALWAYS respond in the SAME LANGUAGE as the user's audio.
    4. Return valid JSON: { "response_text": "...", "language_code": "..." }
       - language_code must be a valid ISO 639-1 code supported by Google Translate (e.g., 'hi', 'en', 'bn', 'ta', 'te').
    """
)

# Initialize Deepfake Detector (Lazy load to save startup time if needed, but here we do eager)
deepfake_detector = None
try:
    deepfake_detector = DeepfakeDetector()
except Exception as e:
    print(f"Failed to load DeepfakeDetector: {e}")

@app.get("/")
def read_root():
    return {"message": "Bhartiya-Election AI Backend (Gemini Powered) is running"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_rumor(request: AnalyzeRequest):
    query_text = request.text
    print(f"Analyzing with Gemini: {query_text}")

    if not API_KEY:
         raise HTTPException(status_code=500, detail="Server Error: Gemini API Key not configured.")

    try:
        # Prompting Gemini
        # Note: Gemini 1.5 Flash has built-in grounding (browsing) capabilities if enabled, 
        # but for API consistency we rely on the model's knowledge or tool use if we configured tools.
        # For this prototype, we rely on the model's internal knowledge which is vast.
        
        response = model.generate_content(f"Verify this claim: '{query_text}'")
        
        # Parse output
        response_text = response.text
        # Clean up code blocks if model adds them despite mime_type
        if response_text.startswith("```json"):
            response_text = response_text[7:-3]
        elif response_text.startswith("```"):
             response_text = response_text[3:-3]
            
        data = json.loads(response_text)
        
        # Hydrate response object
        return AnalyzeResponse(
            isFake=data.get("isFake", False),
            confidence=data.get("confidence", 0.0),
            originalText=query_text,
            explanation=Explanation(
                highlightedWords=data.get("explanation", {}).get("highlightedWords", []),
                reason=data.get("explanation", {}).get("reason", "No explanation provided.")
            ),
            contextLinks=[
                ContextLink(
                    title=link.get("title", "Source"),
                    excerpt=link.get("excerpt", ""),
                    url=link.get("url", "#")
                ) for link in data.get("contextLinks", [])
            ]
        )

    except Exception as e:
        print(f"Gemini Error: {e}")
        # Graceful fallback
        return AnalyzeResponse(
            isFake=False,
            confidence=0.0,
            originalText=query_text,
            explanation=Explanation(highlightedWords=[], reason="Error connecting to AI verification service."),
            contextLinks=[]
        )

@app.post("/chat-audio")
async def chat_audio(file: UploadFile = File(...)):
    print(f"Received audio file: {file.filename}")
    
    # Save temp file
    suffix = f".{file.filename.split('.')[-1]}" if "." in file.filename else ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        if not API_KEY:
             raise HTTPException(status_code=500, detail="Gemini API Key missing")

        # Upload to Gemini
        print("Uploading audio to Gemini...")
        gemini_file = genai.upload_file(tmp_path, mime_type=file.content_type or "audio/wav")
        
        # Generator
        print("Generating response...")
        result = chat_model.generate_content(["Listen to this audio and respond appropriately.", gemini_file])
        
        # Parse JSON
        response_text = result.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:-3]
        elif response_text.startswith("```"):
             response_text = response_text[3:-3]
             
        data = json.loads(response_text)
        text_resp = data.get("response_text", "I could not understand the audio.")
        lang = data.get("language_code", "en")
        
        print(f"Response: {text_resp} (Lang: {lang})")
        
        # Text to Speech
        try:
            tts = gTTS(text=text_resp, lang=lang)
        except Exception as e:
             print(f"gTTS Error for lang {lang}: {e}")
             tts = gTTS(text=text_resp, lang='en')
             
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        base64_audio = base64.b64encode(mp3_fp.read()).decode("utf-8")
        
        return {"text": text_resp, "audio": base64_audio}

    except Exception as e:
        print(f"Audio Chat Error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

    finally:
        # Cleanup
        if os.path.exists(tmp_path):
            os.remove(tmp_path)



@app.post("/detect-deepfake")
async def detect_deepfake(file: UploadFile = File(...)):
    print(f"Deepfake Analysis Request: {file.filename}")
    
    suffix = f".{file.filename.split('.')[-1]}" if "." in file.filename else ".mp4"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
        
    try:
        if not deepfake_detector:
             raise HTTPException(status_code=500, detail="Deepfake Detector not initialized.")

        result = deepfake_detector.detect(tmp_path)
        
        if "error" in result:
             raise HTTPException(status_code=400, detail=result["error"])
             
        return result

    except Exception as e:
        print(f"Deepfake Error: {e}")
        return JSONResponse(status_code=500, content={"detail": str(e)})

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

# --- Constitutional Logic Layer ---

class ConstitutionalRequest(BaseModel):
    query: str
    language: Optional[str] = "en"

class ConstitutionalResponse(BaseModel):
    pro_argument: str
    con_argument: str
    neutral_summation: str
    citations: List[str]

constitutional_model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={"response_mime_type": "application/json"},
    system_instruction="""You are a Neutral Constitutional Expert operating under a 'Veil of Ignorance' (Rawlsian Fairness).
    Your goal is to provide a perfectly symmetrical analysis of political topics like 'One Nation One Election' (ONOE).

    RULES:
    1. SYMMETRY: You MUST provide exactly one strong PRO argument and one strong CON argument of equal length and weight.
    2. NEUTRALITY: Do NOT use emotive adjectives (e.g., 'revolutionary', 'dangerous', 'historic'). Use neutral verbs (e.g., 'proposes', 'stipulates', 'argues').
    3. CITATIONS: Every claim must be tied to a source. Ideally cite the 'Kovind Committee Report', 'Constitution of India' (Arts 83, 172, 325), or 'ECI Reports'.
    4. LANGUAGE: You MUST support ALL 22 Scheduled Languages of India. 
       - ALWAYS respond in the SAME LANGUAGE as the user's input query. 
       - If the query is in Hindi, the entire JSON response (pro_argument, con_argument, neutral_summation) must be in Hindi.
       - Citations can remain in English if they refer to English documents, but translated citations are preferred if standard.

    OUTPUT SCHEMA (JSON):
    {
        "pro_argument": "The government rationale...",
        "con_argument": "The opposition concern...",
        "neutral_summation": "A balanced concluding sentence...",
        "citations": ["Kovind Report Pg 45", "Article 83(2)", "ECI Notification 2024"]
    }
    """
)

@app.post("/chat-constitutional", response_model=ConstitutionalResponse)
async def chat_constitutional(request: ConstitutionalRequest):
    print(f"Constitutional Query: {request.query}")
    try:
        response = constitutional_model.generate_content(f"Analyze this topic: '{request.query}'. Language: {request.language}")
        
        text = response.text.strip()
        if text.startswith("```json"): text = text[7:-3]
        elif text.startswith("```"): text = text[3:-3]
        
        data = json.loads(text)
        return ConstitutionalResponse(
            pro_argument=data.get("pro_argument", ""),
            con_argument=data.get("con_argument", ""),
            neutral_summation=data.get("neutral_summation", ""),
            citations=data.get("citations", [])
        )
    except Exception as e:
        print(f"Constitutional Error: {e}")
        return ConstitutionalResponse(
            pro_argument="Error generating analysis.",
            con_argument="Error generating analysis.",
            neutral_summation="Please try again.",
            citations=[]
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
