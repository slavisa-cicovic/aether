import {
  AddressVerificationRequest,
  AddressVerificationResponse,
  HealthCheckQuery,
  HealthCheckResponse,
  MerchantVerificationRequest,
  MerchantVerificationResponse,
  SessionCreateRequest,
  SessionResponse
} from "@src/api/types/voice-gateway";
import { fetcher, postFetcher } from "@src/utils/axios";
import { endpoints } from "@src/utils/endpoints";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export function useHealthCheck(query?: HealthCheckQuery) {
  const url = endpoints.voiceGateway.healthCheck;

  const { data, error, isLoading, mutate } = useSWR<HealthCheckResponse>(
    query?.detailed ? [url, { params: query }] : url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 2,
    }
  );

  return {
    data: data as HealthCheckResponse,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useCreateSession() {
  const URL = endpoints.voiceGateway.session.create;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    URL,
    (url: string, { arg }: { arg: SessionCreateRequest }) => 
      postFetcher<SessionResponse>(url, arg)
  );

  return {
    session: data,
    error,
    isCreating: isMutating,
    createSession: trigger,
    reset,
  };
}


export function useVerifyAddress() {
  const URL = endpoints.voiceGateway.session.verifyAddress;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    'verify-address',
    async (_, { arg }: { 
      arg: { 
        sessionId: string; 
        request: AddressVerificationRequest 
      } 
    }) => {
      return postFetcher<AddressVerificationResponse>(
        URL,
        arg.request,
        { urlParams: { sessionId: arg.sessionId } }
      );
    }
  );

  return {
    verification: data,
    error,
    isVerifying: isMutating,
    verifyAddress: trigger,
    reset,
  };
}

export function useVerifyMerchant() {
  const URL = endpoints.voiceGateway.session.verifyMerchant;
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    'verify-merchant',
    async (_, { arg }: { 
      arg: { 
        sessionId: string; 
        request: MerchantVerificationRequest 
      } 
    }) => {
      return postFetcher<MerchantVerificationResponse>(
        URL,
        arg.request,
        { urlParams: { sessionId: arg.sessionId } }
      );
    }
  );

  return {
    verification: data,
    error,
    isVerifying: isMutating,
    verifyMerchant: trigger,
    reset,
  };
}