"use client"

import { useState, useEffect } from "react"

interface CreditLimitData {
  total: number
  used: number
  breakdown: {
    vaultBased: number
    activityBased: number
  }
  usageFeeRate: number
}

export function useCreditLimit() {
  const [data, setData] = useState<CreditLimitData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCreditLimit = async () => {
      try {
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Calculate usage capacity based on vault balance and activity
        const vaultBalance = 25000 // User's total vault balance
        const activityLevel = "medium" // User's activity level

        const vaultBasedCapacity = Math.floor(vaultBalance * 0.3) // 30% of vault balance
        const activityBasedCapacity = activityLevel === "high" ? 5000 : activityLevel === "medium" ? 2500 : 1000

        const totalCapacity = vaultBasedCapacity + activityBasedCapacity
        const currentUsage = 2500 // Current usage

        const mockData: CreditLimitData = {
          total: totalCapacity,
          used: currentUsage,
          breakdown: {
            vaultBased: vaultBasedCapacity,
            activityBased: activityBasedCapacity,
          },
          usageFeeRate: 3,
        }

        setData(mockData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch credit limit"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreditLimit()
  }, [])

  return {
    limit: data?.total || 0,
    used: data?.used || 0,
    breakdown: data?.breakdown || { vaultBased: 0, activityBased: 0 },
    usageFeeRate: data?.usageFeeRate || 0,
    isLoading,
    error,
  }
}
