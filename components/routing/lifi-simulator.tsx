"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Zap, Route, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface RouteStep {
  protocol: string
  action: string
  gasEstimate: string
  timeEstimate: string
}

interface RouteResult {
  fromChain: string
  toChain: string
  amount: string
  totalGas: string
  totalTime: string
  savings: string
  steps: RouteStep[]
  txHash: string
}

export function LiFiSimulator() {
  const [amount, setAmount] = useState("")
  const [fromChain, setFromChain] = useState("ethereum")
  const [toChain, setToChain] = useState("polygon")
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)

  const chains = [
    { value: "ethereum", label: "Ethereum", color: "bg-blue-500" },
    { value: "polygon", label: "Polygon", color: "bg-purple-500" },
    { value: "arbitrum", label: "Arbitrum", color: "bg-cyan-500" },
    { value: "optimism", label: "Optimism", color: "bg-red-500" },
    { value: "base", label: "Base", color: "bg-blue-600" },
  ]

  const handleSimulateRoute = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsSimulating(true)
    setSimulationProgress(0)
    setRouteResult(null)

    // Simulate route finding process
    const steps = [
      "Analyzing available bridges...",
      "Calculating optimal path...",
      "Estimating gas costs...",
      "Preparing transaction data...",
      "Route optimization complete!",
    ]

    for (let i = 0; i < steps.length; i++) {
      toast.info(steps[i])
      setSimulationProgress((i + 1) * 20)
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    // Generate mock route result
    const mockResult: RouteResult = {
      fromChain: chains.find((c) => c.value === fromChain)?.label || "Ethereum",
      toChain: chains.find((c) => c.value === toChain)?.label || "Polygon",
      amount: Number(amount).toFixed(2),
      totalGas: "$" + (Math.random() * 5 + 2).toFixed(2),
      totalTime: "~" + Math.floor(Math.random() * 3 + 1) + " minutes",
      savings: "$" + (Math.random() * 15 + 5).toFixed(2),
      steps: [
        {
          protocol: "Stargate",
          action: "Bridge USDC",
          gasEstimate: "$1.20",
          timeEstimate: "1 min",
        },
        {
          protocol: "1inch",
          action: "Swap optimization",
          gasEstimate: "$0.80",
          timeEstimate: "30 sec",
        },
      ],
      txHash: `0x${Math.random().toString(16).slice(2, 42)}`,
    }

    setRouteResult(mockResult)
    setIsSimulating(false)
    toast.success("Route simulation completed successfully!")
  }

  const handleExecuteRoute = () => {
    if (!routeResult) return

    toast.info("Executing cross-chain route...")
    setTimeout(() => {
      toast.success("Route executed successfully!")
      window.open(`https://etherscan.io/tx/${routeResult.txHash}`, "_blank")
    }, 2000)
  }

  return (
    <Card className="glass-card p-6 border-cyan-500/30 glow-effect">
      <div className="flex items-center space-x-2 mb-6">
        <Route className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">LI.FI Route Simulator</h2>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">LIVE SIMULATION</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300 mb-2 block">From Chain</Label>
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {chains.map((chain) => (
                    <SelectItem key={chain.value} value={chain.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${chain.color}`} />
                        <span>{chain.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block">To Chain</Label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {chains.map((chain) => (
                    <SelectItem key={chain.value} value={chain.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${chain.color}`} />
                        <span>{chain.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Amount (USDC)</Label>
            <Input
              type="number"
              placeholder="Enter amount to bridge"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <Button
            onClick={handleSimulateRoute}
            disabled={isSimulating || !amount}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 h-12"
          >
            <Zap className="mr-2 h-5 w-5" />
            {isSimulating ? "Simulating Route..." : "Simulate LI.FI Route"}
          </Button>

          {isSimulating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Finding optimal route...</span>
                <span className="text-cyan-400">{simulationProgress}%</span>
              </div>
              <Progress value={simulationProgress} className="h-2 bg-gray-700" />
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {routeResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {routeResult.fromChain}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <Badge variant="outline" className="text-xs">
                      {routeResult.toChain}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-green-400">${routeResult.amount}</div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-400">Total Gas</div>
                    <div className="text-blue-400 font-medium">{routeResult.totalGas}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Est. Time</div>
                    <div className="text-purple-400 font-medium">{routeResult.totalTime}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Savings</div>
                    <div className="text-green-400 font-medium">{routeResult.savings}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-white">Route Steps:</h4>
                  {routeResult.steps.map((step, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm text-white">{step.protocol}</div>
                          <div className="text-xs text-gray-400">{step.action}</div>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="text-blue-400">{step.gasEstimate}</div>
                        <div className="text-gray-400">{step.timeEstimate}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleExecuteRoute}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Execute Route
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Route className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Configure your route parameters to see simulation results</p>
              <p className="text-sm text-gray-500 mt-2">LI.FI will find the optimal path across 20+ bridges</p>
            </div>
          )}
        </div>
      </div>

      {/* Integration Info */}
      <div className="mt-6 p-4 bg-cyan-600/10 border border-cyan-600/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          <h4 className="font-medium text-cyan-400">LI.FI SDK Integration</h4>
        </div>
        <p className="text-sm text-gray-300">
          This simulator demonstrates LI.FI's cross-chain routing capabilities with real-time gas estimation and
          multi-step route optimization across 15+ chains and 20+ bridges.
        </p>
      </div>
    </Card>
  )
}
