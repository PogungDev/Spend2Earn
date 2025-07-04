"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Zap } from "lucide-react"

interface VaultData {
  protocol: string
  apy: number
  tvl: number
  allocation: number
  yield24h: number
  status: "active" | "optimizing" | "rebalancing"
}

export function VaultYieldTracker() {
  const [vaults, setVaults] = useState<VaultData[]>([
    { protocol: "Aave USDC", apy: 4.2, tvl: 8500, allocation: 35, yield24h: 9.8, status: "active" },
    { protocol: "Uniswap V3 ETH/USDC", apy: 12.8, tvl: 6200, allocation: 25, yield24h: 21.7, status: "optimizing" },
    { protocol: "Curve 3Pool", apy: 6.5, tvl: 5800, allocation: 23, yield24h: 10.3, status: "active" },
    { protocol: "Pendle PT-stETH", apy: 15.2, tvl: 4200, allocation: 17, yield24h: 17.5, status: "rebalancing" },
  ])

  const [totalYield, setTotalYield] = useState(59.3)
  const [avgAPY, setAvgAPY] = useState(9.7)

  useEffect(() => {
    const interval = setInterval(() => {
      setVaults((prev) =>
        prev.map((vault) => ({
          ...vault,
          apy: vault.apy + (Math.random() - 0.5) * 0.2,
          yield24h: vault.yield24h + (Math.random() - 0.5) * 2,
        })),
      )

      setTotalYield((prev) => prev + (Math.random() - 0.5) * 5)
      setAvgAPY((prev) => prev + (Math.random() - 0.5) * 0.3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const statusColors = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    optimizing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    rebalancing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">24h Yield</span>
          </div>
          <div className="text-xl font-bold text-white">${totalYield.toFixed(2)}</div>
          <div className="text-xs text-green-400">+12.3% from yesterday</div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Avg APY</span>
          </div>
          <div className="text-xl font-bold text-white">{avgAPY.toFixed(1)}%</div>
          <div className="text-xs text-blue-400">Optimized across 4 protocols</div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Auto-Compound</span>
          </div>
          <div className="text-xl font-bold text-white">Active</div>
          <div className="text-xs text-purple-400">Next compound in 2h</div>
        </Card>
      </div>

      {/* Vault Details */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Vault Performance</h3>
        <div className="space-y-4">
          {vaults.map((vault, index) => (
            <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{vault.protocol.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{vault.protocol}</h4>
                    <p className="text-xs text-gray-400">TVL: ${vault.tvl.toLocaleString()}</p>
                  </div>
                </div>
                <Badge className={statusColors[vault.status]}>{vault.status.toUpperCase()}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <span className="text-xs text-gray-400">APY</span>
                  <div className="text-sm font-bold text-green-400">{vault.apy.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">24h Yield</span>
                  <div className="text-sm font-bold text-blue-400">${vault.yield24h.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Allocation</span>
                  <div className="text-sm font-bold text-white">{vault.allocation}%</div>
                </div>
              </div>

              <Progress value={vault.allocation} className="h-2 bg-gray-700" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
