"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"
import { useAIInsights } from "@/hooks/ai/useAIInsights"

export function AIInsightsPanel() {
  const { insights, isLoading } = useAIInsights()

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "suggestion":
        return <Lightbulb className="w-4 h-4 text-blue-500" />
      default:
        return <Brain className="w-4 h-4 text-purple-500" />
    }
  }

  return (
    <Card variant="gradient" className="space-y-4">
      <div className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold">AI Insights</h3>
        <div className="flex-1" />
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading insights...</div>
        ) : insights?.length === 0 ? (
          <div className="text-center text-gray-400">No new insights.</div>
        ) : (
          insights?.map((insight, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white/60 transition-colors"
            >
              <div className="flex items-start space-x-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{insight.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                  {insight.action && (
                    <button className="text-xs text-blue-600 dark:text-blue-400 mt-2 hover:underline">
                      {insight.action}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full text-white/80 border-white/20 hover:bg-white/10 bg-transparent"
      >
        <Brain className="w-4 h-4 mr-2" />
        View All Insights
      </Button>
    </Card>
  )
}
