"use client";

import useSWR from "swr";
import { axiosClient } from "@/lib/api/client";

interface DashboardData {
  cards: { title: string; value: string; delta: string }[];
  status: string;
}

const fetcher = async (): Promise<DashboardData> => {
  const res = await axiosClient.get("/metrics/dashboard");
  return res.data;
};

export function useDashboardData() {
  const { data, error } = useSWR<DashboardData>("/metrics/dashboard", fetcher, {
    revalidateOnFocus: true
  });

  return {
    data,
    isLoading: !data && !error,
    isError: error
  };
}
