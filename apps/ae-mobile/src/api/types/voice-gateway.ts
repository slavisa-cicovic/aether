export interface HealthCheckQuery {
  detailed?: boolean;
}

export interface HealthCheckResponse {
  service: string;
  status: "UP" | "DOWN";
  timestamp?: string;
}

// ========== SESSION CREATE ==========
export interface SessionCreateRequest {
  callSid: string;
  userPhoneNumber: string;
  language: string;
}

export interface SessionResponse {
  sessionId: string;
  welcomeMessage: string;
  status: "ACTIVE" | "COMPLETED" | "FAILED";
}

// ========== ADDRESS VERIFICATION ==========
export interface AddressVerificationRequest {
  spokenAddress: string;
}

export interface VerifiedAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  formattedAddress: string;
}

export interface AddressVerificationResponse {
  verifiedAddress?: VerifiedAddress;
  confidenceScore?: number;
  responseMessage: string;
  status: "VERIFIED" | "AMBIGUOUS" | "NOT_FOUND";
}

// ========== MERCHANT VERIFICATION ==========
export interface MerchantVerificationRequest {
  merchantId: string;
  merchantName: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  name: string;
  quantity: number;
}

export interface MerchantVerificationResponse {
  merchantId: string;
  merchantName: string;
  isAvailable: boolean;
  estimatedPreparationTime: number;
  responseMessage: string;
}

// ========== ERROR ==========
export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  path: string;
}
