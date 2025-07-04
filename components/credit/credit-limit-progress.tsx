"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, Zap, ShieldCheck, Percent } from "lucide-react"

interface CreditLimitProgressCardProps {
  totalLimit: number
  usedAmount: number
  vaultValue: number
  accessPercentage: number
  onRequestIncrease: () => void
  badgeTier: "bronze" | "silver" | "gold" // Example badge tiers
}

const badgeCreditLimits = {
  bronze: 0.3,
  silver: 0.5,
  gold: 0.7,
}

const badgeAPR = {
  bronze: 0.1,
  silver: 0.07,
  gold: 0.05,
}

const badgePerks = {
  bronze: "Basic access",
  silver: "Enhanced features",
  gold: "Premium support",
}

export function CreditLimitProgressCard({
  totalLimit,
  usedAmount,
  vaultValue,
  accessPercentage,
  onRequestIncrease,
  badgeTier,
}: CreditLimitProgressCardProps) {
  const availableCredit = totalLimit - usedAmount
  const utilizationRate = totalLimit > 0 ? (usedAmount / totalLimit) * 100 : 0
  const creditLimitPercentage = badgeCreditLimits[badgeTier] || 0.3 // Default to bronze if tier is unknown
  const calculatedCreditLimit = vaultValue * creditLimitPercentage
  const aprRate = badgeAPR[badgeTier] || 0.1
  const healthFactor = availableCredit / totalLimit // Example calculation
  const liquidationThreshold = 0.8 // Example threshold
  const safetyFactor = 0.9 // Example safety factor
  const adjustedCreditLimit = calculatedCreditLimit * safetyFactor

  const getUtilizationColor = (rate: number) => {
    if (rate <= 30) return "text-green-400"
    if (rate <= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getUtilizationStatus = (rate: number) => {
    if (rate <= 30) return { status: "Excellent", color: "bg-green-500/20 text-green-400 border-green-500/30" }
    if (rate <= 60) return { status: "Good", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" }
    return { status: "High", color: "bg-red-500/20 text-red-400 border-red-500/30" }
  }

  const utilizationStatus = getUtilizationStatus(utilizationRate)

  return (
    <Card className="glass-card p-6 border-green-500/30 glow-success">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">Credit Limit</h2>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">DYNAMIC</Badge>
      </div>

      {/* Limit Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-white">${totalLimit.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Limit</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-lg">
          <div className="text-2xl font-bold text-green-400">${availableCredit.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Available</div>
        </div>
      </div>

      {/* Utilization Progress */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Credit Utilization</span>
          <div className="flex items-center space-x-2">
            <span className={`font-bold ${getUtilizationColor(utilizationRate)}`}>{utilizationRate.toFixed(1)}%</span>
            <Badge className={utilizationStatus.color}>{utilizationStatus.status}</Badge>
          </div>
        </div>
        <Progress value={utilizationRate} className="h-4 bg-gray-700" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>$0</span>
          <span className="text-yellow-400">30% (Optimal)</span>
          <span className="text-red-400">60% (High)</span>
          <span>${totalLimit.toLocaleString()}</span>
        </div>
      </div>

      {/* Limit Breakdown */}
      <div className="space-y-3 mb-6">
        <h3 className="font-medium text-white">Limit Composition</h3>

        <div className="p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-400 font-medium">Vault-Backed Credit</span>
            <span className="text-blue-400 font-bold">${(totalLimit * 0.8).toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-400">
            {accessPercentage}% of ${vaultValue.toLocaleString()} vault value
          </div>
        </div>

        <div className="p-3 bg-purple-600/10 border border-purple-600/30 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-400 font-medium">Activity-Based Credit</span>
            <span className="text-purple-400 font-bold">${(totalLimit * 0.2).toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-400">Based on usage history and performance</div>
        </div>
      </div>

      {/* Current Usage */}
      <div className="p-4 bg-orange-600/10 border border-orange-600/30 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-orange-400 mb-1">Current Usage</h4>
            <div className="text-sm text-gray-400">Active credit utilization</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">${usedAmount.toLocaleString()}</div>
            <div className="text-sm text-orange-400">of ${totalLimit.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Health Factor */}
      <div className="p-4 bg-teal-600/10 border border-teal-600/30 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-teal-400 mb-1">Health Factor</h4>
            <div className="text-sm text-gray-400">Credit health indicator</div>
          </div>
          <div className="text-right">
            <div
              className={`text-xl font-bold text-white ${healthFactor < liquidationThreshold ? "text-red-400" : ""}`}
            >
              {healthFactor.toFixed(2)}
            </div>
            <div className="text-sm text-teal-400">
              {healthFactor < liquidationThreshold ? "Approaching Liquidation" : "Healthy"}
            </div>
          </div>
        </div>
        {healthFactor < liquidationThreshold && (
          <div className="mt-2 text-xs text-red-400">Warning: Your credit is at risk of liquidation.</div>
        )}
      </div>

      {/* APR Rate */}
      <div className="p-4 bg-pink-600/10 border border-pink-600/30 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-pink-400 mb-1">APR Rate</h4>
            <div className="text-sm text-gray-400">Annual Percentage Rate</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">{(aprRate * 100).toFixed(2)}%</div>
            <div className="text-sm text-pink-400">Based on {badgeTier} tier</div>
          </div>
        </div>
      </div>

      {/* Trustless Credit Line Benefits */}
      <div className="p-4 bg-indigo-600/10 border border-indigo-600/30 rounded-lg mb-6">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <div>
            <h4 className="font-medium text-indigo-400 mb-1">Trustless Credit Line</h4>
            <p className="text-xs text-gray-300">Borrow without intermediaries, leveraging your vault as collateral.</p>
          </div>
        </div>
      </div>

      {/* Badge-Specific Features and Perks */}
      <div className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg mb-6">
        <div className="flex items-center space-x-2">
          <Percent className="w-5 h-5 text-yellow-400" />
          <div>
            <h4 className="font-medium text-yellow-400 mb-1">{badgeTier.toUpperCase()} Tier Perks</h4>
            <p className="text-xs text-gray-300">
              Enjoy {badgePerks[badgeTier]}, higher credit limits, and lower APR rates.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={onRequestIncrease}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Request Limit Increase
        </Button>

        <div className="text-center">
          <div className="text-xs text-gray-500">Limit updates automatically based on vault performance</div>
        </div>
      </div>

      {/* Improvement Tip */}
      <div className="mt-4 p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <Zap className="w-4 h-4 text-green-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-400 mb-1">💡 Limit Optimization</h4>
            <p className="text-xs text-gray-300">
              Increase vault value by $5,000 to unlock an additional $2,000 credit limit automatically.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
