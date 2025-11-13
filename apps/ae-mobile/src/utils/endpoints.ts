import { use } from "react";

export const endpoints = {
  voiceGateway: {
    healthCheck: "/v1/health",
    session: {
      create: "/v1/voice/sessions",
      verifyAddress: `/v1/voice/sessions/{sessionId}/verify-address`,      
      verifyMerchant: `/v1/voice/sessions/{sessionId}/verify-merchant`,
    },
  },
  user: {
    userProps: "/v1/user/props",
  },
} as const;

