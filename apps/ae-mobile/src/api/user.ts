import useSWR from "swr";
import { User, UserQuery } from "./types/user";

// Fake users
const fakeUsers: Record<string, User> = {
  "1": {
    id: "1",
    name: "Demo User",
    email: "demo@aether.com",
  },
  "2": {
    id: "2", 
    name: "Demo User2",
    email: "demo2@aether.com",
  },
  "3": {
    id: "3",
    name: "Demo User 33333", 
    email: "demo3333@aether.com",
  },
};

// Mock fetcher
const mockUserFetcher = async (query?: UserQuery): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const userId = query?.userId || "1";
  const user = fakeUsers[userId];
  
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  
  return user;
};

export function useGetUser(query?: UserQuery) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<User>(
    query ? ["user", query] : "user",
    () => mockUserFetcher(query),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    user: data,
    isLoading,
    error,
    refetch: mutate,
  };
}