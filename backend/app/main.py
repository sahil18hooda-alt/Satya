import os
import json
import tempfile
import base64
import io
import httpx
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from gtts import gTTS
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
from dotenv import load_dotenv
try:
    from deepfake_detection import DeepfakeDetector
except ImportError:
    from .deepfake_detection import DeepfakeDetector

# Load environment variables from .env file
load_dotenv(override=True)

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

class ConstitutionalRequest(BaseModel):
    query: str
    language: Optional[str] = "en"

class ConstitutionalResponse(BaseModel):
    pro_argument: str
    con_argument: str
    neutral_summation: str
    citations: List[str]

class NewsRequest(BaseModel):
    language: str

class VoiceChatRequest(BaseModel):
    audio_base64: str
    conversation_history: Optional[List[dict]] = []

class VoiceChatResponse(BaseModel):
    text_query: str
    text_response: str
    audio_base64: str
    detected_language: str

# --- Groq Configuration ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY not found in environment variables.")

groq_client = Groq(api_key=GROQ_API_KEY)

# Separate Groq Client for Voice AI
VOICE_GROQ_API_KEY = os.getenv("VOICE_GROQ_API_KEY")
if not VOICE_GROQ_API_KEY:
    print("WARNING: VOICE_GROQ_API_KEY not found, falling back to GROQ_API_KEY")
    VOICE_GROQ_API_KEY = GROQ_API_KEY

voice_groq_client = Groq(api_key=VOICE_GROQ_API_KEY)

# --- Sarvam AI Configuration (for Voice) ---
SARVAM_API_KEY = os.getenv("SARVAM_AI_API_KEY")
SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"

# Initialize Deepfake Detector
deepfake_detector = None
try:
    deepfake_detector = DeepfakeDetector()
except Exception as e:
    print(f"Failed to load DeepfakeDetector: {e}")

@app.get("/")
def read_root():
    return {"message": "Bhartiya-Election AI Backend (Groq Powered) is running"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_rumor(request: AnalyzeRequest):
    query_text = request.text
    print(f"Analyzing with Groq: {query_text}")

    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Server Error: Groq API Key not configured.")

    try:
        system_prompt = """You are an expert Fact Checker and Rumor Buster for the Indian Election context. 
Your task is to verify rumors and misinformation with high precision.

CRITICAL: You MUST output ONLY valid JSON. Do NOT include markdown code blocks, explanations, or any text outside the JSON object.

Output must be a strictly valid JSON object with the following schema:
{
  "isFake": boolean,
  "confidence": float (0.0 to 1.0),
  "explanation": {
    "highlightedWords": [string] (Extract EXACT words/phrases from input that are misleading),
    "reason": string (Detailed analysis in ENGLISH explaining WHY the claim is fake/misleading)
  },
  "contextLinks": [
    {
      "title": string (Source Title in ENGLISH),
      "excerpt": string (Relevant quote in ENGLISH),
      "url": string (Link to official source e.g., eci.gov.in, pib.gov.in)
    }
  ]
}

IMPORTANT: All text fields (reason, title, excerpt) MUST be in ENGLISH to ensure valid JSON encoding.
If the claim is VAGUE or OPINION, treat it as 'isFake': false but low confidence."""

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Verify this claim in English: '{query_text}'"}
            ],
            temperature=0.2,
            max_tokens=2048,
            response_format={"type": "json_object"}
        )
        
        response_text = response.choices[0].message.content
        data = json.loads(response_text)
        
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
        print(f"Groq Error: {e}")
        return AnalyzeResponse(
            isFake=False,
            confidence=0.0,
            originalText=query_text,
            explanation=Explanation(highlightedWords=[], reason="Error connecting to AI verification service."),
            contextLinks=[]
        )

