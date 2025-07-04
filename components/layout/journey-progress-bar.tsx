"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle } from "lucide-react"

export function JourneyProgressBar() {
  // Mock progress data - in real app this would come from context/state
  const steps = [
    { id: 1, name: "Wallet", completed: true },
    { id: 2, name: "Allocation", completed: true },
    { id: 3, name: "Routing", completed: true },
    { id: 4, name: "Credit", completed: false },
    { id: 5, name: "Activity", completed: false },
    { id: 6, name: "Badge", completed: false },
  ]

  const completedSteps = steps.filter((step) => step.completed).length
  const progressPercentage = (completedSteps / steps.length) * 100

  return (
    <Card className="mx-4 mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-gray-900">Setup Progress</h3>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {completedSteps}/{steps.length} Complete
            </Badge>
          </div>
          <div className="text-sm text-gray-600">{Math.round(progressPercentage)}% Complete</div>
        </div>

        <Progress value={progressPercentage} className="mb-3 h-2" />

        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center space-y-1">
              {step.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
              <span className={`text-xs ${step.completed ? "text-green-600 font-medium" : "text-gray-400"}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
