"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { YieldPerformanceChart } from "@/components/yield/yield-performance-chart"
import { YieldAllocationChart } from "@/components/yield/allocation-chart"
import { ProtocolComparison } from "@/components/yield/protocol-comparison"
import { Target, Shuffle, Zap, CheckCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const ALLOCATION_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]

const AllocationOptimizer = () => {
  const [riskTolerance, setRiskTolerance] = useState("medium")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<any>(null)

  const allocationData = {
    conservative: [
      { name: "Stable Yield (Aave)", value: 70, apy: 4.5, color: "#22c55e" },
      { name: "Medium Risk (Curve)", value: 25, apy: 7.2, color: "#3b82f6" },
      { name: "High Yield (GMX)", value: 5, apy: 18.0, color: "#f59e0b" },
    ],
    medium: [
      { name: "Stable Yield (Aave)", value: 40, apy: 4.5, color: "#22c55e" },
      { name: "Medium Risk (Curve)", value: 35, apy: 7.2, color: "#3b82f6" },
      { name: "High Yield (Uniswap V3)", value: 25, apy: 12.1, color: "#f59e0b" },
    ],
    aggressive: [
      { name: "Stable Yield (Aave)", value: 20, apy: 4.5, color: "#22c55e" },
      { name: "Medium Risk (Curve)", value: 30, apy: 7.2, color: "#3b82f6" },
      { name: "High Yield (GMX)", value: 50, apy: 18.0, color: "#ef4444" },
    ],
  }

  const currentAllocation = allocationData[riskTolerance as keyof typeof allocationData]
  const weightedAPY = currentAllocation.reduce((sum, item) => sum + (item.apy * item.value) / 100, 0)

  const optimizeAllocation = async () => {
    setIsOptimizing(true)

    // Simulate AI optimization
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const result = {
      oldAPY: weightedAPY,
      newAPY: weightedAPY + 2.3,
      gasSaved: "$45",
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
      routeUsed: "LI.FI → Arbitrum → Base",
      improvement: "$2,340 annually",
    }

    setOptimizationResult(result)
    setIsOptimizing(false)
  }

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold">AI Allocation Engine</h3>
        </div>
        <div className="px-3 py-1 bg-orange-500/20 rounded-full">
          <span className="text-xs text-orange-400 font-medium">COMPOSABLE DeFi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <div>
          <div className="mb-4">
            <Label className="text-gray-300">Risk Tolerance</Label>
            <Select value={riskTolerance} onValueChange={setRiskTolerance}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="conservative">Conservative (4-6% APY)</SelectItem>
                <SelectItem value="medium">Medium Risk (8-12% APY)</SelectItem>
                <SelectItem value="aggressive">Aggressive (15-20% APY)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentAllocation}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name.split(" ")[0]}: ${value}%`}
                >
                  {currentAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Optimization Results */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <h4 className="font-medium text-blue-400 mb-2">Current Allocation</h4>
            <div className="space-y-2">
              {currentAllocation.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-white">
                    {item.value}% ({item.apy}% APY)
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-blue-600/30">
              <div className="flex justify-between">
                <span className="text-gray-300">Weighted APY:</span>
                <span className="text-green-400 font-bold">{weightedAPY.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <Button
            onClick={optimizeAllocation}
            disabled={isOptimizing}
            className="w-full bg-gradient-metamask hover:opacity-90"
          >
            {isOptimizing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                AI Optimizing...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Optimize Allocation
              </>
            )}
          </Button>

          {optimizationResult && (
            <div className="p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h4 className="font-medium text-green-400">Optimization Complete!</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">APY Improvement:</span>
                  <span className="text-green-400">
                    {optimizationResult.oldAPY.toFixed(2)}% → {optimizationResult.newAPY.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Route Used:</span>
                  <span className="text-blue-400">{optimizationResult.routeUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Gas Saved:</span>
                  <span className="text-purple-400">{optimizationResult.gasSaved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Annual Improvement:</span>
                  <span className="text-orange-400 font-bold">{optimizationResult.improvement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tx Hash:</span>
                  <span className="text-gray-400 font-mono text-xs">{optimizationResult.txHash}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

const ProtocolRoutingEngine = () => {
  const [amount, setAmount] = useState("1000")
  const [targetProtocol, setTargetProtocol] = useState("aave")
  const [crossChain, setCrossChain] = useState(false)
  const [routingResult, setRoutingResult] = useState<any>(null)
  const [isRouting, setIsRouting] = useState(false)

  const executeRouting = async () => {
    setIsRouting(true)

    // Simulate LI.FI SDK routing
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const routes = {
      aave: { chain: "Ethereum", gasCost: "$12.50", apy: "4.5%" },
      curve: { chain: "Arbitrum", gasCost: "$3.20", apy: "7.2%" },
      uniswap: { chain: "Polygon", gasCost: "$0.80", apy: "12.1%" },
      gmx: { chain: "Arbitrum", gasCost: "$4.10", apy: "18.0%" },
    }

    const selectedRoute = routes[targetProtocol as keyof typeof routes]

    const result = {
      protocol: targetProtocol.toUpperCase(),
      chain: selectedRoute.chain,
      amount: amount,
      gasCost: selectedRoute.gasCost,
      apy: selectedRoute.apy,
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
      estimatedTime: crossChain ? "2-5 minutes" : "30 seconds",
      route: crossChain
        ? `Ethereum → ${selectedRoute.chain} → ${targetProtocol.toUpperCase()}`
        : `Direct → ${targetProtocol.toUpperCase()}`,
    }

    setRoutingResult(result)
    setIsRouting(false)
  }

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Shuffle className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Protocol Routing Engine</h3>
        </div>
        <div className="px-3 py-1 bg-blue-500/20 rounded-full">
          <span className="text-xs text-blue-400 font-medium">LI.FI SDK</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Amount (USDC)</Label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="1000"
            />
          </div>
          <div>
            <Label className="text-gray-300">Target Protocol</Label>
            <Select value={targetProtocol} onValueChange={setTargetProtocol}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="aave">Aave V3 (4.5% APY)</SelectItem>
                <SelectItem value="curve">Curve Finance (7.2% APY)</SelectItem>
                <SelectItem value="uniswap">Uniswap V3 (12.1% APY)</SelectItem>
                <SelectItem value="gmx">GMX (18.0% APY)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="crossChain"
            checked={crossChain}
            onChange={(e) => setCrossChain(e.target.checked)}
            className="rounded border-gray-600 bg-gray-700"
          />
          <Label htmlFor="crossChain" className="text-gray-300">
            Enable Cross-Chain Routing
          </Label>
        </div>

        <Button onClick={executeRouting} disabled={isRouting} className="w-full bg-blue-600 hover:bg-blue-700">
          {isRouting ? (
            <>
              <Shuffle className="w-4 h-4 mr-2 animate-spin" />
              Finding Optimal Route...
            </>
          ) : (
            <>
              <Shuffle className="w-4 h-4 mr-2" />
              Execute Protocol Routing
            </>
          )}
        </Button>

        {routingResult && (
          <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <h4 className="font-medium text-blue-400">Route Executed Successfully!</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Protocol:</span>
                <span className="text-white">{routingResult.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Chain:</span>
                <span className="text-blue-400">{routingResult.chain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Amount:</span>
                <span className="text-green-400">${routingResult.amount} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Expected APY:</span>
                <span className="text-green-400">{routingResult.apy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Gas Cost:</span>
                <span className="text-orange-400">{routingResult.gasCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Route:</span>
                <span className="text-purple-400">{routingResult.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Tx Hash:</span>
                <span className="text-gray-400 font-mono text-xs">{routingResult.txHash}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export function YieldTab() {
  return (
    <div className="space-y-6 h-full">
      {/* Protocol Routing Engine */}
      <ProtocolRoutingEngine />

      {/* AI Allocation Engine */}
      <AllocationOptimizer />

      {/* Performance Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <YieldPerformanceChart />
        <YieldAllocationChart />
      </div>

      {/* Protocol Comparison */}
      <ProtocolComparison />
    </div>
  )
}
