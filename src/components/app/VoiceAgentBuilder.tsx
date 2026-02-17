"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Loader2, PhoneCall, PhoneOff, Wand2 } from "lucide-react";

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

interface LiveAgentConfig {
  agentId: string;
  name: string;
  plan: string;
  twilioWebhookUrl: string;
}

interface CreateLiveAgentResponse {
  agent?: LiveAgentConfig;
  error?: string;
}

interface RealtimeClientSecretResponse {
  clientSecret?: string;
  model?: string;
  openingScript?: string;
  error?: string;
}

interface TwilioSearchNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string | null;
  region: string | null;
  isoCountry: string | null;
}

interface TwilioSearchResponse {
  numbers?: TwilioSearchNumber[];
  error?: string;
}

interface TwilioProvisionedNumber {
  id: string;
  sid: string;
  phoneNumber: string;
  friendlyName: string | null;
  status: string;
}

interface TwilioProvisionResponse {
  number?: TwilioProvisionedNumber;
  error?: string;
}

interface TwilioNumbersListResponse {
  numbers?: TwilioProvisionedNumber[];
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
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingLiveAgent, setIsCreatingLiveAgent] = useState(false);
  const [isStartingWebCall, setIsStartingWebCall] = useState(false);
  const [isWebCallActive, setIsWebCallActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<PromptDraft | null>(null);
  const [agentName, setAgentName] = useState("Front Desk Core Receptionist");
  const [createdLiveAgent, setCreatedLiveAgent] = useState<LiveAgentConfig | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [webCallStatus, setWebCallStatus] = useState<string | null>(null);
  const [webCallEvents, setWebCallEvents] = useState<string[]>([]);
  const [twilioCountryCode, setTwilioCountryCode] = useState("+61");
  const [twilioAreaCode, setTwilioAreaCode] = useState("");
  const [isSearchingTwilioNumbers, setIsSearchingTwilioNumbers] = useState(false);
  const [isLoadingProvisionedNumbers, setIsLoadingProvisionedNumbers] = useState(false);
  const [twilioSearchResults, setTwilioSearchResults] = useState<TwilioSearchNumber[]>([]);
  const [provisionedTwilioNumbers, setProvisionedTwilioNumbers] = useState<TwilioProvisionedNumber[]>([]);
  const [provisioningNumber, setProvisioningNumber] = useState<string | null>(null);

  const combinedTranscript = useMemo(() => {
    return `${transcript}${interimTranscript ? ` ${interimTranscript}` : ""}`.trim();
  }, [interimTranscript, transcript]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      stopWebCall();
    };
  }, []);

  useEffect(() => {
    if (!createdLiveAgent?.agentId) {
      setTwilioSearchResults([]);
      setProvisionedTwilioNumbers([]);
      return;
    }

    void loadProvisionedTwilioNumbers(createdLiveAgent.agentId);
  }, [createdLiveAgent?.agentId]);

  function stopWebCall() {
    if (dataChannelRef.current) {
      try {
        dataChannelRef.current.close();
      } catch {
        // ignore cleanup errors
      }
      dataChannelRef.current = null;
    }

    if (peerConnectionRef.current) {
      try {
        peerConnectionRef.current.close();
      } catch {
        // ignore cleanup errors
      }
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      for (const track of localStreamRef.current.getTracks()) {
        track.stop();
      }
      localStreamRef.current = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.pause();
      remoteAudioRef.current.srcObject = null;
    }

    setIsWebCallActive(false);
    setIsStartingWebCall(false);
  }

  function appendWebCallEvent(eventText: string) {
    const timestamp = new Date().toLocaleTimeString();
    setWebCallEvents((previous) => [`${timestamp} - ${eventText}`, ...previous].slice(0, 12));
  }

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
      setCreatedLiveAgent(null);
      setCopiedField(null);
      setTwilioSearchResults([]);
      setProvisionedTwilioNumbers([]);
    } catch (buildError: unknown) {
      setError(buildError instanceof Error ? buildError.message : "Could not build prompt");
    } finally {
      setIsGenerating(false);
    }
  }

  async function createLiveAgent() {
    if (!draft) {
      setError("Generate a draft first.");
      return;
    }

    setError(null);
    setIsCreatingLiveAgent(true);

    try {
      const response = await fetch("/api/agent/create-live", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: agentName,
          draft,
        }),
      });

      const data = (await response.json()) as CreateLiveAgentResponse;
      if (!response.ok || !data.agent) {
        throw new Error(data.error || "Could not create live agent");
      }

      setCreatedLiveAgent(data.agent);
      setTwilioSearchResults([]);
      setProvisionedTwilioNumbers([]);
      await loadProvisionedTwilioNumbers(data.agent.agentId);
    } catch (createError: unknown) {
      setError(createError instanceof Error ? createError.message : "Could not create live agent");
    } finally {
      setIsCreatingLiveAgent(false);
    }
  }

  async function copyToClipboard(value: string, fieldName: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldName);
      setTimeout(() => {
        setCopiedField((current) => (current === fieldName ? null : current));
      }, 1500);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  async function startWebCall() {
    if (!createdLiveAgent?.agentId) {
      setError("Create a live voice agent first.");
      return;
    }

    setError(null);
    setIsStartingWebCall(true);
    setWebCallStatus("Requesting microphone access...");
    setWebCallEvents([]);

    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone access is not supported in this browser.");
      }

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      localStreamRef.current = localStream;

      setWebCallStatus("Creating secure realtime session...");
      const secretResponse = await fetch("/api/agent/realtime-client-secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: createdLiveAgent.agentId,
        }),
      });

      const secretData = (await secretResponse.json()) as RealtimeClientSecretResponse;
      if (!secretResponse.ok || !secretData.clientSecret) {
        throw new Error(secretData.error || "Could not start web call session");
      }

      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      const remoteAudio = remoteAudioRef.current ?? new Audio();
      remoteAudio.autoplay = true;
      remoteAudioRef.current = remoteAudio;

      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteStream) {
          remoteAudio.srcObject = remoteStream;
        }
      };

      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;
        if (state === "failed" || state === "disconnected" || state === "closed") {
          setWebCallStatus("Web call disconnected.");
          appendWebCallEvent(`Connection state: ${state}`);
          stopWebCall();
        }
      };

      for (const track of localStream.getTracks()) {
        peerConnection.addTrack(track, localStream);
      }

      const dataChannel = peerConnection.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;

      dataChannel.onopen = () => {
        appendWebCallEvent("Realtime data channel connected.");
        setWebCallStatus("Web call live. Speak naturally.");

        if (secretData.openingScript) {
          dataChannel.send(
            JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "message",
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: `Start by greeting the caller using this exact opening script, then continue naturally: ${secretData.openingScript}`,
                  },
                ],
              },
            })
          );

          dataChannel.send(
            JSON.stringify({
              type: "response.create",
            })
          );
        }
      };

      dataChannel.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as { type?: string; transcript?: string; delta?: string };

          if (payload.type === "response.audio_transcript.done" && payload.transcript) {
            appendWebCallEvent(`Agent: ${payload.transcript}`);
            return;
          }

          if (payload.type === "conversation.item.input_audio_transcription.completed" && payload.transcript) {
            appendWebCallEvent(`You: ${payload.transcript}`);
            return;
          }

          if (payload.type) {
            appendWebCallEvent(payload.type);
          }
        } catch {
          appendWebCallEvent("Received realtime event");
        }
      };

      dataChannel.onerror = () => {
        appendWebCallEvent("Realtime data channel error.");
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      if (!offer.sdp) {
        throw new Error("Could not create WebRTC offer.");
      }

      setWebCallStatus("Connecting to realtime voice...");
      const realtimeResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${secretData.clientSecret}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!realtimeResponse.ok) {
        const realtimeErrorText = await realtimeResponse.text();
        throw new Error(realtimeErrorText || "Realtime connection failed.");
      }

      const answerSdp = await realtimeResponse.text();
      await peerConnection.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      });

      setIsWebCallActive(true);
      appendWebCallEvent(`Connected with model: ${secretData.model ?? "gpt-realtime"}`);
      setWebCallStatus("Web call active.");
    } catch (startError: unknown) {
      stopWebCall();
      setError(startError instanceof Error ? startError.message : "Could not start web call");
      setWebCallStatus("Web call failed to start.");
    } finally {
      setIsStartingWebCall(false);
    }
  }

  async function loadProvisionedTwilioNumbers(agentId: string) {
    setIsLoadingProvisionedNumbers(true);
    try {
      const response = await fetch(`/api/twilio/numbers/list?agentId=${encodeURIComponent(agentId)}`);
      const data = (await response.json()) as TwilioNumbersListResponse;
      if (!response.ok) {
        throw new Error(data.error || "Could not load numbers");
      }
      setProvisionedTwilioNumbers(data.numbers ?? []);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Could not load provisioned numbers");
    } finally {
      setIsLoadingProvisionedNumbers(false);
    }
  }

  async function searchTwilioNumbers() {
    if (!createdLiveAgent?.agentId) {
      setError("Create a live voice agent first.");
      return;
    }

    setError(null);
    setIsSearchingTwilioNumbers(true);
    setTwilioSearchResults([]);

    try {
      const response = await fetch("/api/twilio/numbers/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: createdLiveAgent.agentId,
          countryCode: twilioCountryCode,
          areaCode: twilioAreaCode,
        }),
      });

      const data = (await response.json()) as TwilioSearchResponse;
      if (!response.ok) {
        throw new Error(data.error || "Could not search numbers");
      }

      setTwilioSearchResults(data.numbers ?? []);
    } catch (searchError: unknown) {
      setError(searchError instanceof Error ? searchError.message : "Could not search numbers");
    } finally {
      setIsSearchingTwilioNumbers(false);
    }
  }

  async function provisionTwilioNumberForAgent(phoneNumber: string) {
    if (!createdLiveAgent?.agentId) {
      setError("Create a live voice agent first.");
      return;
    }

    setError(null);
    setProvisioningNumber(phoneNumber);

    try {
      const response = await fetch("/api/twilio/numbers/provision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: createdLiveAgent.agentId,
          phoneNumber,
        }),
      });

      const data = (await response.json()) as TwilioProvisionResponse;
      if (!response.ok || !data.number) {
        throw new Error(data.error || "Could not provision number");
      }

      await loadProvisionedTwilioNumbers(createdLiveAgent.agentId);
    } catch (provisionError: unknown) {
      setError(provisionError instanceof Error ? provisionError.message : "Could not provision number");
    } finally {
      setProvisioningNumber(null);
    }
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
            aria-pressed={isListening}
            className={`flex h-52 w-52 items-center justify-center rounded-full border font-mono text-sm uppercase tracking-[0.16em] transition-all ${
              isListening
                ? "border-neon bg-neon text-ocean-950 shadow-[0_0_80px_rgba(16,248,194,0.3)] animate-pulse"
                : "border-neon/50 bg-neon/10 text-neon shadow-[0_0_80px_rgba(16,248,194,0.2)] hover:bg-neon/20"
            }`}
          >
            {isListening ? "Listening..." : "Ready to record"}
          </button>
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_auto] gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-3">Conversation Notes</p>
              <textarea
                readOnly
                value={combinedTranscript}
                placeholder="Tap the big button and speak naturally about your business, common caller requests, tone of voice, and non-negotiable rules."
                className="w-full min-h-[180px] resize-y rounded-xl border border-white/10 bg-ocean-950/60 px-3 py-3 text-sm text-gray-200 outline-none"
              />
            </div>

          <div className="flex lg:flex-col items-stretch gap-3">
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
                setCreatedLiveAgent(null);
                setCopiedField(null);
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
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_520px]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Generated Agent Draft</h2>

            <div className="space-y-4">
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

          <div className="rounded-3xl border border-neon/30 bg-neon/5 p-5 md:p-6 space-y-4 lg:sticky lg:top-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-neon">Go Live with Twilio</p>

            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={agentName}
                onChange={(event) => setAgentName(event.target.value)}
                maxLength={80}
                placeholder="Agent name"
                className="h-11 rounded-xl border border-white/10 bg-ocean-950/60 px-3 text-sm text-white outline-none focus:border-neon/40"
              />
              <button
                type="button"
                onClick={createLiveAgent}
                disabled={isCreatingLiveAgent}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-neon px-4 text-xs font-mono uppercase tracking-widest text-ocean-950 hover:bg-white transition-colors disabled:opacity-50"
              >
                {isCreatingLiveAgent ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating
                  </>
                ) : (
                  "Create Live Voice Agent"
                )}
              </button>
            </div>

            {!createdLiveAgent ? (
              <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-gray-300">
                Create a live voice agent to unlock webhook setup, web-call testing, and Twilio number provisioning.
              </p>
            ) : (
              <div className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white">
                  Live agent ready: <span className="text-neon font-semibold">{createdLiveAgent.name}</span>
                </p>

                <div className="space-y-2">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Twilio Voice Webhook URL</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="flex-1 min-w-[220px] break-all rounded-lg border border-white/10 bg-ocean-950/70 px-3 py-2 text-xs text-gray-200">
                      {createdLiveAgent.twilioWebhookUrl}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdLiveAgent.twilioWebhookUrl, "twilioWebhook")}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-mono uppercase tracking-widest text-gray-200 hover:bg-white/10"
                    >
                      {copiedField === "twilioWebhook" ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy URL
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-300">
                  Set this URL in Twilio (Phone Number - Voice - A call comes in) using HTTP POST.
                </p>

                <div className="rounded-xl border border-white/10 bg-ocean-950/60 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-gray-300">Web Call Lab</p>
                    {isWebCallActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          stopWebCall();
                          setWebCallStatus("Web call ended.");
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-300/40 px-3 py-2 text-xs font-mono uppercase tracking-widest text-rose-200 hover:bg-rose-300/10"
                      >
                        <PhoneOff className="h-3.5 w-3.5" />
                        End Web Call
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startWebCall}
                        disabled={isStartingWebCall}
                        className="inline-flex items-center gap-2 rounded-lg border border-neon/40 px-3 py-2 text-xs font-mono uppercase tracking-widest text-neon hover:bg-neon/10 disabled:opacity-60"
                      >
                        {isStartingWebCall ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Connecting
                          </>
                        ) : (
                          <>
                            <PhoneCall className="h-3.5 w-3.5" />
                            Start Web Call
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-300">
                    Test this same live agent in-browser (mic required) before routing real phone traffic.
                  </p>

                  {webCallStatus && <p className="text-xs text-gray-200">{webCallStatus}</p>}

                  {webCallEvents.length > 0 && (
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">Realtime Events</p>
                      <div className="space-y-1">
                        {webCallEvents.map((eventLine) => (
                          <p key={eventLine} className="text-xs text-gray-300 break-words">
                            {eventLine}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-white/10 bg-ocean-950/60 p-4 space-y-4">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-gray-300">Twilio Number Provisioning</p>

                  <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)_164px]">
                    <input
                      value={twilioCountryCode}
                      onChange={(event) =>
                        setTwilioCountryCode(event.target.value.toUpperCase().replaceAll(/[^A-Z0-9+]/g, "").slice(0, 4))
                      }
                      placeholder="US or +61"
                      className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-neon/40"
                    />
                    <input
                      value={twilioAreaCode}
                      onChange={(event) => setTwilioAreaCode(event.target.value.replaceAll(/\D/g, "").slice(0, 6))}
                      placeholder="Area code (optional)"
                      className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-neon/40"
                    />
                    <button
                      type="button"
                      onClick={searchTwilioNumbers}
                      disabled={isSearchingTwilioNumbers}
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-neon/40 px-4 text-xs font-mono uppercase tracking-widest text-neon hover:bg-neon/10 disabled:opacity-60"
                    >
                      {isSearchingTwilioNumbers ? "Searching" : "Find Numbers"}
                    </button>
                  </div>

                  {twilioSearchResults.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-300">Available numbers</p>
                      <div className="space-y-2">
                        {twilioSearchResults.map((number) => (
                          <div
                            key={number.phoneNumber}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-3"
                          >
                            <div className="space-y-1">
                              <p className="text-sm text-white font-medium">{number.phoneNumber}</p>
                              <p className="text-xs text-gray-400">
                                {[number.locality, number.region, number.isoCountry].filter(Boolean).join(", ") || number.friendlyName}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => provisionTwilioNumberForAgent(number.phoneNumber)}
                              disabled={provisioningNumber === number.phoneNumber}
                              className="inline-flex items-center justify-center rounded-lg border border-neon/40 px-3 py-2 text-xs font-mono uppercase tracking-widest text-neon hover:bg-neon/10 disabled:opacity-60"
                            >
                              {provisioningNumber === number.phoneNumber ? "Provisioning" : "Buy & Attach"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs text-gray-300">Assigned numbers</p>
                    {isLoadingProvisionedNumbers ? (
                      <p className="text-xs text-gray-400">Loading assigned numbers...</p>
                    ) : provisionedTwilioNumbers.length === 0 ? (
                      <p className="text-xs text-gray-400">No numbers assigned yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {provisionedTwilioNumbers.map((number) => (
                          <div
                            key={number.sid}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-3"
                          >
                            <div className="space-y-1">
                              <p className="text-sm text-white font-medium">{number.phoneNumber}</p>
                              <p className="text-xs text-gray-400">{number.friendlyName ?? "Twilio number"}</p>
                            </div>
                            <span className="rounded-md border border-neon/40 bg-neon/15 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-neon">
                              {number.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
