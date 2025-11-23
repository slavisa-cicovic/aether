import { IUserListItem, IUserDetails } from "@/types/user";
import userAxiosInstance, {
  endpoints,
  userGetFetcher,
} from "@/utils/userAxios";
import { useMemo } from "react";
import useSWR from "swr";

export function useGetUsers() {
  const URL = endpoints.user.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    URL,
    userGetFetcher
  );
  const usersData = Array.isArray(data) ? data : data?.users;

  return useMemo(
    () => ({
      users: (usersData as IUserListItem[]) || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !(usersData && usersData.length),
      mutate,
    }),
    [usersData, error, isLoading, isValidating, mutate]
  );
}

export function useGetUser(userId: number) {
  const URL = userId ? endpoints.user.detail(userId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, userGetFetcher);

  return useMemo(
    () => ({
      user: data?.user as IUserDetails,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
    }),
    [data?.user, error, isLoading, isValidating]
  );
}

export async function createOrUpdateUser(formData: FormData) {
  const URL = endpoints.user.list;
  await userAxiosInstance.post(URL, formData);
}

export async function deleteUser(userId: number) {
  await userAxiosInstance.delete(endpoints.user.detail(userId));
}
