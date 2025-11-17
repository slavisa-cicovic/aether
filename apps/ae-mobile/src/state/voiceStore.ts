import { create } from "zustand";
import { SessionResponse } from "@src/api/types/voice-gateway";

type VoiceStatus = "idle" | "thinking" | "error";

interface VoiceStore {
  session: SessionResponse | null;
  lastResponse: any | null;
  status: VoiceStatus;

  setSession: (s: SessionResponse | null) => void;
  setLastResponse: (r: any | null) => void;
  setStatus: (s: VoiceStatus) => void;
}

export const useVoiceStore = create<VoiceStore>(set => ({
  session: null,
  lastResponse: null,
  status: "idle",

  setSession: session => set({ session }),
  setLastResponse: lastResponse => set({ lastResponse }),
  setStatus: status => set({ status }),
}));
