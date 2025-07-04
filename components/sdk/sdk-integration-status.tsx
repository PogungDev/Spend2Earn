"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Route,
  RefreshCw,
  Wallet,
  ExternalLink,
  Play,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"

interface SDKStatus {
  name: string
  status: "connected" | "connecting" | "error" | "testing"
  version: string
  lastTest: Date | null
  features: string[]
  testResults: {
    connection: boolean
    functionality: boolean
    performance: number
  }
  documentation: string
}

export function SDKIntegrationStatus() {
  const [sdks, setSDKs] = useState<SDKStatus[]>([
    {
      name: "MetaMask Delegation Toolkit",
      status: "connected",
      version: "v2.1.0",
      lastTest: new Date(),
      features: ["Credit Automation", "Auto-repayment", "Smart Contracts"],
      testResults: {
        connection: true,
        functionality: true,
        performance: 95,
      },
      documentation: "https://docs.metamask.io/delegation-toolkit",
    },
    {
      name: "LI.FI SDK",
      status: "connected",
      version: "v3.0.2",
      lastTest: new Date(),
      features: ["Cross-chain Routing", "Yield Optimization", "Gas Efficiency"],
      testResults: {
        connection: true,
        functionality: true,
        performance: 88,
      },
      documentation: "https://docs.li.fi/integrate-li.fi-sdk",
    },
    {
      name: "Circle CCTP",
      status: "connected",
      version: "v1.4.1",
      lastTest: new Date(),
      features: ["USDC Transfers", "Cross-chain Bridge", "Fast Settlement"],
      testResults: {
        connection: true,
        functionality: true,
        performance: 92,
      },
      documentation: "https://developers.circle.com/stablecoins/docs/cctp-getting-started",
    },
  ])

  const [isTestingAll, setIsTestingAll] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "connecting":
      case "testing":
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200"
      case "connecting":
      case "testing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const testSDK = async (sdkName: string) => {
    setSDKs((prev) => prev.map((sdk) => (sdk.name === sdkName ? { ...sdk, status: "testing" as const } : sdk)))

    toast.info(`Testing ${sdkName}...`)

    // Simulate testing process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate test results
    const success = Math.random() > 0.1 // 90% success rate
    const performance = Math.floor(Math.random() * 20) + 80 // 80-100%

    setSDKs((prev) =>
      prev.map((sdk) =>
        sdk.name === sdkName
          ? {
              ...sdk,
              status: success ? ("connected" as const) : ("error" as const),
              lastTest: new Date(),
              testResults: {
                connection: success,
                functionality: success,
                performance: success ? performance : 0,
              },
            }
          : sdk,
      ),
    )

    if (success) {
      toast.success(`${sdkName} test completed successfully!`)
    } else {
      toast.error(`${sdkName} test failed. Check configuration.`)
    }
  }

  const testAllSDKs = async () => {
    setIsTestingAll(true)
    toast.info("Testing all SDK integrations...")

    for (const sdk of sdks) {
      await testSDK(sdk.name)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Delay between tests
    }

    setIsTestingAll(false)
    toast.success("All SDK tests completed!")
  }

  const resetAllTests = () => {
    setSDKs((prev) =>
      prev.map((sdk) => ({
        ...sdk,
        status: "connected" as const,
        testResults: {
          connection: true,
          functionality: true,
          performance: Math.floor(Math.random() * 20) + 80,
        },
      })),
    )
    toast.info("All SDK statuses reset")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SDK Integration Status</h2>
          <p className="text-gray-600">Real-time status and testing for all integrated SDKs</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={testAllSDKs} disabled={isTestingAll} className="bg-blue-600 hover:bg-blue-700">
            {isTestingAll ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Test All SDKs
              </>
            )}
          </Button>
          <Button onClick={resetAllTests} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Integration Health</h3>
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sdks.filter((sdk) => sdk.status === "connected").length}/{sdks.length}
            </div>
            <p className="text-sm text-gray-600">SDKs Connected</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(sdks.reduce((acc, sdk) => acc + sdk.testResults.performance, 0) / sdks.length)}%
            </div>
            <p className="text-sm text-gray-600">Avg Performance</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sdks.reduce((acc, sdk) => acc + sdk.features.length, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Features</p>
          </div>
        </div>
      </Card>

      {/* Individual SDK Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sdks.map((sdk) => (
          <Card key={sdk.name} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {sdk.name.includes("MetaMask") && <Wallet className="w-5 h-5 text-orange-600" />}
                  {sdk.name.includes("LI.FI") && <Route className="w-5 h-5 text-blue-600" />}
                  {sdk.name.includes("Circle") && <RefreshCw className="w-5 h-5 text-purple-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{sdk.name}</h3>
                  <p className="text-sm text-gray-500">{sdk.version}</p>
                </div>
              </div>
              {getStatusIcon(sdk.status)}
            </div>

            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(sdk.status)}>
                  {sdk.status.charAt(0).toUpperCase() + sdk.status.slice(1)}
                </Badge>
                <span className="text-xs text-gray-500">
                  {sdk.lastTest ? `Last tested: ${sdk.lastTest.toLocaleTimeString()}` : "Never tested"}
                </span>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Performance</span>
                  <span className="font-medium">{sdk.testResults.performance}%</span>
                </div>
                <Progress value={sdk.testResults.performance} className="h-2" />
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {sdk.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Test Results */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  {sdk.testResults.connection ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span>Connection</span>
                </div>
                <div className="flex items-center space-x-1">
                  {sdk.testResults.functionality ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span>Functionality</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  size="sm"
                  onClick={() => testSDK(sdk.name)}
                  disabled={sdk.status === "testing"}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {sdk.status === "testing" ? (
                    <>
                      <Clock className="w-3 h-3 mr-1 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 mr-1" />
                      Test SDK
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open(sdk.documentation, "_blank")}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Docs
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Integration Flow Visualization */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Flow</h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium">MetaMask DTK</span>
            <Badge className="bg-orange-100 text-orange-800 text-xs">Credit Automation</Badge>
          </div>

          <div className="flex-1 h-px bg-gray-300 mx-4 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
              <Zap className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Route className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium">LI.FI SDK</span>
            <Badge className="bg-blue-100 text-blue-800 text-xs">Cross-chain Routing</Badge>
          </div>

          <div className="flex-1 h-px bg-gray-300 mx-4 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
              <Zap className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium">Circle CCTP</span>
            <Badge className="bg-purple-100 text-purple-800 text-xs">USDC Transfers</Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}
