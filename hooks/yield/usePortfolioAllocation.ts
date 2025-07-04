"use client"

import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

interface AllocationData {
  name: string
  value: number
  color: string
  apy: number
  amount: number
}

interface AllocationResponse {
  allocation: AllocationData[]
  summary: {
    totalValue: number
    weightedAPY: number
    totalProtocols: number
    riskScore: number
    lastRebalance: string
  }
}

export function usePortfolioAllocation() {
  const { address } = useAccount()

  const { data, isLoading, error } = useQuery<AllocationResponse>({
    queryKey: ["portfolio-allocation", address],
    queryFn: async () => {
      const response = await fetch(`/api/portfolio/allocation?address=${address || "demo"}`)
      if (!response.ok) throw new Error("Failed to fetch portfolio allocation")
      return response.json()
    },
    enabled: true, // Always enabled
    refetchInterval: 60 * 1000, // Update every minute
    staleTime: 30 * 1000,
  })

  return {
    allocation: data?.allocation || [],
    summary: data?.summary,
    isLoading,
    error,
  }
}
