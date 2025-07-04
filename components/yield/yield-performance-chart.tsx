"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PerformanceData {
  date: string
  yield: number
  cumulative: number
}

export function YieldPerformanceChart() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [totalYield, setTotalYield] = useState(0)
  const [monthlyGrowth, setMonthlyGrowth] = useState(0)

  useEffect(() => {
    // Generate mock performance data for the last 30 days
    const data: PerformanceData[] = []
    let cumulative = 0

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dailyYield = Math.random() * 50 + 20 // $20-70 daily yield
      cumulative += dailyYield

      data.push({
        date: date.toISOString().split("T")[0],
        yield: dailyYield,
        cumulative,
      })
    }

    setPerformanceData(data)
    setTotalYield(cumulative)
    setMonthlyGrowth((cumulative / 25000) * 100) // Assuming $25k initial
  }, [])

  const maxYield = Math.max(...performanceData.map((d) => d.yield))
  const avgYield = performanceData.reduce((sum, d) => sum + d.yield, 0) / performanceData.length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
          <div className="text-xl font-bold text-green-400">${totalYield.toFixed(2)}</div>
          <div className="text-sm text-gray-400">Total Yield (30d)</div>
        </div>
        <div className="text-center p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <div className="text-xl font-bold text-blue-400">${avgYield.toFixed(2)}</div>
          <div className="text-sm text-gray-400">Avg Daily Yield</div>
        </div>
        <div className="text-center p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
          <div className="text-xl font-bold text-purple-400">{monthlyGrowth.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Monthly Growth</div>
        </div>
      </div>

      {/* Chart Visualization */}
      <Card className="p-4 bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-white">30-Day Yield Performance</h4>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">TRENDING UP</Badge>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-2">
          {performanceData.slice(-7).map((data, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-16 text-xs text-gray-400">
                {new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
              <div className="flex-1 bg-gray-700 rounded-full h-4 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(data.yield / maxYield) * 100}%` }}
                />
              </div>
              <div className="w-16 text-xs text-white text-right">${data.yield.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">Last 7 days • Hover for details</div>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-blue-600/10 border border-blue-600/30">
          <h4 className="font-medium text-blue-400 mb-2">📈 Best Performing Day</h4>
          <div className="text-lg font-bold text-white">${maxYield.toFixed(2)}</div>
          <p className="text-sm text-gray-400">Highest single-day yield this month</p>
        </Card>

        <Card className="p-4 bg-purple-600/10 border border-purple-600/30">
          <h4 className="font-medium text-purple-400 mb-2">🎯 Projected Annual</h4>
          <div className="text-lg font-bold text-white">${(avgYield * 365).toFixed(0)}</div>
          <p className="text-sm text-gray-400">Based on current performance</p>
        </Card>
      </div>
    </div>
  )
}
