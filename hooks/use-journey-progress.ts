"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { ReactNode } from "react"

interface JourneyStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface JourneyProgressContextType {
  steps: JourneyStep[]
  completedSteps: string[]
  currentStep: number
  progress: { completedSteps: number; percentage: number }
  completeStep: (stepId: string, data?: any) => void
  isStepComplete: (stepId: string) => boolean
  getStepStatus: (stepId: string) => {
    isCompleted: boolean
    isActive: boolean
    completedData: any
  }
  getNextStep: () => JourneyStep | undefined
  resetJourney: () => void
  isJourneyComplete: () => boolean
  getCompletedSteps: () => JourneyStep[]
  getProgressPercentage: () => number
  markStepComplete: (stepId: string) => void
}

const JourneyProgressContext = createContext<JourneyProgressContextType | undefined>(undefined)

const initialSteps: JourneyStep[] = [
  {
    id: "connect_wallet",
    title: "Connect Wallet",
    description: "Connect your MetaMask wallet to access card balance",
    completed: false,
  },
  {
    id: "allocate_assets",
    title: "Allocate Assets",
    description: "Choose yield strategy for your idle balance",
    completed: false,
  },
  {
    id: "setup_routing",
    title: "Setup Routing",
    description: "Enable cross-chain yield optimization",
    completed: false,
  },
  {
    id: "enable_credit",
    title: "Enable Credit",
    description: "Activate vault-backed credit line",
    completed: false,
  },
  {
    id: "activity_log",
    title: "Activity Log",
    description: "Review automated DeFi transactions",
    completed: false,
  },
  {
    id: "mint_badge",
    title: "Mint Badge",
    description: "Claim your achievement NFT",
    completed: false,
  },
]

interface JourneyProgressProviderProps {
  children: ReactNode
}

export function JourneyProgressProvider({ children }: JourneyProgressProviderProps) {
  const [steps, setSteps] = useState<JourneyStep[]>(initialSteps)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [completedData, setCompletedData] = useState<Record<string, any>>({})
  const currentStep = completedSteps.length

  useEffect(() => {
    // Load completed steps from localStorage on mount
    const storedCompletedSteps = localStorage.getItem("yieldpay-completed-steps")
    const storedCompletedData = localStorage.getItem("yieldpay-completed-data")

    if (storedCompletedSteps) {
      const parsedSteps = JSON.parse(storedCompletedSteps)
      setCompletedSteps(parsedSteps)

      // Update steps to reflect completion status
      setSteps((prevSteps) =>
        prevSteps.map((step) => ({
          ...step,
          completed: parsedSteps.includes(step.id),
        })),
      )
    }

    if (storedCompletedData) {
      setCompletedData(JSON.parse(storedCompletedData))
    }
  }, [])

  useEffect(() => {
    // Save completed steps to localStorage whenever it changes
    localStorage.setItem("yieldpay-completed-steps", JSON.stringify(completedSteps))
    localStorage.setItem("yieldpay-completed-data", JSON.stringify(completedData))
  }, [completedSteps, completedData])

  const completeStep = useCallback((stepId: string, data?: any) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev : [...prev, stepId]))

    if (data !== undefined) {
      setCompletedData((prev) => ({ ...prev, [stepId]: data }))
    }

    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, completed: true } : step)))
  }, [])

  const isStepComplete = useCallback((stepId: string) => completedSteps.includes(stepId), [completedSteps])

  const getStepStatus = useCallback(
    (stepId: string) => {
      const isCompleted = completedSteps.includes(stepId)
      const stepIndex = steps.findIndex((s) => s.id === stepId)
      const isActive = stepIndex === completedSteps.length // next actionable step
      const data = completedData[stepId]

      return {
        isCompleted,
        isActive,
        completedData: data,
      }
    },
    [completedSteps, steps, completedData],
  )

  const getNextStep = useCallback(() => {
    const nextStepIndex = completedSteps.length
    return steps[nextStepIndex]
  }, [completedSteps, steps])

  const resetJourney = useCallback(() => {
    setCompletedSteps([])
    setCompletedData({})
    setSteps(
      initialSteps.map((step) => ({
        ...step,
        completed: false,
      })),
    )
    localStorage.removeItem("yieldpay-completed-steps")
    localStorage.removeItem("yieldpay-completed-data")
  }, [])

  const isJourneyComplete = useCallback(() => {
    return completedSteps.length === steps.length
  }, [completedSteps, steps])

  const getCompletedSteps = useCallback(() => {
    return steps.filter((step) => step.completed)
  }, [steps])

  const getProgressPercentage = useCallback(() => {
    return (completedSteps.length / steps.length) * 100
  }, [completedSteps, steps])

  const markStepComplete = useCallback((stepId: string) => {
    setSteps((prevSteps) => prevSteps.map((step) => (step.id === stepId ? { ...step, completed: true } : step)))
  }, [])

  const progressInfo = {
    completedSteps: completedSteps.length,
    percentage: getProgressPercentage(),
  }

  const value: JourneyProgressContextType = {
    steps,
    completedSteps,
    currentStep,
    progress: progressInfo,
    completeStep,
    isStepComplete,
    getStepStatus,
    getNextStep,
    resetJourney,
    isJourneyComplete,
    getCompletedSteps,
    getProgressPercentage,
    markStepComplete,
  }

  return <JourneyProgressContext.Provider value={value}>{children}</JourneyProgressContext.Provider>
}

export function useJourneyProgress() {
  const context = useContext(JourneyProgressContext)
  if (!context) {
    throw new Error("useJourneyProgress must be used within a JourneyProgressProvider")
  }
  return context
}

// Re-export from the main hook file from "./use-journey-progress"
export type { JourneyProgressContextType } from "./use-journey-progress"
