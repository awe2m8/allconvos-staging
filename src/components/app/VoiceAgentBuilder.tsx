"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Mic, Square, Volume2, Wand2 } from "lucide-react";

interface PromptDraft {
  businessSummary: string;
  tasks: string[];
  personality: string[];
  guardrails: string[];
  openingScript: string;
  systemPrompt: string;
}

interface BuildPromptResponse {
  draft?: PromptDraft;
  error?: string;
}

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: unknown) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") {
    return null;
  }

  const speechWindow = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

export function VoiceAgentBuilder({ planName }: { planName: string }) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<PromptDraft | null>(null);

  const combinedTranscript = useMemo(() => {
    return `${transcript}${interimTranscript ? ` ${interimTranscript}` : ""}`.trim();
  }, [interimTranscript, transcript]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function ensureRecognition() {
    if (recognitionRef.current) {
      return recognitionRef.current;
    }

    const RecognitionCtor = getSpeechRecognitionCtor();
    if (!RecognitionCtor) {
      throw new Error("Speech recognition is not supported in this browser. Try Chrome.");
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (rawEvent: unknown) => {
      const event = rawEvent as {
        resultIndex: number;
        results: Array<{ isFinal: boolean; 0: { transcript: string } }>;
      };

      let finalChunk = "";
      let interimChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const chunk = result?.[0]?.transcript?.trim() ?? "";
        if (!chunk) {
          continue;
        }

        if (result.isFinal) {
          finalChunk += `${chunk} `;
        } else {
          interimChunk += `${chunk} `;
        }
      }

      if (finalChunk.trim()) {
        setTranscript((previous) => `${previous} ${finalChunk}`.trim());
      }
      setInterimTranscript(interimChunk.trim());
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognition.onerror = (rawEvent: unknown) => {
      const event = rawEvent as { error?: string };
      setError(event.error ? `Microphone error: ${event.error}` : "Microphone error");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return recognition;
  }

  function startListening() {
    setError(null);

    try {
      const recognition = ensureRecognition();
      recognition.start();
      setIsListening(true);
    } catch (startError: unknown) {
      setError(startError instanceof Error ? startError.message : "Could not start microphone");
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  async function buildPrompt() {
    if (!combinedTranscript || combinedTranscript.length < 40) {
      setError("Add a little more detail first. Aim for at least 1-2 minutes of notes.");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/agent/build-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: combinedTranscript,
        }),
      });

      const data = (await response.json()) as BuildPromptResponse;
      if (!response.ok || !data.draft) {
        throw new Error(data.error || "Could not build prompt");
      }

      setDraft(data.draft);
    } catch (buildError: unknown) {
      setError(buildError instanceof Error ? buildError.message : "Could not build prompt");
    } finally {
      setIsGenerating(false);
    }
  }

  function playVoicePreview() {
    if (!draft?.openingScript) {
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setError("Voice preview is not supported in this browser.");
      return;
    }

    setError(null);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(draft.openingScript);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError("Voice preview failed.");
    };

    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <div className="text-center space-y-3">
          <p className="text-neon text-[10px] font-mono uppercase tracking-[0.24em]">Voice Agent Builder</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Create Your Agent</h1>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto">
            Active plan: <span className="text-neon font-semibold">{planName}</span>. Speak about your business, then generate a structured
            receptionist prompt with tasks, personality, and guard rails.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`h-52 w-52 rounded-full border font-mono text-sm uppercase tracking-[0.16em] transition-all ${
              isListening
                ? "border-neon bg-neon text-ocean-950 shadow-[0_0_80px_rgba(16,248,194,0.3)] animate-pulse"
                : "border-neon/50 bg-neon/10 text-neon hover:bg-neon/20 shadow-[0_0_80px_rgba(16,248,194,0.2)]"
            }`}
          >
            {isListening ? "Listening..." : "Create your agent"}
          </button>
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_auto] gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-3">Conversation Notes</p>
            <textarea
              readOnly
              value={combinedTranscript}
              placeholder="Tap ‘Create your agent’ and speak naturally about your business, common caller requests, tone of voice, and non-negotiable rules."
              className="w-full min-h-[180px] resize-y rounded-xl border border-white/10 bg-ocean-950/60 px-3 py-3 text-sm text-gray-200 outline-none"
            />
          </div>

          <div className="flex lg:flex-col items-stretch gap-3">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-xs font-mono uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
            >
              {isListening ? (
                <>
                  <Square className="h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Record
                </>
              )}
            </button>

            <button
              type="button"
              onClick={buildPrompt}
              disabled={isGenerating || !combinedTranscript}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 text-xs font-mono uppercase tracking-widest text-ocean-950 hover:bg-white transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Building
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Build Prompt
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setTranscript("");
                setInterimTranscript("");
                setDraft(null);
                setError(null);
              }}
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-xs font-mono uppercase tracking-widest text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
      </div>

      {draft && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-2xl font-bold text-white">Generated Agent Draft</h2>
            <button
              type="button"
              onClick={playVoicePreview}
              disabled={isSpeaking}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neon/40 px-4 py-3 text-xs font-mono uppercase tracking-widest text-neon hover:bg-neon/10 transition-colors disabled:opacity-60"
            >
              <Volume2 className="h-4 w-4" />
              {isSpeaking ? "Playing..." : "Voice Preview"}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">Tasks</p>
              <ul className="space-y-2 text-sm text-gray-200">
                {draft.tasks.map((task) => (
                  <li key={task}>- {task}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">Personality</p>
              <ul className="space-y-2 text-sm text-gray-200">
                {draft.personality.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">Guard Rails</p>
              <ul className="space-y-2 text-sm text-gray-200">
                {draft.guardrails.map((rule) => (
                  <li key={rule}>- {rule}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Opening Script</p>
            <p className="text-sm text-gray-200">{draft.openingScript}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ocean-950/70 p-4 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">System Prompt</p>
            <pre className="whitespace-pre-wrap text-xs text-gray-200 font-mono">{draft.systemPrompt}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
