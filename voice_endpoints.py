# Voice Assistant Endpoints
# Add these imports at the top of api/index.py after existing imports

from google.cloud import speech_v1
from google.cloud import texttospeech_v1
import wave

# Voice Models Configuration
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

# Language code mapping for Google Cloud Speech
LANGUAGE_CODES = {
    'hi': 'hi-IN',  # Hindi
    'bn': 'bn-IN',  # Bengali
    'te': 'te-IN',  # Telugu
    'mr': 'mr-IN',  # Marathi
    'ta': 'ta-IN',  # Tamil
    'ur': 'ur-IN',  # Urdu
    'gu': 'gu-IN',  # Gujarati
    'kn': 'kn-IN',  # Kannada
    'ml': 'ml-IN',  # Malayalam
    'pa': 'pa-IN',  # Punjabi
    'en': 'en-IN',  # English (India)
}

class VoiceChatRequest(BaseModel):
    audio_base64: str
    conversation_history: Optional[List[dict]] = []

class VoiceChatResponse(BaseModel):
    text_response: str
    audio_base64: str
    detected_language: str

@app.post("/voice/chat", response_model=VoiceChatResponse)
async def voice_chat(request: VoiceChatRequest):
    """
    Complete voice interaction: STT -> AI Response -> TTS
    """
    try:
        # Initialize Google Cloud clients
        speech_client = speech_v1.SpeechClient()
        tts_client = texttospeech_v1.TextToSpeechClient()
        
        # Decode audio
        audio_content = base64.b64decode(request.audio_base64)
        
        # Speech-to-Text with language detection
        audio = speech_v1.RecognitionAudio(content=audio_content)
        
        # Try multiple language codes for detection
        detected_text = ""
        detected_lang = "en-IN"
        
        for lang_code in ['hi-IN', 'en-IN', 'bn-IN', 'te-IN', 'mr-IN', 'ta-IN']:
            try:
                config = speech_v1.RecognitionConfig(
                    encoding=speech_v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                    sample_rate_hertz=48000,
                    language_code=lang_code,
                    enable_automatic_punctuation=True,
                )
                
                response = speech_client.recognize(config=config, audio=audio)
                
                if response.results:
                    detected_text = response.results[0].alternatives[0].transcript
                    detected_lang = lang_code
                    break
            except:
                continue
        
        if not detected_text:
            return JSONResponse(
                {"error": "Could not understand audio. Please speak clearly."},
                status_code=400
            )
        
        print(f"Detected: '{detected_text}' in {detected_lang}")
        
        # Build conversation context
        conversation_context = ""
        for msg in request.conversation_history[-5:]:  # Last 5 messages
            conversation_context += f"{msg.get('role', 'user')}: {msg.get('content', '')}\n"
        
        # Generate AI response
        prompt = f"{conversation_context}\nUser: {detected_text}\nAssistant:"
        ai_response = voice_model.generate_content(prompt)
        response_text = ai_response.text.strip()
        
        print(f"AI Response: {response_text}")
        
        # Text-to-Speech
        synthesis_input = texttospeech_v1.SynthesisInput(text=response_text)
        
        # Select voice based on detected language
        voice_params = texttospeech_v1.VoiceSelectionParams(
            language_code=detected_lang,
            ssml_gender=texttospeech_v1.SsmlVoiceGender.NEUTRAL
        )
        
        audio_config = texttospeech_v1.AudioConfig(
            audio_encoding=texttospeech_v1.AudioEncoding.MP3,
            speaking_rate=1.0,
            pitch=0.0
        )
        
        tts_response = tts_client.synthesize_speech(
            input=synthesis_input,
            voice=voice_params,
            audio_config=audio_config
        )
        
        # Encode audio to base64
        audio_base64 = base64.b64encode(tts_response.audio_content).decode('utf-8')
        
        return VoiceChatResponse(
            text_response=response_text,
            audio_base64=audio_base64,
            detected_language=detected_lang
        )
        
    except Exception as e:
        print(f"Voice Chat Error: {e}")
        return JSONResponse(
            {"error": f"Voice processing failed: {str(e)}"},
            status_code=500
        )
