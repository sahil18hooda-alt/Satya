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
try:
    from .deepfake_detection import DeepfakeDetector
except ImportError:
    try:
        from deepfake_detection import DeepfakeDetector
    except ImportError:
        print("CRITICAL: DeepfakeDetector Module NOT FOUND. Deepfake features will fail.")
        DeepfakeDetector = None
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
if DeepfakeDetector:
    try:
        deepfake_detector = DeepfakeDetector()
    except Exception as e:
        print(f"Failed to load DeepfakeDetector: {e}")

@app.get("/api")
def read_root():
    return {"message": "Bhartiya-Election AI Backend (Vercel Serverless) is running"}

@app.get("/")
def read_root_slash():
    return {"message": "Bhartiya-Election AI Backend is running"}

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
       - ALWAYS respond in the Target Language specified in the prompt. 
       - If no target language is specified, detect the language of the query.
       - If the target language is Hindi, the entire JSON response (pro_argument, con_argument, neutral_summation) must be in Hindi.
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
    # Map codes to full names for better AI prompting
    LANG_MAP = {
        'en': 'English',
        'hi': 'Hindi',
        'bn': 'Bengali',
        'te': 'Telugu',
        'ta': 'Tamil',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'pa': 'Punjabi',
        'or': 'Odia',
        'as': 'Assamese'
    }
    target_lang = LANG_MAP.get(request.language, request.language)
    
    print(f"Constitutional Query: {request.query} (Lang Code: {request.language} -> {target_lang})")
    
    prompt = f"Analyze this topic: '{request.query}'."
    if target_lang.lower() != "english":
         prompt += f" Target Language: {target_lang}. Force output in {target_lang}."
    else:
         prompt += " Respond in the same language as the query."
    
    prompt += " Output strict JSON."

    try:
        response = constitutional_model.generate_content(prompt)
        
        text = response.text.strip()
        print(f"Raw AI Response: {text}")
        if text.startswith("```json"): text = text[7:-3]
        elif text.startswith("```"): text = text[3:-3]
        
        data = json.loads(text)
        if isinstance(data, list):
            data = data[0]
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

# --- Translation Logic (BharatGen) ---

class TranslateRequest(BaseModel):
    text: str
    target_language: str

class TranslateResponse(BaseModel):
    translated_text: str

translate_model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={"response_mime_type": "application/json"},
    system_instruction="""You are 'BharatGen', India's sovereign AI translator. 
    Your task is to translate the given text into the target Indian language accurately, preserving nuance and context.
    Return JSON: { "translated_text": "..." }
    """
)

