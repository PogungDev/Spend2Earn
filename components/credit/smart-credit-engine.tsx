"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, TrendingUp, Award } from "lucide-react"
import { toast } from "sonner"
import { useJourneyProgress } from "@/hooks/use-journey-progress"

interface CreditTier {
  name: string
  maxAccess: number
  accessPercentage: number
  requirements: string[]
  benefits: string[]
  badgeRequired: boolean
}

export function SmartCreditEngine() {
  const { isStepComplete } = useJourneyProgress()
  const [currentTier, setCurrentTier] = useState(0)
  const [vaultValue] = useState(25000)
  const [creditScore] = useState(725)

  const tiers: CreditTier[] = [
    {
      name: "Starter",
      maxAccess: 7500,
      accessPercentage: 30,
      requirements: ["Connect wallet", "Minimum $1K vault value"],
      benefits: ["Basic credit access", "Manual repayment"],
      badgeRequired: false,
    },
    {
      name: "Advanced",
      maxAccess: 11250,
      accessPercentage: 45,
      requirements: ["Complete GSJ", "Mint YieldPay Pro badge"],
      benefits: ["Increased access", "Auto-repayment", "Priority support"],
      badgeRequired: true,
    },
    {
      name: "Master",
      maxAccess: 15000,
      accessPercentage: 60,
      requirements: ["6 months history", "Excellent credit score"],
      benefits: ["Maximum access", "Premium features", "Cashback vault priority"],
      badgeRequired: true,
    },
  ]

  useEffect(() => {
    const badgeMinted = isStepComplete(5)
    if (badgeMinted && currentTier < 1) {
      setCurrentTier(1)
      toast.success("🎉 Tier upgraded to Advanced! Credit access increased to 45%")
    }
  }, [isStepComplete, currentTier])

  const handleTierUpgrade = () => {
    if (currentTier < tiers.length - 1) {
      setCurrentTier((prev) => prev + 1)
      toast.success(`🚀 Upgraded to ${tiers[currentTier + 1].name} tier!`)
    }
  }

  const currentTierData = tiers[currentTier]
  const nextTierData = tiers[currentTier + 1]

  return (
    <Card className="glass-card p-6 border-purple-500/30 glow-effect">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Smart Credit Engine</h2>
            <p className="text-gray-400 text-sm">Trustless credit with tier-based access</p>
          </div>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">TIER {currentTier + 1}</Badge>
      </div>

      {/* Current Tier Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-purple-400">Current Tier: {currentTierData.name}</h3>
              <Award className="w-5 h-5 text-purple-400" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Max Access:</span>
                <span className="text-white font-bold">${currentTierData.maxAccess.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Access Rate:</span>
                <span className="text-green-400 font-bold">{currentTierData.accessPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vault Value:</span>
                <span className="text-blue-400 font-bold">${vaultValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Access Utilization</span>
                <span className="text-white">25%</span>
              </div>
              <Progress value={25} className="h-2 bg-gray-700" />
            </div>
          </div>

          <div className="p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
            <h4 className="font-medium text-green-400 mb-2">Current Benefits</h4>
            <ul className="space-y-1 text-sm">
              {currentTierData.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Tier Preview */}
        {nextTierData && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-400">Next Tier: {nextTierData.name}</h3>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Access:</span>
                  <span className="text-white font-bold">${nextTierData.maxAccess.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Access Rate:</span>
                  <span className="text-green-400 font-bold">{nextTierData.accessPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Increase:</span>
                  <span className="text-purple-400 font-bold">
                    +${(nextTierData.maxAccess - currentTierData.maxAccess).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-600/10 border border-orange-600/30 rounded-lg">
              <h4 className="font-medium text-orange-400 mb-2">Requirements</h4>
              <ul className="space-y-1 text-sm">
                {nextTierData.requirements.map((req, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-300">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>

              {nextTierData.badgeRequired && !isStepComplete(5) && (
                <Button
                  onClick={() => (window.location.href = "/badge")}
                  className="w-full mt-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Mint Badge to Upgrade
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tier Progression */}
      <div className="p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg">
        <h4 className="font-medium text-white mb-3">Tier Progression</h4>
        <div className="flex items-center space-x-2">
          {tiers.map((tier, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                ${
                  index <= currentTier
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gray-600 text-gray-400"
                }
              `}
              >
                {index + 1}
              </div>
              {index < tiers.length - 1 && (
                <div className={`w-8 h-0.5 ${index < currentTier ? "bg-purple-400" : "bg-gray-600"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs">
          {tiers.map((tier, index) => (
            <span key={index} className={index <= currentTier ? "text-purple-400" : "text-gray-500"}>
              {tier.name}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}
