"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CreditHistoryData {
  date: string
  creditUsed: number
  creditLimit: number
  utilizationRate: number
}

export function CreditHistoryChart() {
  const [historyData, setHistoryData] = useState<CreditHistoryData[]>([])

  useEffect(() => {
    // Generate mock credit history data for the last 30 days
    const data: CreditHistoryData[] = []

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const creditLimit = 8000 + Math.random() * 4000 // $8k-12k limit
      const creditUsed = Math.random() * creditLimit * 0.6 // Up to 60% utilization
      const utilizationRate = (creditUsed / creditLimit) * 100

      data.push({
        date: date.toISOString().split("T")[0],
        creditUsed,
        creditLimit,
        utilizationRate,
      })
    }

    setHistoryData(data)
  }, [])

  const avgUtilization = historyData.reduce((sum, d) => sum + d.utilizationRate, 0) / historyData.length
  const maxUtilization = Math.max(...historyData.map((d) => d.utilizationRate))
  const currentUtilization = historyData[historyData.length - 1]?.utilizationRate || 0

  const getUtilizationColor = (rate: number) => {
    if (rate <= 30) return "bg-green-500"
    if (rate <= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <div className="text-lg font-bold text-blue-400">{currentUtilization.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Current Usage</div>
        </div>
        <div className="text-center p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
          <div className="text-lg font-bold text-green-400">{avgUtilization.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">30-Day Average</div>
        </div>
        <div className="text-center p-3 bg-orange-600/10 border border-orange-600/30 rounded-lg">
          <div className="text-lg font-bold text-orange-400">{maxUtilization.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Peak Usage</div>
        </div>
      </div>

      {/* Chart Visualization */}
      <Card className="p-4 bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-white">30-Day Credit Utilization</h4>
          <Badge
            className={
              avgUtilization <= 30
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : avgUtilization <= 60
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
            }
          >
            {avgUtilization <= 30 ? "HEALTHY" : avgUtilization <= 60 ? "MODERATE" : "HIGH"}
          </Badge>
        </div>

        {/* Simple Line Chart Representation */}
        <div className="space-y-1">
          {historyData.slice(-14).map((data, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-12 text-xs text-gray-400">
                {new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
              <div className="flex-1 bg-gray-700 rounded-full h-3 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getUtilizationColor(data.utilizationRate)}`}
                  style={{ width: `${Math.min(data.utilizationRate, 100)}%` }}
                />
              </div>
              <div className="w-12 text-xs text-white text-right">{data.utilizationRate.toFixed(0)}%</div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span className="text-yellow-400">30% (Optimal)</span>
          <span className="text-red-400">60% (High)</span>
          <span>100%</span>
        </div>
      </Card>

      {/* Usage Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-blue-600/10 border border-blue-600/30">
          <h4 className="font-medium text-blue-400 mb-2">📊 Usage Pattern</h4>
          <div className="text-sm text-gray-300">
            Your credit utilization has been consistently below 40%, which is excellent for maintaining a high credit
            score.
          </div>
        </Card>

        <Card className="p-4 bg-green-600/10 border border-green-600/30">
          <h4 className="font-medium text-green-400 mb-2">🎯 Optimization</h4>
          <div className="text-sm text-gray-300">
            Maintaining current usage patterns will continue to positively impact your vault-based credit score.
          </div>
        </Card>
      </div>
    </div>
  )
}
