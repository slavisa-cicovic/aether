export const endpoints = {
  voiceGateway: {
    healthCheck: "/v1/health",
    session: {
      create: "/v1/voice/sessions",
      verifyAddress: `/v1/voice/sessions/{sessionId}/verify-address`,
      verifyMerchant: `/v1/voice/sessions/{sessionId}/verify-merchant`,
      calculateQuote: `/v1/voice/sessions/{sessionId}/calculate-quote`,
      confirmOrder: `/v1/voice/sessions/{sessionId}/confirm-order`,
      processPayment: `/v1/voice/sessions/{sessionId}/process-payment`,
      cancelOrder: `/v1/voice/sessions/{sessionId}/cancel`,
    },
  },
  user: {
    userProps: "/v1/user/props",
  },
} as const;
