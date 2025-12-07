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

// ========== PROVIDER VERIFICATION ==========
export interface ProviderVerificationRequest {
  providerId: string;
  providerName: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  name: string;
  quantity: number;
}

export interface ProviderVerificationResponse {
  providerId: string;
  providerName: string;
  isAvailable: boolean;
  estimatedPreparationTime: number;
  responseMessage: string;
}
// ========== CALCULATE QUOTA ==========
export interface QuoteRequest {
  deliveryTimeType: DeliveryTimeType;
  scheduledTime?: string; // ISO 8601 UTC string, e.g. "2024-01-15T14:30:00.000Z"
}

export enum DeliveryTimeType {
  NOW = "now",
  SCHEDULED = "scheduled",
}

export interface QuoteResponse {
  deliveryAvailable: boolean;
  estimatedDeliveryMinutes?: number;
  breakdown: PriceBreakdown;
  currency: string;
  responseMessage: string;
}

export interface PriceBreakdown {
  itemsTotal: number;
  deliveryFee: number;
  total: number;
}

// ========== OrderConfirmation and Payment==========
export interface OrderConfirmationRequest {
  userConfirmed: boolean;
  paymentMethod?: PaymentMethod;
}

export enum PaymentMethod {
  CARD = "card",
  WALLET = "wallet",
}

export interface PaymentRequest {
  paymentMethod: PaymentMethod;
  paymentDetails?: PaymentDetails;
}

export interface PaymentDetails {
  token?: string;
}

export interface PaymentResponse {
  paymentStatus: string;
  orderId: string;
  trackingUrl: string;
  responseMessage: string;
}

export interface OrderConfirmationResponse {
  orderId: string;
  status: string;
  paymentIntentId?: string;
  responseMessage: string;
}

// ========== CANCEL ORDER ==========
export interface CancelRequest {
  reason: CancelReason;
  description?: string;
}

export enum CancelReason {
  USER_CANCELLED = "user_cancelled",
  CALL_ENDED = "call_ended",
  TIMEOUT = "timeout",
  PAYMENT_FAILED = "payment_failed",
  TECHNICAL_ISSUE = "technical_issue",
}

export interface CancelResponse {
  sessionStatus: string;
  message: string;
}
// ========== ERROR ==========
export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  path: string;
}
