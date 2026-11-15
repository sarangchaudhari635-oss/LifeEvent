"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, Sparkles, Loader2 } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface VoiceRecorderProps {
  language: Language;
  onTranscriptChange: (text: string) => void;
  initialText?: string;
}

const LANG_CODE_MAP: Record<Language, string> = {
  en: "en",
  hi: "hi",
  mr: "mr",
};

export function VoiceRecorder({
  language,
  onTranscriptChange,
  initialText = "",
}: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [sarvamAvailable, setSarvamAvailable] = useState(false);
  const [mediaRecorderSupported, setMediaRecorderSupported] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const t = translations[language] || translations.en;

  // Check MediaRecorder + Sarvam availability on mount
  useEffect(() => {
    const hasMediaRecorder =
      typeof window !== "undefined" &&
      !!window.MediaRecorder &&
      !!navigator.mediaDevices?.getUserMedia;
    setMediaRecorderSupported(hasMediaRecorder);

    // Non-blocking check if Sarvam STT backend is configured
    fetch("/api/voice/transcribe")
      .then((r) => r.json())
      .then((d) => setSarvamAvailable(d?.configured === true))
      .catch(() => setSarvamAvailable(false));
  }, []);

  const updateTranscript = useCallback(
    (text: string) => {
      setTranscript(text);
      onTranscriptChange(text);
    },
    [onTranscriptChange]
  );

  // Send recorded audio to Sarvam AI via our Next.js proxy endpoint
  const transcribeWithSarvam = useCallback(
    async (audioBlob: Blob) => {
      setIsProcessing(true);
      try {
        const form = new FormData();
        // Try wav first; some browsers record as webm
        const filename = audioBlob.type.includes("webm")
          ? "recording.webm"
          : "recording.wav";
        form.append("file", audioBlob, filename);
        form.append("language_code", LANG_CODE_MAP[language] || "unknown");

        const res = await fetch("/api/voice/transcribe", {
          method: "POST",
          body: form,
        });
        const data = await res.json();

        if (data.status === "success" && data.transcript) {
          updateTranscript(data.transcript);
        } else if (data.transcript === "" && data.status === "success") {
          // Empty result – could be silent audio; keep existing text
        }
      } catch (err) {
        console.warn("[VoiceRecorder] Sarvam transcription failed:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [language, updateTranscript]
  );

  // Start MediaRecorder recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || "audio/webm",
        });
        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());
        await transcribeWithSarvam(audioBlob);
      };

      recorder.start(250); // collect chunks every 250ms
      setIsListening(true);
    } catch (err) {
      console.warn("[VoiceRecorder] Microphone access denied:", err);
      // Fallback to simulated demo
      injectDemo();
    }
  }, [transcribeWithSarvam]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const injectDemo = useCallback(() => {
    const simulatedVoices: Record<Language, string> = {
      en: "My father Ramesh Kulkarni has severe chest pain. We rushed him to Sample City Hospital. Doctors say he needs urgent angioplasty. We have Sample Health Insurance but I don't know what is covered or what to arrange right now.",
      hi: "मेरे पिताजी को छाती में तेज दर्द हुआ है। हम उन्हें सॅम्पल सिटी अस्पताल लाए हैं। डॉक्टरों का कहना है कि तुरंत एंजियोप्लास्टी करानी होगी।",
      mr: "माझ्या वडिलांच्या छातीत तीव्र वेदना होत आहेत. आम्ही त्यांना सॅम्पल सिटी हॉस्पिटलमध्ये दाखल केले आहे.",
    };
    updateTranscript(simulatedVoices[language] || simulatedVoices.en);
  }, [language, updateTranscript]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      stopRecording();
      return;
    }

    if (!mediaRecorderSupported) {
      // Browser doesn't support recording — inject demo text
      injectDemo();
      return;
    }

    await startRecording();
  }, [isListening, mediaRecorderSupported, startRecording, stopRecording, injectDemo]);

  return (
    <div className="space-y-4">
      {/* Big Thumb-Accessible Voice Button (360px mobile ready) */}
      <div className="flex flex-col items-center justify-center p-6 bg-paytm-sky rounded-xl border border-blue-100 text-center">
        <button
          type="button"
          onClick={toggleListening}
          disabled={isProcessing}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-lg active:scale-90 ${
            isListening
              ? "bg-red-500 text-white animate-pulse ring-8 ring-red-100"
              : isProcessing
              ? "bg-amber-500 text-white ring-4 ring-amber-100 cursor-wait"
              : "bg-paytm-navy text-white hover:bg-paytm-navyDark ring-4 ring-blue-100"
          }`}
          aria-label={isListening ? t.stopListening : t.startListening}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 sm:w-9 sm:h-9 animate-spin" />
          ) : isListening ? (
            <MicOff className="w-8 h-8 sm:w-9 sm:h-9" />
          ) : (
            <Mic className="w-8 h-8 sm:w-9 sm:h-9 text-paytm-cyan" />
          )}
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">
            {isProcessing ? "Processing" : isListening ? "Stop" : "Tap to Speak"}
          </span>
        </button>

        <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-3">
          {isProcessing
            ? "Transcribing your voice with Sarvam AI..."
            : isListening
            ? t.listening
            : "Tap the mic and describe your situation in plain words"}
        </p>

        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
          <Volume2 className="w-3.5 h-3.5 text-paytm-cyan" />
          <span>
            {sarvamAvailable
              ? "Powered by Sarvam AI · English, हिंदी, मराठी"
              : "Supports English, हिंदी, and मराठी"}
          </span>
        </div>
      </div>

      {/* Real-time Transcript Editor */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>What the AI Understood (You can edit this)</span>
          {transcript && (
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Transcribed
            </span>
          )}
        </label>
        <textarea
          rows={4}
          value={transcript}
          onChange={(e) => updateTranscript(e.target.value)}
          placeholder={t.speakPlaceholder}
          className="w-full p-3.5 text-sm rounded-lg border border-slate-300 focus:border-paytm-cyan focus:ring-1 focus:ring-paytm-cyan bg-white text-slate-900 leading-relaxed placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
