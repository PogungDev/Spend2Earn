"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator, Play, RotateCcw } from "lucide-react"

export function RepaymentSimulator() {
  const [amount, setAmount] = useState("1000")
  const [yieldRate, setYieldRate] = useState([15])
  const [timeframe, setTimeframe] = useState([12])
  const [results, setResults] = useState<any>(null)

  const runSimulation = () => {
    const principal = Number.parseFloat(amount)
    const monthlyYield = (principal * yieldRate[0]) / 100 / 12
    const totalYield = monthlyYield * timeframe[0]
    const repaymentCoverage = Math.min((totalYield / principal) * 100, 100)

    setResults({
      monthlyYield: monthlyYield.toFixed(2),
      totalYield: totalYield.toFixed(2),
      repaymentCoverage: repaymentCoverage.toFixed(1),
      remainingBalance: Math.max(principal - totalYield, 0).toFixed(2),
    })
  }

  const resetSimulation = () => {
    setAmount("1000")
    setYieldRate([15])
    setTimeframe([12])
    setResults(null)
  }

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Repayment Simulator</h3>
      </div>

      <div className="space-y-6">
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount" className="text-gray-300">
              Credit Amount (USDC)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="1000"
            />
          </div>
          <div>
            <Label className="text-gray-300">Expected Yield APY ({yieldRate[0]}%)</Label>
            <Slider value={yieldRate} onValueChange={setYieldRate} max={50} min={1} step={1} className="mt-2" />
          </div>
        </div>

        <div>
          <Label className="text-gray-300">Timeframe ({timeframe[0]} months)</Label>
          <Slider value={timeframe} onValueChange={setTimeframe} max={36} min={1} step={1} className="mt-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button onClick={runSimulation} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Play className="w-4 h-4 mr-2" />
            Run Simulation
          </Button>
          <Button onClick={resetSimulation} variant="outline" className="text-white border-gray-600 bg-transparent">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <h4 className="font-medium text-blue-400 mb-3">Simulation Results</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Monthly Yield</p>
                <p className="text-xl font-bold text-green-400">${results.monthlyYield}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Yield</p>
                <p className="text-xl font-bold text-green-400">${results.totalYield}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Coverage</p>
                <p className="text-xl font-bold text-blue-400">{results.repaymentCoverage}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Remaining</p>
                <p className="text-xl font-bold text-orange-400">${results.remainingBalance}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
