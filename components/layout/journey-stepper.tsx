"use client"

import { useJourneyProgress } from "@/hooks/use-journey-progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock, ArrowRight } from "lucide-react"
import { journeySteps } from "@/lib/journey-steps"

interface JourneyStepperProps {
  onStepClick?: (stepId: string) => void
}

export function JourneyStepper({ onStepClick }: JourneyStepperProps) {
  const { journeyProgress, getStepStatus } = useJourneyProgress()

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Complete Your Setup</h2>
        <p className="text-gray-400">Follow these steps to unlock the full potential of YieldPay Pro</p>
      </div>

      <div className="grid gap-4">
        {journeySteps.map((step, index) => {
          const status = getStepStatus(step.id)
          const journeyStep = journeyProgress.steps.find((s) => s.id === step.id)

          return (
            <Card
              key={step.id}
              className={`glass-card transition-all cursor-pointer ${
                status === "completed"
                  ? "bg-green-600/10 border-green-600/30"
                  : status === "active"
                    ? "bg-blue-600/10 border-blue-600/30"
                    : "bg-gray-800/30 border-gray-600/30"
              }`}
              onClick={() => onStepClick?.(step.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === "completed" ? "bg-green-600" : status === "active" ? "bg-blue-600" : "bg-gray-600"
                      }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : status === "active" ? (
                        <Circle className="w-5 h-5 text-white animate-pulse" />
                      ) : (
                        <Clock className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle
                        className={`text-lg ${
                          status === "completed"
                            ? "text-green-300"
                            : status === "active"
                              ? "text-blue-300"
                              : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge
                      variant="outline"
                      className={
                        status === "completed"
                          ? "text-green-400 border-green-400"
                          : status === "active"
                            ? "text-blue-400 border-blue-400"
                            : "text-gray-400 border-gray-400"
                      }
                    >
                      {step.estimatedTime}
                    </Badge>
                    {status === "active" && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Start <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {(status === "active" || status === "completed") && (
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-white mb-2">Requirements:</h4>
                      <ul className="space-y-1 text-gray-400">
                        {step.requirements.map((req, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Benefits:</h4>
                      <ul className="space-y-1 text-gray-400">
                        {step.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-green-400 rounded-full" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {status === "completed" && journeyStep?.completedData && (
                    <div className="mt-4 p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                      <div className="text-sm text-green-400 font-medium mb-1">Completed:</div>
                      <div className="text-xs text-gray-300">
                        {Object.entries(journeyStep.completedData).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/_/g, " ")}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
