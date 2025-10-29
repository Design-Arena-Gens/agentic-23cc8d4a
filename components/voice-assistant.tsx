"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Send, AudioLines } from "lucide-react";
import clsx from "clsx";

type VoiceMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
};

type VoiceAssistantProps = {
  messages: VoiceMessage[];
  onProcess: (input: string) => Promise<string> | string;
  t: {
    title: string;
    subtitle: string;
    placeholder: string;
    listening: string;
    talk: string;
  };
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    0: {
      transcript: string;
    };
  }>;
};

export function VoiceAssistant({ messages, onProcess, t }: VoiceAssistantProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const supportsSpeech =
    typeof window !== "undefined" &&
    (Boolean((window as any).webkitSpeechRecognition) || Boolean((window as any).SpeechRecognition));
  const containerRef = useRef<HTMLDivElement>(null);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.05;
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSubmit = useCallback(
    async (value: string) => {
      const clean = value.trim();
      if (!clean) return;
      setTranscript("");
      finalTranscriptRef.current = "";
      const response = await onProcess(clean);
      if (response) {
        speak(response);
      }
    },
    [onProcess, speak]
  );

  const handleSubmitRef = useRef<typeof handleSubmit>(() => Promise.resolve());
  handleSubmitRef.current = handleSubmit;

  useEffect(() => {
    if (!supportsSpeech) return;

    const ctor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!ctor) return;

    const recognition: SpeechRecognitionLike = new ctor();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      finalTranscriptRef.current = text.trim();
      setTranscript(text.trim());
    };

    recognition.onend = () => {
      setListening(false);
      const finalText = finalTranscriptRef.current;
      if (finalText) {
        void handleSubmitRef.current(finalText);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [supportsSpeech]);

  useEffect(() => {
    const scrollParent = containerRef.current;
    if (scrollParent) {
      scrollParent.scrollTop = scrollParent.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (!supportsSpeech) return;
    if (listening) {
      recognitionRef.current?.stop();
    } else {
      finalTranscriptRef.current = "";
      setTranscript("");
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  return (
    <section className={clsx("glass")} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{t.title}</h3>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{t.subtitle}</span>
        </div>
        <button
          onClick={toggleListening}
          className="glass"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 14,
            border: "var(--glass-border)",
            background: listening
              ? "linear-gradient(90deg, rgba(14, 126, 249, 0.36), rgba(30, 227, 181, 0.24))"
              : "rgba(255,255,255,0.02)",
            cursor: supportsSpeech ? "pointer" : "not-allowed",
            fontSize: 13
          }}
          disabled={!supportsSpeech}
          aria-pressed={listening}
        >
          {listening ? <Mic size={16} /> : <MicOff size={16} />}
          {listening ? t.listening : t.talk}
        </button>
      </header>

      <div
        ref={containerRef}
        style={{
          borderRadius: 16,
          border: "var(--glass-border)",
          background: "rgba(255,255,255,0.02)",
          padding: 16,
          minHeight: 220,
          maxHeight: 280,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}
        className="scroll"
      >
        {messages.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              color: "var(--color-muted)",
              fontSize: 13
            }}
          >
            <AudioLines size={22} />
            {t.subtitle}
          </div>
        )}
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                background:
                  message.role === "user"
                    ? "linear-gradient(135deg, rgba(14, 126, 249, 0.28), rgba(30, 227, 181, 0.24))"
                    : "rgba(255,255,255,0.04)",
                padding: "10px 14px",
                borderRadius: 14,
                maxWidth: "78%",
                fontSize: 13,
                lineHeight: 1.5,
                boxShadow: "0 12px 26px rgba(4, 18, 32, 0.25)"
              }}
            >
              {message.content}
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 6 }}>{message.timestamp}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(transcript);
        }}
        style={{ display: "flex", gap: 12 }}
      >
        <input
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder={t.placeholder}
          style={{
            flex: 1,
            borderRadius: 14,
            border: "var(--glass-border)",
            background: "rgba(255,255,255,0.04)",
            padding: "12px 14px",
            color: "var(--color-text)",
            fontSize: 13
          }}
        />
        <button
          type="submit"
          className="glass"
          style={{
            width: 48,
            height: 48,
            display: "grid",
            placeItems: "center",
            borderRadius: 14,
            border: "var(--glass-border)",
            background: "linear-gradient(135deg, rgba(14, 126, 249, 0.34), rgba(30, 227, 181, 0.3))",
            cursor: "pointer"
          }}
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}
