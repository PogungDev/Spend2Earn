"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestTube, Zap, Brain, Shuffle, Play, RotateCcw, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export function TestingTab() {
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])

  const runTest = async (testName: string) => {
    setIsRunning(true)
    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const result = {
      name: testName,
      status: Math.random() > 0.2 ? "success" : "warning",
      timestamp: new Date().toLocaleTimeString(),
      details: `${testName} completed successfully`,
    }

    setTestResults((prev) => [result, ...prev.slice(0, 4)])
    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TestTube className="h-8 w-8 text-orange-500" />
          <div>
            <h2 className="text-3xl font-bold text-white">Testing & Simulation Hub</h2>
            <p className="text-gray-400">Test all features, mock data, and simulate scenarios</p>
          </div>
        </div>
        <Button
          onClick={() => setTestResults([])}
          variant="outline"
          className="text-white/80 border-white/20 hover:bg-white/10 bg-transparent"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Clear Results
        </Button>
      </div>

      <Tabs defaultValue="sdk-testing" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="sdk-testing">SDK Testing</TabsTrigger>
          <TabsTrigger value="ai-simulation">AI Simulation</TabsTrigger>
          <TabsTrigger value="mock-data">Mock Data</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="sdk-testing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">MetaMask DTK</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Test delegation and automation features</p>
              <Button
                onClick={() => runTest("MetaMask DTK Integration")}
                disabled={isRunning}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Test DTK
              </Button>
            </Card>

            <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Shuffle className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">LI.FI SDK</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Test cross-chain routing and bridging</p>
              <Button
                onClick={() => runTest("LI.FI Cross-Chain Routing")}
                disabled={isRunning}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Test LI.FI
              </Button>
            </Card>

            <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Circle Wallets</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Test USDC fast transfers</p>
              <Button
                onClick={() => runTest("Circle USDC Transfer")}
                disabled={isRunning}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Test Circle
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-simulation" className="space-y-6">
          <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">AI Yield Optimizer Simulation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (USDC)</Label>
                  <Input id="amount" placeholder="10000" className="bg-gray-700/50 border-gray-600" />
                </div>
                <div>
                  <Label htmlFor="risk">Risk Tolerance (1-10)</Label>
                  <Input id="risk" placeholder="7" className="bg-gray-700/50 border-gray-600" />
                </div>
                <Button
                  onClick={() => runTest("AI Yield Optimization")}
                  disabled={isRunning}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
                >
                  {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                  Run AI Simulation
                </Button>
              </div>
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <h4 className="font-medium mb-2">Expected Output:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Optimal protocol allocation</li>
                  <li>• Expected APY calculation</li>
                  <li>• Risk assessment</li>
                  <li>• Gas cost optimization</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mock-data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
              <h3 className="font-semibold mb-4">Generate Mock Portfolio</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => runTest("Generate High-Yield Portfolio")}
                  disabled={isRunning}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  High-Yield Portfolio
                </Button>
                <Button
                  onClick={() => runTest("Generate Conservative Portfolio")}
                  disabled={isRunning}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Conservative Portfolio
                </Button>
                <Button
                  onClick={() => runTest("Generate Balanced Portfolio")}
                  disabled={isRunning}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Balanced Portfolio
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
              <h3 className="font-semibold mb-4">Mock Credit Scenarios</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => runTest("Excellent Credit Score")}
                  disabled={isRunning}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Excellent Credit (800+)
                </Button>
                <Button
                  onClick={() => runTest("Good Credit Score")}
                  disabled={isRunning}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Good Credit (700-799)
                </Button>
                <Button
                  onClick={() => runTest("Fair Credit Score")}
                  disabled={isRunning}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  Fair Credit (600-699)
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
            <h3 className="font-semibold mb-4">Market Scenario Testing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => runTest("Bull Market Scenario")}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700"
              >
                🚀 Bull Market
              </Button>
              <Button
                onClick={() => runTest("Bear Market Scenario")}
                disabled={isRunning}
                className="bg-red-600 hover:bg-red-700"
              >
                🐻 Bear Market
              </Button>
              <Button
                onClick={() => runTest("High Volatility Scenario")}
                disabled={isRunning}
                className="bg-orange-600 hover:bg-orange-700"
              >
                ⚡ High Volatility
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
          <h3 className="font-semibold mb-4">Recent Test Results</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  {result.status === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium">{result.name}</p>
                    <p className="text-sm text-gray-400">{result.details}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{result.timestamp}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
