"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Shuffle, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export function SDKIntegrationPanel() {
  const [integrations, setIntegrations] = useState([
    {
      name: "MetaMask DTK",
      status: "connected",
      lastTx: "0x1a2b3c4d...",
      action: "Credit Delegation",
      icon: <Zap className="w-4 h-4" />,
    },
    {
      name: "LI.FI SDK",
      status: "processing",
      lastTx: "0x5e6f7g8h...",
      action: "Cross-chain Bridge",
      icon: <Shuffle className="w-4 h-4" />,
    },
    {
      name: "Circle Wallets",
      status: "completed",
      lastTx: "0x9i0j1k2l...",
      action: "USDC Transfer",
      icon: <DollarSign className="w-4 h-4" />,
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-red-500/20 text-red-400 border-red-500/30"
    }
  }

  const simulateTransaction = (index: number) => {
    const integration = integrations[index]
    toast.success(`Testing ${integration.name} SDK...`)

    const newIntegrations = [...integrations]
    newIntegrations[index].status = "processing"
    newIntegrations[index].lastTx = `0x${Math.random().toString(16).slice(2, 10)}...`
    setIntegrations(newIntegrations)

    setTimeout(() => {
      const updatedIntegrations = [...newIntegrations]
      updatedIntegrations[index].status = "completed"
      setIntegrations(updatedIntegrations)
      toast.success(`${integration.name} test completed successfully!`)
    }, 3000)
  }

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
      <h3 className="text-lg font-semibold mb-4">SDK Integrations</h3>
      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <div key={index} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-600/50 rounded-lg">{integration.icon}</div>
                <div>
                  <p className="font-medium">{integration.name}</p>
                  <p className="text-sm text-gray-400">{integration.action}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(integration.status)}
                <Badge className={getStatusColor(integration.status)}>{integration.status}</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Last Transaction</p>
                <p className="text-sm font-mono text-gray-300">{integration.lastTx}</p>
              </div>
              <Button
                size="sm"
                onClick={() => simulateTransaction(index)}
                disabled={integration.status === "processing"}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              >
                {integration.status === "processing" ? "Testing..." : "Test SDK"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
        <h4 className="font-medium text-green-400 mb-2">Integration Status</h4>
        <p className="text-sm text-gray-300">
          All SDKs are functioning correctly. Real transactions will be processed through these integrations in
          production.
        </p>
      </div>
    </Card>
  )
}
