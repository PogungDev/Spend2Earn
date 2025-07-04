"use client"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount } from "wagmi"

export function useAutoRepayment() {
  const { address } = useAccount()
  const queryClient = useQueryClient()
  const [isAutoRepayEnabled, setIsAutoRepayEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate fetching initial state
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      // In a real app, fetch from backend/smart contract
      const storedSetting = localStorage.getItem(`autoRepay-${address}`)
      setIsAutoRepayEnabled(storedSetting === "true")
      setIsLoading(false)
    }
    if (address) {
      fetchSettings()
    } else {
      setIsAutoRepayEnabled(false)
      setIsLoading(false)
    }
  }, [address])

  const { mutate: toggleAutoRepayMutation, isPending: isToggling } = useMutation({
    mutationFn: async (enable: boolean) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      // In a real app, this would interact with your smart contract or backend
      localStorage.setItem(`autoRepay-${address}`, String(enable))
      return enable
    },
    onSuccess: (newStatus) => {
      setIsAutoRepayEnabled(newStatus)
      queryClient.invalidateQueries({ queryKey: ["auto-repayment-settings", address] })
    },
    onError: (error) => {
      console.error("Failed to toggle auto-repayment:", error)
      // Optionally revert UI state or show error message
    },
  })

  const toggleAutoRepay = () => {
    toggleAutoRepayMutation(!isAutoRepayEnabled)
  }

  return {
    isAutoRepayEnabled,
    toggleAutoRepay,
    isLoading: isLoading || isToggling,
  }
}
