import asyncio
import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from backend.app.main import voice_service_status
from backend.app.core.voice import transcribe_audio, SUPPORTED_LANGUAGES

def test_voice_status_function():
    data = voice_service_status()
    assert data["provider"] == "Sarvam AI"
    assert data["model"] == "saaras:v3"
    assert "languages" in data

def test_voice_languages_mapping():
    assert SUPPORTED_LANGUAGES["hi"] == "hi-IN"
    assert SUPPORTED_LANGUAGES["mr"] == "mr-IN"
    assert SUPPORTED_LANGUAGES["en"] == "en-IN"
    assert SUPPORTED_LANGUAGES["unknown"] == "unknown"

def test_transcribe_audio_without_key():
    result = asyncio.run(transcribe_audio(
        audio_bytes=b"dummy audio bytes",
        filename="test.wav",
        content_type="audio/wav",
        api_key=""
    ))
    assert result["status"] == "error"
    assert "SARVAM_API_KEY is not configured" in result["message"]

def test_transcribe_audio_mock_success():
    mock_instance = AsyncMock()
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "request_id": "req-12345",
        "transcript": "मेरे पिताजी को सीने में दर्द है",
        "language_code": "hi-IN",
        "language_probability": 0.98
    }
    mock_instance.post.return_value = mock_resp
    mock_instance.__aenter__.return_value = mock_instance
    mock_instance.__aexit__.return_value = None

    with patch("backend.app.core.voice.httpx.AsyncClient", return_value=mock_instance):
        res = asyncio.run(transcribe_audio(
            audio_bytes=b"fake-bytes",
            filename="sample.wav",
            language_code="hi",
            api_key="test-api-key"
        ))
        assert res["status"] == "success"
        assert res["transcript"] == "मेरे पिताजी को सीने में दर्द है"
        assert res["language_code"] == "hi-IN"
        assert res["language_probability"] == 0.98
