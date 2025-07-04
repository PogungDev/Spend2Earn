"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, CheckCircle } from "lucide-react"

export function CardSpendingTrigger() {
  const [spendAmount, setSpendAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [triggerResult, setTriggerResult] = useState<any>(null)

  const simulateCardSpending = async () => {
    setIsProcessing(true)

    // Simulate card spending trigger mechanism
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const amount = Number.parseFloat(spendAmount)
    const currentUtilization = 25 // Current 25% utilization
    const utilizationIncrease = (amount / 10000) * 100 // Impact on utilization
    const newUtilization = currentUtilization + utilizationIncrease

    // Calculate capacity adjustment based on spending pattern
    const capacityAdjustment = amount > 200 ? Math.floor(amount * 1.5) : 0
    const newCapacity = 10000 + capacityAdjustment

    // Calculate usage fee from yield
    const usageFee = amount * 0.03 // 3% usage fee
    const yieldCoverage = 156.3 // Current weekly yield

    const result = {
      spentAmount: amount,
      merchant: "Demo Store",
      utilizationBefore: currentUtilization,
      utilizationAfter: Math.min(100, newUtilization),
      capacityBefore: 10000,
      capacityAfter: newCapacity,
      usageFee: usageFee.toFixed(2),
      yieldCoverage: yieldCoverage.toFixed(2),
      feeCoveredByYield: usageFee <= yieldCoverage,
      reallocationTriggered: amount > 150,
      reallocationDetails:
        amount > 150
          ? {
              fromProtocol: "Aave USDC (Low utilization)",
              toProtocol: "Curve Finance (Higher yield)",
              amount: Math.floor(amount * 2),
              reason: "Balance optimization due to increased usage",
            }
          : null,
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
    }

    setTriggerResult(result)
    setIsProcessing(false)
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Card Spending Trigger System</h3>
          <p className="text-gray-300 text-sm">
            Simulate how card spending triggers limit adjustments and fund reallocation
          </p>
        </div>
        <div className="px-3 py-1 bg-orange-500/20 rounded-full">
          <span className="text-xs text-orange-400 font-medium">USAGE METERING</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-300">Card Spending Amount ($)</Label>
          <div className="flex space-x-2 mt-2">
            <Input
              type="number"
              value={spendAmount}
              onChange={(e) => setSpendAmount(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="250"
            />
            <Button
              onClick={simulateCardSpending}
              disabled={isProcessing || !spendAmount}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-6"
            >
              {isProcessing ? "Processing..." : "Simulate Spending"}
            </Button>
          </div>
        </div>

        <div className="p-3 bg-orange-600/10 border border-orange-600/30 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-300">Current Utilization:</span>
              <p className="text-orange-400 font-semibold">25%</p>
            </div>
            <div>
              <span className="text-gray-300">Current Capacity:</span>
              <p className="text-blue-400 font-semibold">$10,000</p>
            </div>
            <div>
              <span className="text-gray-300">Weekly Yield:</span>
              <p className="text-green-400 font-semibold">$156.30</p>
            </div>
            <div>
              <span className="text-gray-300">Usage Fee Rate:</span>
              <p className="text-purple-400 font-semibold">3% of spending</p>
            </div>
          </div>
        </div>

        {triggerResult && (
          <div className="space-y-4">
            <div className="p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h4 className="font-medium text-green-400">💳 Card Spending Processed!</h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Spent at {triggerResult.merchant}:</span>
                  <span className="text-white font-bold">${triggerResult.spentAmount}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-300">Utilization:</span>
                    <p className="text-orange-400">
                      {triggerResult.utilizationBefore}% → {triggerResult.utilizationAfter.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-300">Capacity:</span>
                    <p className="text-blue-400">
                      ${triggerResult.capacityBefore.toLocaleString()} → ${triggerResult.capacityAfter.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Usage Fee:</span>
                  <span className={triggerResult.feeCoveredByYield ? "text-green-400" : "text-red-400"}>
                    ${triggerResult.usageFee}{" "}
                    {triggerResult.feeCoveredByYield ? "(Covered by yield)" : "(Insufficient yield)"}
                  </span>
                </div>

                {triggerResult.reallocationTriggered && triggerResult.reallocationDetails && (
                  <div className="p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-400">Auto-Reallocation Triggered</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-300">From:</span>
                        <span className="text-gray-400">{triggerResult.reallocationDetails.fromProtocol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">To:</span>
                        <span className="text-blue-400">{triggerResult.reallocationDetails.toProtocol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Amount:</span>
                        <span className="text-green-400">${triggerResult.reallocationDetails.amount}</span>
                      </div>
                      <p className="text-gray-400 mt-2">{triggerResult.reallocationDetails.reason}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-300">Transaction:</span>
                  <span className="text-gray-400 font-mono text-xs">{triggerResult.txHash}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-purple-600/20 rounded-lg">
              <p className="text-xs text-purple-300">
                🎯 Your card spending automatically adjusts usage capacity and triggers fund reallocation when needed.
                All usage fees are covered by your active yield strategies.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
