"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, TrendingUp, AlertCircle } from "lucide-react"

export function CreditScoreCard() {
  const [creditScore, setCreditScore] = useState(725)
  const [scoreChange, setScoreChange] = useState(45)
  const [factors, setFactors] = useState([
    { name: "Vault Value", score: 95, impact: "Excellent" },
    { name: "Yield Performance", score: 88, impact: "Very Good" },
    { name: "Usage History", score: 92, impact: "Excellent" },
    { name: "Utilization Rate", score: 85, impact: "Good" },
  ])

  useEffect(() => {
    // Simulate real-time score updates
    const interval = setInterval(() => {
      setCreditScore((prev) => prev + (Math.random() - 0.5) * 2)
      setScoreChange((prev) => prev + (Math.random() - 0.5) * 1)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getScoreRating = (score: number) => {
    if (score >= 750) return { rating: "Excellent", color: "text-green-400" }
    if (score >= 700) return { rating: "Very Good", color: "text-blue-400" }
    if (score >= 650) return { rating: "Good", color: "text-yellow-400" }
    return { rating: "Fair", color: "text-orange-400" }
  }

  const scoreRating = getScoreRating(creditScore)

  return (
    <Card className="glass-card p-6 border-blue-500/30 glow-effect">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Credit Score</h2>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">VAULT-BASED</Badge>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white mb-2">{Math.round(creditScore)}</div>
        <div className={`text-lg font-medium ${scoreRating.color} mb-2`}>{scoreRating.rating}</div>
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-medium">+{Math.round(scoreChange)} points</span>
          <span className="text-gray-400 text-sm">(30 days)</span>
        </div>
      </div>

      {/* Score Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Score Range</span>
          <span className="text-white">300 - 850</span>
        </div>
        <Progress value={(creditScore / 850) * 100} className="h-3 bg-gray-700" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Score Factors */}
      <div className="space-y-4">
        <h3 className="font-medium text-white">Score Factors</h3>
        {factors.map((factor, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{factor.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white font-medium">{factor.score}/100</span>
                <Badge
                  className={
                    factor.score >= 90
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : factor.score >= 80
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }
                >
                  {factor.impact}
                </Badge>
              </div>
            </div>
            <Progress value={factor.score} className="h-2 bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Improvement Tip */}
      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-400 mb-1">💡 Score Improvement Tip</h4>
            <p className="text-sm text-gray-300">
              Maintain utilization below 30% and increase vault value to boost your score to 750+ for premium benefits.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
