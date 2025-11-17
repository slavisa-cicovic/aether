import { useCallback } from "react";
import { useVoiceStore } from "@src/state/voiceStore";
import { voiceAgentService } from "@src/services/voiceAgentService";
import {
  AddressVerificationRequest,
  MerchantVerificationRequest,
  QuoteRequest,
  SessionCreateRequest,
} from "@src/api/types/voice-gateway";

export function useVoiceAgent() {
  const {
    session,
    lastResponse,
    status,
    setSession,
    setLastResponse,
    setStatus,
  } = useVoiceStore();

  const initSession = useCallback(
    async (payload: SessionCreateRequest) => {
      try {
        setStatus("thinking");
        const newSession = await voiceAgentService.createSession(payload);
        setSession(newSession);
        setStatus("idle");
        return newSession;
      } catch (e) {
        setStatus("error");
        throw e;
      }
    },
    [setSession, setStatus]
  );

  const verifyAddress = useCallback(
    async (request: AddressVerificationRequest) => {
      if (!session) {
        throw new Error("Session is not initialized");
      }
      try {
        setStatus("thinking");
        const resp = await voiceAgentService.verifyAddress(
          session.sessionId,
          request
        );
        setLastResponse(resp);
        setStatus("idle");
        return resp;
      } catch (e) {
        setStatus("error");
        throw e;
      }
    },
    [session, setLastResponse, setStatus]
  );

  const verifyMerchant = useCallback(
    async (request: MerchantVerificationRequest) => {
      if (!session) {
        throw new Error("Session is not initialized");
      }
      try {
        setStatus("thinking");
        const resp = await voiceAgentService.verifyMerchant(
          session.sessionId,
          request
        );
        setLastResponse(resp);
        setStatus("idle");
        return resp;
      } catch (e) {
        setStatus("error");
        throw e;
      }
    },
    [session, setLastResponse, setStatus]
  );

  const calculateQuote = useCallback(
    async (request: QuoteRequest) => {
      if (!session) {
        throw new Error("Session is not initialized");
      }
      try {
        setStatus("thinking");
        const resp = await voiceAgentService.calculateQuote(
          session.sessionId,
          request
        );
        setLastResponse(resp);
        setStatus("idle");
        return resp;
      } catch (e) {
        setStatus("error");
        throw e;
      }
    },
    [session, setLastResponse, setStatus]
  );

  return {
    // state
    session,
    lastResponse,
    status,
    isBusy: status === "thinking",

    // actions
    initSession,
    verifyAddress,
    verifyMerchant,
    calculateQuote,
  };
}
