import os
import logging
from typing import Optional, Dict, Any
import httpx

logger = logging.getLogger(__name__)

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_DEFAULT_MODEL = os.getenv("SARVAM_STT_MODEL", "saaras:v3")

SUPPORTED_LANGUAGES = {
    "hi": "hi-IN",
    "mr": "mr-IN",
    "en": "en-IN",
    "te": "te-IN",
    "ta": "ta-IN",
    "bn": "bn-IN",
    "gu": "gu-IN",
    "kn": "kn-IN",
    "ml": "ml-IN",
    "pa": "pa-IN",
    "od": "od-IN",
    "unknown": "unknown"
}

async def transcribe_audio(
    audio_bytes: bytes,
    filename: str = "audio.wav",
    content_type: str = "audio/wav",
    language_code: Optional[str] = None,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Transcribes spoken voice audio using Sarvam AI Indic Speech-to-Text (saaras:v3).
    Supports Hindi, Marathi, Indian English, and auto-detection.
    """
    sarvam_key = api_key if api_key is not None else os.getenv("SARVAM_API_KEY")
    if not sarvam_key:
        logger.error("SARVAM_API_KEY is not configured.")
        return {
            "status": "error",
            "message": "SARVAM_API_KEY is not configured on the server.",
            "transcript": ""
        }

    # Normalize language code
    normalized_lang = "unknown"
    if language_code:
        lang_lower = language_code.lower()
        if lang_lower in SUPPORTED_LANGUAGES:
            normalized_lang = SUPPORTED_LANGUAGES[lang_lower]
        elif "-" in language_code:
            normalized_lang = language_code
        else:
            normalized_lang = "unknown"

    headers = {
        "api-subscription-key": sarvam_key
    }

    files = {
        "file": (filename or "recording.wav", audio_bytes, content_type or "audio/wav")
    }
    
    data = {
        "model": SARVAM_DEFAULT_MODEL,
        "language_code": normalized_lang
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                SARVAM_STT_URL,
                headers=headers,
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                resp_json = response.json()
                return {
                    "status": "success",
                    "transcript": resp_json.get("transcript", ""),
                    "language_code": resp_json.get("language_code", normalized_lang),
                    "language_probability": resp_json.get("language_probability"),
                    "request_id": resp_json.get("request_id")
                }
            else:
                logger.error(f"Sarvam AI STT error {response.status_code}: {response.text}")
                return {
                    "status": "error",
                    "status_code": response.status_code,
                    "message": f"Sarvam AI STT service error: {response.text}",
                    "transcript": ""
                }
    except Exception as e:
        logger.exception("Exception occurred while calling Sarvam AI STT API")
        return {
            "status": "error",
            "message": str(e),
            "transcript": ""
        }
