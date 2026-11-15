"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface VoiceRecorderProps {
  language: Language;
  onTranscriptChange: (text: string) => void;
  initialText?: string;
}

export function VoiceRecorder({
  language,
  onTranscriptChange,
  initialText = "",
}: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const t = translations[language] || translations.en;

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      // Map language code to SpeechRecognition locale
      const langMap: Record<Language, string> = {
        en: "en-IN",
        hi: "hi-IN",
        mr: "mr-IN",
      };
      recognition.lang = langMap[language] || "en-IN";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + " ";
        }
        setTranscript(currentTranscript.trim());
        onTranscriptChange(currentTranscript.trim());
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language, onTranscriptChange]);

  const toggleListening = () => {
    if (!speechSupported) {
      // Graceful fallback for browsers without speech API: inject simulated spoken emergency
      const simulatedVoices: Record<Language, string> = {
        en: "My father Ramesh Kulkarni has severe chest pain. We rushed him to Sample City Hospital. Doctors are saying he needs urgent angioplasty. We have Sample Health Insurance but I don't know what is covered or what to arrange right now.",
        hi: "मेरे पिताजी को छाती में तेज दर्द हुआ है। हम उन्हें सॅम्पल सिटी अस्पताल लाए हैं। डॉक्टरों का कहना है कि तुरंत एंजियोप्लास्टी करानी होगी। हमारे पास सॅम्पल हेल्थ इंश्योरेंस है लेकिन समझ नहीं आ रहा कितना पैसा खुद भरना होगा।",
        mr: "माझ्या वडिलांच्या छातीत तीव्र वेदना होत आहेत. आम्ही त्यांना सॅम्पल सिटी हॉस्पिटलमध्ये दाखल केले आहे. तातडीने अँजिओप्लास्टी करावी लागेल असे डॉक्टर सांगत आहेत.",
      };
      const text = simulatedVoices[language] || simulatedVoices.en;
      setTranscript(text);
      onTranscriptChange(text);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Big Thumb-Accessible Voice Button (360px mobile ready) */}
      <div className="flex flex-col items-center justify-center p-6 bg-paytm-sky rounded-xl border border-blue-100 text-center">
        <button
          type="button"
          onClick={toggleListening}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-lg active:scale-90 ${
            isListening
              ? "bg-red-500 text-white animate-pulse ring-8 ring-red-100"
              : "bg-paytm-navy text-white hover:bg-paytm-navyDark ring-4 ring-blue-100"
          }`}
          aria-label={isListening ? t.stopListening : t.startListening}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 sm:w-9 sm:h-9" />
          ) : (
            <Mic className="w-8 h-8 sm:w-9 sm:h-9 text-paytm-cyan" />
          )}
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">
            {isListening ? "Listening" : "Tap to Speak"}
          </span>
        </button>

        <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-3">
          {isListening ? t.listening : "Tap the mic and describe your situation in plain words"}
        </p>

        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
          <Volume2 className="w-3.5 h-3.5 text-paytm-cyan" />
          <span>Supports English, हिंदी, and मराठी</span>
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
          onChange={(e) => {
            setTranscript(e.target.value);
            onTranscriptChange(e.target.value);
          }}
          placeholder={t.speakPlaceholder}
          className="w-full p-3.5 text-sm rounded-lg border border-slate-300 focus:border-paytm-cyan focus:ring-1 focus:ring-paytm-cyan bg-white text-slate-900 leading-relaxed placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

