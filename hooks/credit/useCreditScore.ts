"use client"

import { useState, useEffect } from "react"

interface CreditScoreData {
  score: number
  trend: "up" | "down" | "neutral"
  factors: {
    vaultBalance: number
    activityLevel: number
    yieldPerformance: number
    usageHistory: number
  }
  monthlyChange: number
}

export function useCreditScore() {
  const [data, setData] = useState<CreditScoreData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCreditScore = async () => {
      try {
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Calculate score based on vault balance and activity
        const baseScore = 500
        const vaultBonus = Math.min(200, Math.floor(25000 / 100)) // $25k vault = 250 points
        const activityBonus = 145 // Medium activity level
        const yieldBonus = 220 // Good yield performance
        const historyBonus = 180 // Good usage history

        const totalScore = baseScore + vaultBonus + activityBonus + yieldBonus + historyBonus

        const mockData: CreditScoreData = {
          score: Math.min(850, totalScore),
          trend: "up" as const,
          factors: {
            vaultBalance: vaultBonus,
            activityLevel: activityBonus,
            yieldPerformance: yieldBonus,
            usageHistory: historyBonus,
          },
          monthlyChange: 35,
        }

        setData(mockData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch credit score"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreditScore()
  }, [])

  return {
    score: data?.score || 0,
    trend: data?.trend || "neutral",
    factors: data?.factors || {
      vaultBalance: 0,
      activityLevel: 0,
      yieldPerformance: 0,
      usageHistory: 0,
    },
    monthlyChange: data?.monthlyChange || 0,
    isLoading,
    error,
  }
}
