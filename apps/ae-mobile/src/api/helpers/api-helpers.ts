import { postFetcher } from "@src/utils/axios";
import useSWRMutation from "swr/mutation";

async function getAuthToken(): Promise<string> {
  return "dummy-voice-agent-token";
}

function withAuthHeaders(additionalHeaders: Record<string, string> = {}) {
  return async () => {
    const token = await getAuthToken();
    return {
      "X-Transaction-ID": `txn-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      Authorization: `Bearer ${token}`,
      ...additionalHeaders,
    };
  };
}

export function usePostMutation<T, R>(
  sessionId: string,
  url: string,
  options?: any
) {
  return useSWRMutation(async ({ arg }: { arg: T }) => {
    const finalUrl = url.replace("sessionId", sessionId);

    console.log("Final URL:", finalUrl);

    return postFetcher<R>(finalUrl, arg);
  }, options);
}