@app.post("/chat-constitutional", response_model=ConstitutionalResponse)
async def chat_constitutional(request: ConstitutionalRequest):
    print(f"Constitutional Query: {request.query}")
    try:
        system_prompt = """You are a Neutral Constitutional Expert operating under a 'Veil of Ignorance' (Rawlsian Fairness).
Your goal is to provide a perfectly symmetrical analysis of political topics like 'One Nation One Election' (ONOE).

RULES:
1. SYMMETRY: You MUST provide exactly one strong PRO argument and one strong CON argument of equal length and weight.
2. NEUTRALITY: Do NOT use emotive adjectives (e.g., 'revolutionary', 'dangerous'). Use neutral verbs (e.g., 'proposes', 'stipulates').
3. CITATIONS: Every claim must be tied to a source. Cite 'Kovind Committee Report', 'Constitution of India' (Arts 83, 172, 325), or 'ECI Reports'.
4. LANGUAGE: ALWAYS respond in the SAME LANGUAGE as the user's input query.

OUTPUT SCHEMA (JSON):
{
    "pro_argument": "The government rationale...",
    "con_argument": "The opposition concern...",
    "neutral_summation": "A balanced concluding sentence...",
    "citations": ["Kovind Report Pg 45", "Article 83(2)", "ECI Notification 2024"]
}"""

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze this topic: '{request.query}'. Language: {request.language}"}
            ],
            temperature=0.2,
            max_tokens=4096,
            response_format={"type": "json_object"}
        )
        
        text = response.choices[0].message.content
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

@app.post("/analyze-image", response_model=AnalyzeResponse)
async def analyze_image(file: UploadFile = File(...)):
    print(f"Analyzing Image: {file.filename}")
    
    # Note: Groq doesn't support vision yet, so we'll return a placeholder
    # You could integrate with another service like GPT-4 Vision or use OCR + text analysis
    return AnalyzeResponse(
        isFake=False,
        confidence=0.0,
        originalText="[Image Analysis - Vision API not available with Groq]",
        explanation=Explanation(
            highlightedWords=[],
            reason="Image analysis requires vision API. Please use text-based fact-checking."
        ),
        contextLinks=[]
    )

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

@app.post("/latest-news")
async def latest_news(request: NewsRequest):
    print(f"News Request: {request.language}")
    try:
        system_prompt = """You are an unbiased news aggregator for Indian Elections.
Generate 6 latest distinct fictional but realistic news headlines and summaries about Indian Elections.

CRITICAL: You MUST return a JSON object with a "news" key containing an array of 6 news items.

OUTPUT SCHEMA (JSON):
{
  "news": [
    {
      "headline": "Headline in requested language",
      "summary": "Short 2-sentence summary in requested language",
      "date": "2026-02-13",
      "source": "Source Name (e.g. DD News, ECI)",
      "category": "One of [Official, Updates, Policy, Legal, Technology, Environment]"
    }
  ]
}"""
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate 6 latest election news items in {request.language} language. Return JSON with 'news' array."}
            ],
            temperature=0.7,
            max_tokens=4096,
            response_format={"type": "json_object"}
        )
        
        text = response.choices[0].message.content
        print(f"News API Response: {text[:200]}...")  # Debug log
        data = json.loads(text)
        
        # Handle if response is wrapped in an object
        news_items = []
        if isinstance(data, dict) and "news" in data:
            news_items = data["news"]
        elif isinstance(data, dict) and "items" in data:
            news_items = data["items"]
        elif isinstance(data, dict) and "articles" in data:
            news_items = data["articles"]
        elif isinstance(data, list):
            news_items = data
        else:
            print(f"Unexpected news response format: {list(data.keys())}")
            return []
        
        # Add relevant images based on category
        category_images = {
            "Official": "https://images.pexels.com/photos/8828474/pexels-photo-8828474.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
            "Updates": "https://images.pexels.com/photos/6953876/pexels-photo-6953876.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
            "Policy": "https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
            "Legal": "https://images.pexels.com/photos/8111769/pexels-photo-8111769.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
            "Technology": "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
            "Environment": "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
        }
        
        # Add image_url to each news item based on category
        for item in news_items:
            category = item.get("category", "Official")
            item["image_url"] = category_images.get(category, category_images["Official"])
        
        return news_items

    except Exception as e:
        print(f"News Error: {e}")
        return []

