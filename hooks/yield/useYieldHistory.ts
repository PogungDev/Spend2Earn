"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

interface YieldHistoryData {
  date: string
  apy: number
  benchmark: number
  volume?: number
  protocols?: number
}

interface YieldHistoryResponse {
  data: YieldHistoryData[]
  summary: {
    averageAPY: number
    bestAPY: number
    worstAPY: number
    outperformance: number
  }
}

export function useYieldHistory() {
  const { address } = useAccount()
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")

  const { data, isLoading, error } = useQuery<YieldHistoryResponse>({
    queryKey: ["yield-history", timeRange, address],
    queryFn: async () => {
      const response = await fetch(`/api/yield/history?timeRange=${timeRange}&address=${address || "demo"}`)
      if (!response.ok) throw new Error("Failed to fetch yield history")
      return response.json()
    },
    enabled: true, // Always enabled
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    data: data?.data || [],
    summary: data?.summary,
    isLoading,
    error,
    timeRange,
    setTimeRange,
  }
}
