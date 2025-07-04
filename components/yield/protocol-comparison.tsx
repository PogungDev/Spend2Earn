"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, Zap } from "lucide-react"

interface Protocol {
  name: string
  apy: number
  tvl: string
  risk: "Low" | "Medium" | "High"
  category: string
  allocation: number
  isActive: boolean
}

export function ProtocolComparison() {
  const [protocols] = useState<Protocol[]>([
    {
      name: "Aave V3 USDC",
      apy: 4.2,
      tvl: "$2.1B",
      risk: "Low",
      category: "Lending",
      allocation: 35,
      isActive: true,
    },
    {
      name: "Uniswap V3 ETH/USDC",
      apy: 12.8,
      tvl: "$890M",
      risk: "Medium",
      category: "DEX LP",
      allocation: 25,
      isActive: true,
    },
    {
      name: "Curve 3Pool",
      apy: 6.5,
      tvl: "$1.5B",
      risk: "Low",
      category: "Stable LP",
      allocation: 23,
      isActive: true,
    },
    {
      name: "Pendle PT-stETH",
      apy: 15.2,
      tvl: "$340M",
      risk: "High",
      category: "Yield Trading",
      allocation: 17,
      isActive: true,
    },
    {
      name: "Compound USDC",
      apy: 3.8,
      tvl: "$1.2B",
      risk: "Low",
      category: "Lending",
      allocation: 0,
      isActive: false,
    },
    {
      name: "Yearn USDC Vault",
      apy: 8.9,
      tvl: "$450M",
      risk: "Medium",
      category: "Yield Aggregator",
      allocation: 0,
      isActive: false,
    },
  ])

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Lending":
        return <Shield className="w-4 h-4" />
      case "DEX LP":
        return <Zap className="w-4 h-4" />
      case "Yield Trading":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Available Protocols</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>Active</span>
          <div className="w-2 h-2 bg-gray-500 rounded-full ml-4" />
          <span>Available</span>
        </div>
      </div>

      <div className="space-y-3">
        {protocols.map((protocol, index) => (
          <Card
            key={index}
            className={`p-4 border transition-all ${
              protocol.isActive
                ? "bg-white/10 border-white/20 glow-effect"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    protocol.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {getCategoryIcon(protocol.category)}
                </div>
                <div>
                  <h4 className="font-medium text-white">{protocol.name}</h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{protocol.category}</span>
                    <span>•</span>
                    <span>TVL: {protocol.tvl}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">{protocol.apy.toFixed(1)}%</div>
                  <div className="text-xs text-gray-400">APY</div>
                </div>

                <Badge className={getRiskColor(protocol.risk)}>{protocol.risk}</Badge>

                {protocol.isActive ? (
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{protocol.allocation}%</div>
                    <div className="text-xs text-gray-400">Allocated</div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <Card className="p-4 bg-blue-600/10 border border-blue-600/30">
        <h4 className="font-medium text-blue-400 mb-3">Portfolio Performance</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-white">14.2%</div>
            <div className="text-gray-400">Weighted APY</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">4</div>
            <div className="text-gray-400">Active Protocols</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">Medium</div>
            <div className="text-gray-400">Avg Risk</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
