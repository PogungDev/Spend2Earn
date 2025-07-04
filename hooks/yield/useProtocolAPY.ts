"use client"

import { useQuery } from "@tanstack/react-query"

interface ProtocolData {
  name: string
  chain: string
  apy: number
  tvl: number
  risk: string
  category: string
  logo: string
}

interface ProtocolResponse {
  protocols: ProtocolData[]
  lastUpdated: string
  totalProtocols: number
}

export function useProtocolAPY() {
  const { data, isLoading, error } = useQuery<ProtocolResponse>({
    queryKey: ["protocol-apy"],
    queryFn: async () => {
      const response = await fetch("/api/yield/protocols")
      if (!response.ok) throw new Error("Failed to fetch protocol APY data")
      return response.json()
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    staleTime: 60 * 1000, // Consider stale after 1 minute
  })

  return {
    protocols: data?.protocols || [],
    lastUpdated: data?.lastUpdated,
    totalProtocols: data?.totalProtocols || 0,
    isLoading,
    error,
  }
}
