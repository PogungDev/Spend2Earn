"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Zap, TrendingUp, Settings, Target, Award, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface SpendingData {
  amount: number
  merchant: string
  category: string
  timestamp: Date
  stakeTriggered: boolean
  stakeAmount: number
  protocol: string
  badgeTier?: number
  microStakeEnabled?: boolean
}

export function AutoStakeTrigger() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [threshold, setThreshold] = useState(50)
  const [stakePercentage, setStakePercentage] = useState(10)
  const [recentSpends, setRecentSpends] = useState<SpendingData[]>([])
  const [totalStaked, setTotalStaked] = useState(0)
  const [badgeTier, setBadgeTier] = useState(2)
  const [microStakeEnabled, setMicroStakeEnabled] = useState(false)

  useEffect(() => {
    // Load badge status
    const savedTier = localStorage.getItem("yieldpay-badge-tier")
    if (savedTier) {
      const tier = Number.parseInt(savedTier)
      setBadgeTier(tier)
      setMicroStakeEnabled(tier >= 3)

      // Enhanced staking for higher tiers
      if (tier >= 2) {
        setStakePercentage(15) // Silver+ gets 15% auto-stake
      }
      if (tier >= 3) {
        setThreshold(1) // Gold+ stakes on every dollar
      }
    }
  }, [])

  useEffect(() => {
    if (!isEnabled) return

    const interval = setInterval(() => {
      const merchants = ["Starbucks", "Amazon", "Uber", "Target", "Netflix", "McDonald's", "Spotify"]
      const categories = ["Food", "Shopping", "Transport", "Retail", "Entertainment", "Streaming"]
      const amount = Math.floor(Math.random() * 200) + 10

      const newSpend: SpendingData = {
        amount,
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        timestamp: new Date(),
        stakeTriggered: amount >= threshold,
        stakeAmount: amount >= threshold ? (amount * stakePercentage) / 100 : 0,
        protocol: amount >= threshold ? "Enhanced Vault" : "",
        badgeTier,
        microStakeEnabled,
      }

      setRecentSpends((prev) => [newSpend, ...prev.slice(0, 4)])

      if (newSpend.stakeTriggered) {
        setTotalStaked((prev) => prev + newSpend.stakeAmount)

        if (microStakeEnabled && badgeTier >= 3) {
          toast.success(
            `💳 Spend: $${amount} → Micro-stake: $${newSpend.stakeAmount.toFixed(2)} (Gold Master benefit)`,
            { duration: 4000 },
          )
        } else {
          toast.success(
            `💳 Spend: $${amount} → Auto-staked $${newSpend.stakeAmount.toFixed(2)} to ${newSpend.protocol}`,
            { duration: 4000 },
          )
        }
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [isEnabled, threshold, stakePercentage, badgeTier, microStakeEnabled])

  const getBadgeName = (tier: number) => {
    switch (tier) {
      case 1:
        return "Bronze Master"
      case 2:
        return "Silver Master"
      case 3:
        return "Gold Master"
      default:
        return "Elite SBT"
    }
  }

  const getBadgeColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case 2:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case 3:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
  }

  return (
    <Card className="glass-card p-6 border-green-500/30 glow-success">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Badge-Enhanced Auto-Stake</h2>
            <p className="text-gray-400 text-sm">Card spending triggers enhanced staking based on badge tier</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getBadgeColor(badgeTier)}>
            {badgeTier >= 3 ? <Sparkles className="w-3 h-3 mr-1" /> : <Award className="w-3 h-3 mr-1" />}
            {getBadgeName(badgeTier)}
          </Badge>
          <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
        </div>
      </div>

      {/* Badge Benefits */}
      <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
        <h3 className="font-medium text-blue-400 mb-3">🏆 Badge Tier Benefits Active</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{stakePercentage}%</div>
            <div className="text-xs text-gray-400">Auto-Stake Rate</div>
            {badgeTier >= 2 && <div className="text-xs text-green-400">+5% bonus</div>}
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">${threshold}</div>
            <div className="text-xs text-gray-400">Trigger Threshold</div>
            {badgeTier >= 3 && <div className="text-xs text-yellow-400">Every $1</div>}
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{microStakeEnabled ? "Micro" : "Standard"}</div>
            <div className="text-xs text-gray-400">Stake Mode</div>
            {microStakeEnabled && <div className="text-xs text-yellow-400">Gold exclusive</div>}
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-blue-600/10 border border-blue-600/30">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">Enhanced Threshold</span>
          </div>
          <div className="text-xl font-bold text-white">${threshold}</div>
          <p className="text-xs text-gray-400">
            {badgeTier >= 3 ? "Gold Master: Every $1" : "Minimum spend to trigger"}
          </p>
        </Card>

        <Card className="p-4 bg-purple-600/10 border border-purple-600/30">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400">Stake Percentage</span>
          </div>
          <div className="text-xl font-bold text-white">{stakePercentage}%</div>
          <p className="text-xs text-gray-400">{badgeTier >= 2 ? "Enhanced rate (+5%)" : "Of spending amount"}</p>
        </Card>

        <Card className="p-4 bg-green-600/10 border border-green-600/30">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Total Auto-Staked</span>
          </div>
          <div className="text-xl font-bold text-white">${totalStaked.toFixed(2)}</div>
          <p className="text-xs text-gray-400">This session</p>
        </Card>
      </div>

      {/* Micro-Stake Feature (Gold Master only) */}
      {badgeTier >= 3 && (
        <div className="mb-6 p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-yellow-400" />
              <span className="font-medium text-yellow-400">Micro-Stake Mode</span>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">GOLD EXCLUSIVE</Badge>
            </div>
            <Switch checked={microStakeEnabled} onCheckedChange={setMicroStakeEnabled} />
          </div>
          <p className="text-sm text-yellow-300">
            🌟 Every $1 of cashback is individually staked for maximum compound growth
          </p>
          {microStakeEnabled && (
            <div className="mt-2 p-2 bg-yellow-600/20 border border-yellow-600/40 rounded">
              <p className="text-xs text-yellow-200">
                ✅ Active: Each dollar will be staked separately to optimize compounding returns
              </p>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Recent Enhanced Card Activity</h3>

        {recentSpends.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Waiting for card activity...</p>
            <p className="text-sm">Enhanced auto-stake will trigger on spends ≥ ${threshold}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSpends.map((spend, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        spend.stakeTriggered ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{spend.merchant}</h4>
                      <p className="text-xs text-gray-400">{spend.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">${spend.amount}</div>
                    <div className="text-xs text-gray-400">{spend.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>

                {spend.stakeTriggered && (
                  <div className="mt-3 p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {spend.microStakeEnabled ? (
                          <Target className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <Zap className="w-4 h-4 text-green-400" />
                        )}
                        <span className="text-sm text-green-400">
                          {spend.microStakeEnabled ? "Micro-Stake Triggered" : "Enhanced Auto-Stake Triggered"}
                        </span>
                        {spend.badgeTier && spend.badgeTier >= 2 && (
                          <Badge className={getBadgeColor(spend.badgeTier)}>
                            +{spend.badgeTier >= 2 ? "5%" : "0%"} bonus
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">${spend.stakeAmount.toFixed(2)}</div>
                        <div className="text-xs text-gray-400">→ {spend.protocol}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badge Upgrade Hint */}
      {badgeTier < 3 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="font-medium text-yellow-400">Upgrade to Gold Master</span>
            </div>
            <p className="text-sm text-yellow-300">
              Unlock micro-staking on every $1 and maximum compound growth potential
            </p>
            <Button
              onClick={() => (window.location.href = "/badge")}
              size="sm"
              className="mt-2 bg-yellow-600 hover:bg-yellow-700"
            >
              View Badge Upgrade
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
