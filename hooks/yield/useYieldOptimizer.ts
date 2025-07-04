"use client"

import { useState } from "react"
import { YieldOptimizer as AIYieldOptimizer } from "@/lib/ai/yield-optimizer" // Import the AI mock

interface OptimizationResult {
  originalAPY: number
  optimizedAPY: number
  improvement: number
  allocations: Array<{
    protocol: string
    percentage: number
    apy: number
    amount: string
  }>
  expectedYearlyProfit: string
  riskScore: string
  txHash: string
  recommendations: string[] // Add recommendations from AI
}

export function useYieldOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)

  const aiOptimizer = new AIYieldOptimizer()

  const optimizeAllocation = async (amount: string, riskTolerance: number): Promise<OptimizationResult> => {
    setIsOptimizing(true)
    setOptimizationResult(null) // Clear previous results

    try {
      // Simulate AI processing
      const aiResult = await aiOptimizer.findOptimalAllocation({
        amount,
        riskTolerance,
        userAddress: "0xUserMockAddress", // Mock user address
      })

      // Map AI result to OptimizationResult format
      const result: OptimizationResult = {
        originalAPY: 4.2, // Base APY before optimization
        optimizedAPY: aiResult.estimatedTotalAPY,
        improvement: Number.parseFloat((aiResult.estimatedTotalAPY - 4.2).toFixed(2)),
        allocations: aiResult.optimizedAllocation.map((alloc) => ({
          protocol: `${alloc.protocol} (${alloc.chain})`,
          percentage: alloc.percentage,
          apy: alloc.expectedAPY,
          amount: (Number.parseFloat(amount) * (alloc.percentage / 100)).toFixed(0),
        })),
        expectedYearlyProfit: (Number.parseFloat(amount) * (aiResult.estimatedTotalAPY / 100)).toFixed(0),
        riskScore: riskTolerance > 70 ? "High" : riskTolerance > 40 ? "Medium" : "Low",
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
        recommendations: aiResult.recommendations,
      }

      setOptimizationResult(result)
      return result
    } finally {
      setIsOptimizing(false)
    }
  }

  return {
    optimizeAllocation,
    isOptimizing,
    optimizationResult,
  }
}
