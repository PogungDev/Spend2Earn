"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Target, Lightbulb } from "lucide-react"
import { toast } from "sonner"

interface OptimizationSuggestion {
  action: string
  impact: string
  risk: "Low" | "Medium" | "High"
  expectedGain: string
  timeframe: string
}

interface YieldOptimizerProps {
  optimizationResult: {
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
    recommendations: string[]
  } | null
  isOptimizing: boolean
  onOptimize: () => void
}

export function YieldOptimizer({ optimizationResult, isOptimizing, onOptimize }: YieldOptimizerProps) {
  const [optimizationProgress, setOptimizationProgress] = useState(0)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  // Simulate progress for the UI
  useState(() => {
    if (isOptimizing) {
      let progress = 0
      const interval = setInterval(() => {
        progress += 5
        if (progress <= 100) {
          setOptimizationProgress(progress)
        } else {
          clearInterval(interval)
        }
      }, 100)
      return () => clearInterval(interval)
    } else {
      setOptimizationProgress(0)
    }
  }, [isOptimizing])

  return (
    <Card className="glass-card p-6 border-purple-500/30 glow-effect">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">AI Yield Optimizer</h2>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">SMART ANALYSIS</Badge>
      </div>

      {!optimizationResult && !isOptimizing && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Optimize Your Yield Strategy</h3>
          <p className="text-gray-400 mb-6">Get AI-powered recommendations to maximize your portfolio performance</p>
          <Button
            onClick={onOptimize}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Target className="mr-2 h-4 w-4" />
            Analyze & Optimize
          </Button>
        </div>
      )}

      {isOptimizing && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Analyzing Your Portfolio</h3>
            <p className="text-gray-400 mb-4">AI is scanning market conditions and optimizing your allocation...</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Optimization Progress</span>
              <span className="text-purple-400">{optimizationProgress}%</span>
            </div>
            <Progress value={optimizationProgress} className="h-3 bg-gray-700" />
          </div>
        </div>
      )}

      {optimizationResult && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">🎯 Optimization Recommendations</h3>
            <p className="text-gray-400">Based on current market conditions and your risk profile</p>
          </div>

          {/* Before & After Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-white/5 border border-white/10">
              <h4 className="font-medium text-gray-400 mb-2">Current APY</h4>
              <div className="text-3xl font-bold text-white">{optimizationResult.originalAPY.toFixed(1)}%</div>
            </Card>
            <Card className="p-4 bg-green-600/10 border border-green-600/30">
              <h4 className="font-medium text-green-400 mb-2">Optimized APY</h4>
              <div className="text-3xl font-bold text-green-400">{optimizationResult.optimizedAPY.toFixed(1)}%</div>
              <div className="text-sm text-green-300">+{optimizationResult.improvement.toFixed(1)}% Improvement</div>
            </Card>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {optimizationResult.recommendations.map((rec, index) => (
              <Card key={index} className="p-4 bg-white/5 border border-white/10">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <p className="text-white text-sm">{rec}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Optimized Allocation */}
          <Card className="p-4 bg-white/5 border border-white/10">
            <h3 className="font-semibold text-white mb-4">Optimized Allocation Breakdown</h3>
            <div className="space-y-3">
              {optimizationResult.allocations.map((alloc, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{alloc.protocol}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{alloc.percentage}%</span>
                    <span className="text-green-400">({alloc.apy.toFixed(1)}% APY)</span>
                    <span className="text-gray-300">(${alloc.amount})</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Summary */}
          <Card className="p-4 bg-green-600/10 border border-green-600/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-400 mb-1">Expected Yearly Profit</h4>
                <p className="text-sm text-gray-400">Based on optimized APY</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">${optimizationResult.expectedYearlyProfit}</div>
                <div className="text-sm text-green-300">Risk: {optimizationResult.riskScore}</div>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => {
              onOptimize() // Re-run optimization
              toast.info("Running new optimization analysis...")
            }}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            Run New Analysis
          </Button>
        </div>
      )}
    </Card>
  )
}