@app.post("/translate", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    try:
        if request.target_language.lower() == "en" or request.target_language.lower() == "english":
             return TranslateResponse(translated_text=request.text)

        response = translate_model.generate_content(
            f"Translate this text to {request.target_language}: '{request.text}'"
        )
        
        text = response.text.strip()
        if text.startswith("```json"): text = text[7:-3]
        elif text.startswith("```"): text = text[3:-3]
        
        data = json.loads(text)
        return TranslateResponse(translated_text=data.get("translated_text", request.text))

    except Exception as e:
        print(f"Translation Error: {e}")
        return TranslateResponse(translated_text=request.text) 

# --- News Endpoint (Crash Fix) ---

class NewsRequest(BaseModel):
    language: Optional[str] = "English"

@app.post("/latest-news")
async def get_latest_news(request: NewsRequest):
    # Mock Data
    news_items = [
        {
            "headline": "Election Commission Announces Dates for 2026 General Elections",
            "summary": "The ECI has finalized the schedule for the upcoming general elections, spanning 7 phases starting from April 15th.",
            "source": "ECI Official",
            "date": "2 hours ago",
            "category": "Official"
        },
        {
            "headline": "Voter Turnout Expected to Cross 70% in Phase 1",
            "summary": "Analysts predict a record-breaking turnout in the first phase of polling due to increased awareness campaigns.",
            "source": "India Today",
            "date": "4 hours ago",
            "category": "Analysis"
        },
        {
            "headline": "New Guidelines for Polling Booth Security Released",
            "summary": "Strict measures including drone surveillance and webcasting will be implemented across all sensitive booths.",
            "source": "PIB",
            "date": "Yesterday",
            "category": "Security"
        },
        {
            "headline": "PM Addresses Mega Rally in Varanasi",
            "summary": "The Prime Minister highlighted the government's achievements over the last term and promised further development.",
            "source": "DD News",
            "date": "Today",
            "category": "Campaign"
        },
        {
            "headline": "Supreme Court Hears Plea on EVM Verification",
            "summary": "The apex court has agreed to hear a PIL seeking 100% VVPAT verification for the upcoming polls.",
            "source": "Live Law",
            "date": "Just Now",
            "category": "Legal"
        },
         {
            "headline": "Fact Check: Viral Video of Booth Capturing is Fake",
            "summary": "A video circulating on WhatsApp claims to be recent but is actually from 2014. Authorities have clarified.",
            "source": "Satya Verify",
            "date": "1 hour ago",
            "category": "Fact Check"
        }
    ]
    
    # If language is not English, we *could* translate here, but for now return English to fix crash
    # Future: Use translate_model.generate_content to translate mock data
    
    return news_items

# --- Deepfake Detective ---

# Global Detector Instance
detector = None
try:
    from api.deepfake_detection import DeepfakeDetector
    detector = DeepfakeDetector() # Load models once
except ImportError:
    print("Deepfake Module not found. Feature disabled.")
except Exception as e:
    print(f"Deepfake Model Load Error: {e}")

@app.post("/detect-deepfake")
async def detect_deepfake(file: UploadFile = File(...)):
    if not detector:
        return JSONResponse({"error": "Deepfake module unavailable"}, status_code=500)
    
    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
    
    try:
        # Run detection
        result = detector.detect(tmp_path)
        if "error" in result:
             return JSONResponse(result, status_code=400)
        return result
    except Exception as e:
        print(f"Detection Error: {e}")
        return JSONResponse({"error": f"Analysis failed: {str(e)}"}, status_code=500)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path) 

# --- Voice Assistant ---
from google.cloud import speech_v1
from google.cloud import texttospeech_v1

# Voice Model Configuration
voice_model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={"temperature": 0.7, "max_output_tokens": 1024},
    system_instruction="""You are a multilingual voice assistant for Indian elections and governance.

CORE CAPABILITIES:
- Support all 22 scheduled Indian languages
- Provide accurate information about elections, ONOE (One Nation One Election), and Indian government
- Maintain natural, conversational tone suitable for voice interaction
- Keep responses concise (2-3 sentences max) for voice delivery

RESPONSE GUIDELINES:
- Speak naturally as if in conversation
- Avoid bullet points, lists, or formatting
- Use simple, clear language
- Provide specific facts with sources when possible
- Ask clarifying questions if query is ambiguous

TOPICS YOU COVER:
- Election processes and procedures
- Voter registration and rights
- One Nation One Election (ONOE) proposal
- Electoral Commission of India (ECI) guidelines
- Constitutional provisions related to elections
- Voting methods and technology
- Election schedules and phases

LANGUAGE HANDLING:
- Detect user's language from their query
- Respond in the same language
- Maintain conversation context across turns
"""
)

class VoiceChatRequest(BaseModel):
    audio_base64: str
    conversation_history: Optional[List[dict]] = []

class VoiceChatResponse(BaseModel):
    text_response: str
    audio_base64: str
    detected_language: str

