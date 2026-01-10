import base64
import os
import httpx
from typing import List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure Sarvam AI
SARVAM_API_KEY = os.getenv("SARVAM_AI_API_KEY")
SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"

# Voice Models Configuration (Gemini)
voice_model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={"temperature": 0.7, "max_output_tokens": 1024},
    system_instruction="""You are S.A.T.Y.A. Assistant, a multilingual voice assistant for Indian elections and governance.

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

LANGUAGE HANDLING:
- Detect user's language from their query (Sarvam provides this)
- Respond in the same language
"""
)

class VoiceChatRequest(BaseModel):
    audio_base64: str
    conversation_history: Optional[List[dict]] = []

class VoiceChatResponse(BaseModel):
    text_query: str
    text_response: str
    audio_base64: str
    detected_language: str

@app.post("/voice/chat", response_model=VoiceChatResponse)
async def voice_chat(request: VoiceChatRequest):
    """
    Complete voice interaction: Sarvam STT -> Gemini Response -> Sarvam TTS
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
                data={"model": "saaras:v1"}
            )
            
            if stt_response.status_code != 200:
                print(f"Sarvam STT Error: {stt_response.text}")
                return JSONResponse({"error": "Speech-to-Text failed"}, status_code=500)
            
            stt_data = stt_response.json()
            detected_text = stt_data.get("transcript", "")
            detected_lang = stt_data.get("language_code", "en-IN") # Sarvam returns language code

        if not detected_text:
            return JSONResponse({"error": "No speech detected"}, status_code=400)

        print(f"STT: {detected_text} ({detected_lang})")

        # 2. Build conversation context and Generate AI response
        conversation_context = ""
        for msg in request.conversation_history[-5:]:
            role = "User" if msg.get("role") == "user" else "Assistant"
            conversation_context += f"{role}: {msg.get('content', '')}\n"
        
        prompt = f"{conversation_context}\nUser ({detected_lang}): {detected_text}\nAssistant:"
        ai_response = voice_model.generate_content(prompt)
        response_text = ai_response.text.strip()
        
        print(f"AI: {response_text}")

        # 3. Text-to-Speech via Sarvam AI (Bulbul)
        async with httpx.AsyncClient() as client:
            tts_payload = {
                "inputs": [response_text],
                "target_language_code": detected_lang,
                "speaker": "anushka", # Updated to a valid speaker
                "model": "bulbul:v2"   # Updated to a valid model
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
                # Fallback or error
                return JSONResponse({"error": "Text-to-Speech failed"}, status_code=500)
            
            tts_data = tts_response.json()
            # Sarvam returns an array of audios for each input string
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