@app.post("/voice/chat", response_model=VoiceChatResponse)
async def voice_chat(request: VoiceChatRequest):
    """
    Complete voice interaction: Sarvam STT -> Groq Response -> Sarvam TTS
    """
    try:
        if not SARVAM_API_KEY:
            return JSONResponse({"error": "Sarvam API Key not configured"}, status_code=500)

        # 1. Speech-to-Text via Sarvam AI
        audio_content = base64.b64decode(request.audio_base64)
        
        async with httpx.AsyncClient() as client:
            # Sarvam STT takes multipart/form-data
            files = {"file": ("audio.webm", audio_content, "audio/webm")}
            headers = {"api-subscription-key": SARVAM_API_KEY}
            
            stt_response = await client.post(
                SARVAM_STT_URL,
                headers=headers,
                files=files,
                data={"model": "saaras:v3"}
            )
            
            if stt_response.status_code != 200:
                print(f"Sarvam STT Error: {stt_response.text}")
                return JSONResponse({"error": "Speech-to-Text failed"}, status_code=500)
            
            stt_data = stt_response.json()
            detected_text = stt_data.get("transcript", "")
            detected_lang = stt_data.get("language_code", "en-IN")

        if not detected_text:
            return JSONResponse({"error": "No speech detected"}, status_code=400)

        print(f"STT: {detected_text} ({detected_lang})")

        # 2. Build conversation context and Generate AI response with Groq
        conversation_messages = [
            {
                "role": "system",
                "content": """You are S.A.T.Y.A. Assistant, a multilingual voice assistant for Indian elections and governance.

CORE CAPABILITIES:
- Support all 22 scheduled Indian languages
- Provide accurate information about elections, ONOE (One Nation One Election), and Indian government
- Maintain natural, conversational tone suitable for voice interaction
- Keep responses concise (2-3 sentences max) for voice delivery

RESPONSE GUIDELINES:
- Speak naturally as if in conversation
- Avoid bullet points, lists, or formatting
- Use simple, clear language in ENGLISH
- Provide specific facts with sources when possible"""
            }
        ]
        
        # Add conversation history
        for msg in request.conversation_history[-5:]:
            conversation_messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add current user query
        conversation_messages.append({
            "role": "user",
            "content": f"User asked in {detected_lang}: {detected_text}"
        })
        
        # Generate response with Groq (using dedicated voice client)
        ai_response = voice_groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=conversation_messages,
            temperature=0.7,
            max_tokens=512
        )
        
        response_text = ai_response.choices[0].message.content.strip()
        print(f"AI: {response_text}")

        # 3. Text-to-Speech via Sarvam AI (Bulbul)
        async with httpx.AsyncClient() as client:
            tts_payload = {
                "inputs": [response_text],
                "target_language_code": detected_lang,
                "speaker": "anushka",
                "model": "bulbul:v2"
            }
            
            headers = {
                "api-subscription-key": SARVAM_API_KEY,
                "Content-Type": "application/json"
            }
            
            tts_response = await client.post(
                SARVAM_TTS_URL,
                headers=headers,
                json=tts_payload
            )
            
            if tts_response.status_code != 200:
                print(f"Sarvam TTS Error: {tts_response.text}")
                return JSONResponse({"error": "Text-to-Speech failed"}, status_code=500)
            
            tts_data = tts_response.json()
            audio_base64 = tts_data.get("audios", [""])[0]

        return VoiceChatResponse(
            text_query=detected_text,
            text_response=response_text,
            audio_base64=audio_base64,
            detected_language=detected_lang
        )
        
    except Exception as e:
        print(f"Voice Chat Exception: {str(e)}")
        return JSONResponse({"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
