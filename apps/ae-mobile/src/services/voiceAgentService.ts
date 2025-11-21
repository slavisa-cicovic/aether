import {
  AddressVerificationRequest,
  AddressVerificationResponse,
  CancelRequest,
  CancelResponse,
  HealthCheckQuery,
  HealthCheckResponse,
  ProviderVerificationRequest,
  ProviderVerificationResponse,
  OrderConfirmationRequest,
  OrderConfirmationResponse,
  PaymentRequest,
  PaymentResponse,
  QuoteRequest,
  QuoteResponse,
  SessionCreateRequest,
  SessionResponse,
} from "@src/api/types/voice-gateway";
import axiosInstance from "@src/utils/axios";
import { endpoints } from "@src/utils/endpoints";

function replaceSessionId(urlTemplate: string, sessionId: string) {
  return urlTemplate.replace("{sessionId}", sessionId);
}

export const voiceAgentService = {
  async healthCheck(query?: HealthCheckQuery): Promise<HealthCheckResponse> {
    const res = await axiosInstance.get(endpoints.voiceGateway.healthCheck, {
      params: query,
    });
    return res.data;
  },

  async createSession(payload: SessionCreateRequest): Promise<SessionResponse> {
    const res = await axiosInstance.post(
      endpoints.voiceGateway.session.create,
      payload
    );
    return res.data;
  },

  async verifyAddress(
    sessionId: string,
    request: AddressVerificationRequest
  ): Promise<AddressVerificationResponse> {
    const url = replaceSessionId(
      endpoints.voiceGateway.session.verifyAddress,
      sessionId
    );
    const res = await axiosInstance.post(url, request);
    return res.data;
  },

  async verifyProvider(
    sessionId: string,
    request: ProviderVerificationRequest
  ): Promise<ProviderVerificationResponse> {
    const url = replaceSessionId(
      endpoints.voiceGateway.session.verifyProvider,
      sessionId
    );
    const res = await axiosInstance.post(url, request);
    return res.data;
  },

  async calculateQuote(
    sessionId: string,
    request: QuoteRequest
  ): Promise<QuoteResponse> {
    const url = replaceSessionId(
      endpoints.voiceGateway.session.calculateQuote,
      sessionId
    );
    const res = await axiosInstance.post(url, request);
    return res.data;
  },

  async confirmOrder(
    sessionId: string,
    request: OrderConfirmationRequest
  ): Promise<OrderConfirmationResponse> {
    const url = replaceSessionId(
      endpoints.voiceGateway.session.confirmOrder,
      sessionId
    );
    const res = await axiosInstance.post(url, request);
    return res.data;
  },

  async processPayment(
    sessionId: string,
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    const url = replaceSessionId(
      endpoints.voiceGateway.session.processPayment,
      sessionId
    );
    const res = await axiosInstance.post(url, request);
    return res.data;
  },

  async cancelOrder(
    sessionId: string,
    request: CancelRequest
  ): Promise<CancelResponse> {
    const url = replaceSessionId(
      endpoints.voiceGateway.session.cancelOrder,
      sessionId
    );
    const res = await axiosInstance.post(url, request);
    return res.data;
  },
};
