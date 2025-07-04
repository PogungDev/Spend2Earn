"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

interface AllocationData {
  protocol: string
  percentage: number
  amount: number
  apy: number
  color: string
}

export function AllocationChart() {
  const [allocations, setAllocations] = useState<AllocationData[]>([
    { protocol: "Aave USDC", percentage: 35, amount: 8750, apy: 4.2, color: "bg-blue-500" },
    { protocol: "Uniswap V3", percentage: 25, amount: 6250, apy: 12.8, color: "bg-purple-500" },
    { protocol: "Curve 3Pool", percentage: 23, amount: 5750, apy: 6.5, color: "bg-green-500" },
    { protocol: "Pendle PT-stETH", percentage: 17, amount: 4250, apy: 15.2, color: "bg-orange-500" },
  ])

  useEffect(() => {
    // Simulate real-time allocation updates
    const interval = setInterval(() => {
      setAllocations((prev) =>
        prev.map((allocation) => ({
          ...allocation,
          apy: allocation.apy + (Math.random() - 0.5) * 0.5,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const totalAmount = allocations.reduce((sum, allocation) => sum + allocation.amount, 0)
  const weightedAPY = allocations.reduce((sum, allocation) => sum + allocation.apy * (allocation.percentage / 100), 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-white">${totalAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Allocated</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{weightedAPY.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Weighted APY</div>
        </div>
      </div>

      {/* Allocation Breakdown */}
      <div className="space-y-4">
        {allocations.map((allocation, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${allocation.color}`} />
                <span className="text-white font-medium">{allocation.protocol}</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{allocation.percentage}%</div>
                <div className="text-xs text-gray-400">${allocation.amount.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Progress value={allocation.percentage} className="flex-1 mr-4 h-2" />
              <span className="text-green-400 font-medium">{allocation.apy.toFixed(1)}% APY</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rebalancing Suggestion */}
      <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
        <h4 className="font-medium text-blue-400 mb-2">💡 Optimization Suggestion</h4>
        <p className="text-sm text-gray-300">
          Consider increasing Pendle allocation by 5% to boost overall APY to 15.8%. This would increase monthly yield
          by approximately $127.
        </p>
      </div>
    </div>
  )
}