@app.post("/voice/chat", response_model=VoiceChatResponse)
async def voice_chat(request: VoiceChatRequest):
    """Complete voice interaction: STT -> AI Response -> TTS"""
    try:
        speech_client = speech_v1.SpeechClient()
        tts_client = texttospeech_v1.TextToSpeechClient()
        
        audio_content = base64.b64decode(request.audio_base64)
        audio = speech_v1.RecognitionAudio(content=audio_content)
        
        # All 22 Scheduled Indian Languages
        language_codes = [
            'hi-IN',  # Hindi
            'en-IN',  # English
            'bn-IN',  # Bengali
            'te-IN',  # Telugu
            'mr-IN',  # Marathi
            'ta-IN',  # Tamil
            'gu-IN',  # Gujarati
            'kn-IN',  # Kannada
            'ml-IN',  # Malayalam
            'pa-IN',  # Punjabi
            'or-IN',  # Odia
            'as-IN',  # Assamese
            'ur-IN',  # Urdu
        ]
        
        detected_text = ""
        detected_lang = "en-IN"
        best_confidence = 0.0
        
        # Try each language and pick the one with highest confidence
        for lang_code in language_codes:
            try:
                config = speech_v1.RecognitionConfig(
                    encoding=speech_v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                    sample_rate_hertz=48000,
                    language_code=lang_code,
                    enable_automatic_punctuation=True,
                    model='latest_long',  # Better accuracy
                )
                
                response = speech_client.recognize(config=config, audio=audio)
                
                if response.results and len(response.results) > 0:
                    result = response.results[0]
                    if len(result.alternatives) > 0:
                        alternative = result.alternatives[0]
                        confidence = alternative.confidence if hasattr(alternative, 'confidence') else 0.5
                        
                        # Pick the language with highest confidence
                        if confidence > best_confidence and alternative.transcript:
                            detected_text = alternative.transcript
                            detected_lang = lang_code
                            best_confidence = confidence
                            print(f"  {lang_code}: '{alternative.transcript}' (confidence: {confidence:.2f})")
            except Exception as e:
                # Language not supported or other error, continue
                continue
        
        if not detected_text:
            return JSONResponse({"error": "Could not understand audio"}, status_code=400)
        
        print(f"Voice: '{detected_text}' ({detected_lang})")
        
        conversation_context = ""
        for msg in request.conversation_history[-5:]:
            conversation_context += f"{msg.get('role', 'user')}: {msg.get('content', '')}\n"
        
        prompt = f"{conversation_context}\nUser: {detected_text}\nAssistant:"
        ai_response = voice_model.generate_content(prompt)
        response_text = ai_response.text.strip()
        
        synthesis_input = texttospeech_v1.SynthesisInput(text=response_text)
        
        # Select natural-sounding voice based on detected language
        # Using WaveNet/Neural2 for human-like quality
        voice_mapping = {
            # Try different Hindi voices - Neural2-D is male, often clearer
            'hi-IN': {'name': 'hi-IN-Neural2-D', 'gender': texttospeech_v1.SsmlVoiceGender.MALE},
            'en-IN': {'name': 'en-IN-Neural2-A', 'gender': texttospeech_v1.SsmlVoiceGender.FEMALE},
            'bn-IN': {'name': 'bn-IN-Wavenet-A', 'gender': texttospeech_v1.SsmlVoiceGender.FEMALE},
            'te-IN': {'name': 'te-IN-Standard-A', 'gender': texttospeech_v1.SsmlVoiceGender.FEMALE},
            'mr-IN': {'name': 'mr-IN-Wavenet-A', 'gender': texttospeech_v1.SsmlVoiceGender.FEMALE},
            'ta-IN': {'name': 'ta-IN-Wavenet-A', 'gender': texttospeech_v1.SsmlVoiceGender.FEMALE},
            'gu-IN': {'name': 'gu-IN-Wavenet-A', 'gender': texttospeech_v1.SsmlVoiceGender.FEMALE},
            'kn-IN': {'name': 'kn-IN-Wavenet-A', 'gender': texttospeech_v1.SsmlVoiceGender.FEMALE},
            'ml-IN': {'name': 'ml-IN-Wavenet-A', 'gender': texttospeech_v1.SsmlVoiceGender.FEMALE},
            'pa-IN': {'name': 'pa-IN-Wavenet-A', 'gender': texttospeech_v1.SsmlVoiceGender.FEMALE},
        }
        
        voice_config = voice_mapping.get(detected_lang, voice_mapping['en-IN'])
        
        voice_params = texttospeech_v1.VoiceSelectionParams(
            language_code=detected_lang,
            name=voice_config['name'],
            ssml_gender=voice_config['gender']
        )
        
        audio_config = texttospeech_v1.AudioConfig(
            audio_encoding=texttospeech_v1.AudioEncoding.MP3,
            speaking_rate=0.95,  # Slightly slower for clarity
            pitch=0.0,
            effects_profile_id=['headphone-class-device']  # Optimized for headphones
        )
        
        tts_response = tts_client.synthesize_speech(
            input=synthesis_input, voice=voice_params, audio_config=audio_config
        )
        
        audio_base64 = base64.b64encode(tts_response.audio_content).decode('utf-8')
        
        return VoiceChatResponse(
            text_response=response_text,
            audio_base64=audio_base64,
            detected_language=detected_lang
        )
        
    except Exception as e:
        print(f"Voice Error: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)
 


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
