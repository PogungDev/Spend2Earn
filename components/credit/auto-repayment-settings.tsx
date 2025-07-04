"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Clock, DollarSign } from "lucide-react"
import { toast } from "sonner"

export function AutoRepaymentSettings() {
  const [isAutoRepayEnabled, setIsAutoRepayEnabled] = useState(true)
  const [repaymentTrigger, setRepaymentTrigger] = useState("utilization")
  const [triggerThreshold, setTriggerThreshold] = useState("50")
  const [repaymentSource, setRepaymentSource] = useState("yield")
  const [repaymentAmount, setRepaymentAmount] = useState("minimum")

  const handleSaveSettings = () => {
    toast.success("Auto-repayment settings saved successfully!")
  }

  const handleTestRepayment = () => {
    toast.info("Testing auto-repayment trigger...")
    setTimeout(() => {
      toast.success("Auto-repayment test completed successfully!")
    }, 2000)
  }

  return (
    <Card className="glass-card p-6 border-purple-500/30 glow-effect">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Auto-Repayment</h2>
        </div>
        <Badge
          className={
            isAutoRepayEnabled
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
          }
        >
          {isAutoRepayEnabled ? "ACTIVE" : "INACTIVE"}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <Label className="text-white font-medium">Enable Auto-Repayment</Label>
              <div className="text-sm text-gray-400">Automatically repay credit using vault yield</div>
            </div>
          </div>
          <Switch checked={isAutoRepayEnabled} onCheckedChange={setIsAutoRepayEnabled} />
        </div>

        {isAutoRepayEnabled && (
          <>
            {/* Repayment Trigger */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Repayment Trigger</Label>
              <Select value={repaymentTrigger} onValueChange={setRepaymentTrigger}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="utilization">Credit Utilization Threshold</SelectItem>
                  <SelectItem value="time">Time-Based (Monthly)</SelectItem>
                  <SelectItem value="yield">Yield Accumulation</SelectItem>
                  <SelectItem value="balance">Minimum Balance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trigger Threshold */}
            <div className="space-y-3">
              <Label className="text-white font-medium">
                {repaymentTrigger === "utilization"
                  ? "Utilization Threshold"
                  : repaymentTrigger === "yield"
                    ? "Yield Threshold"
                    : repaymentTrigger === "balance"
                      ? "Balance Threshold"
                      : "Frequency"}
              </Label>
              <Select value={triggerThreshold} onValueChange={setTriggerThreshold}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {repaymentTrigger === "utilization" && (
                    <>
                      <SelectItem value="30">30% Utilization</SelectItem>
                      <SelectItem value="50">50% Utilization</SelectItem>
                      <SelectItem value="70">70% Utilization</SelectItem>
                    </>
                  )}
                  {repaymentTrigger === "time" && (
                    <>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </>
                  )}
                  {repaymentTrigger === "yield" && (
                    <>
                      <SelectItem value="100">$100 Yield</SelectItem>
                      <SelectItem value="250">$250 Yield</SelectItem>
                      <SelectItem value="500">$500 Yield</SelectItem>
                    </>
                  )}
                  {repaymentTrigger === "balance" && (
                    <>
                      <SelectItem value="1000">$1,000 Balance</SelectItem>
                      <SelectItem value="2500">$2,500 Balance</SelectItem>
                      <SelectItem value="5000">$5,000 Balance</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Repayment Source */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Repayment Source</Label>
              <Select value={repaymentSource} onValueChange={setRepaymentSource}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="yield">Vault Yield Only</SelectItem>
                  <SelectItem value="vault">Vault Principal</SelectItem>
                  <SelectItem value="external">External Wallet</SelectItem>
                  <SelectItem value="hybrid">Yield + Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Repayment Amount */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Repayment Amount</Label>
              <Select value={repaymentAmount} onValueChange={setRepaymentAmount}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="minimum">Minimum Payment</SelectItem>
                  <SelectItem value="full">Full Balance</SelectItem>
                  <SelectItem value="percentage">50% of Balance</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Settings Summary */}
            <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
              <h4 className="font-medium text-blue-400 mb-3">Current Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Trigger:</span>
                  <span className="text-white">
                    {repaymentTrigger === "utilization"
                      ? `${triggerThreshold}% Credit Utilization`
                      : repaymentTrigger === "time"
                        ? `${triggerThreshold} Schedule`
                        : repaymentTrigger === "yield"
                          ? `$${triggerThreshold} Yield Accumulated`
                          : `$${triggerThreshold} Balance Threshold`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Source:</span>
                  <span className="text-white">
                    {repaymentSource === "yield"
                      ? "Vault Yield"
                      : repaymentSource === "vault"
                        ? "Vault Principal"
                        : repaymentSource === "external"
                          ? "External Wallet"
                          : "Yield + Principal"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">
                    {repaymentAmount === "minimum"
                      ? "Minimum Payment"
                      : repaymentAmount === "full"
                        ? "Full Balance"
                        : repaymentAmount === "percentage"
                          ? "50% of Balance"
                          : "Fixed Amount"}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Repayment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Next Repayment</span>
                </div>
                <div className="text-white font-bold">Jan 15, 2025</div>
                <div className="text-xs text-gray-400">Estimated date</div>
              </div>

              <div className="p-3 bg-purple-600/10 border border-purple-600/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">Est. Amount</span>
                </div>
                <div className="text-white font-bold">$1,250</div>
                <div className="text-xs text-gray-400">Based on current settings</div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleSaveSettings}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Save Settings
          </Button>
          {isAutoRepayEnabled && (
            <Button
              onClick={handleTestRepayment}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Test
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
