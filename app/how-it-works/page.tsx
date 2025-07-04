"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CreditCard,
  Wallet,
  Shield,
  Trophy,
  Zap,
  CheckCircle,
  DollarSign,
  Coins,
  TrendingUp,
  Route,
  RefreshCw,
  Lock,
  Star,
  BarChart3,
  Home,
  BookOpen,
  Play,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [demoStep, setDemoStep] = useState(0)

  const startDemo = (demoType: string) => {
    setActiveDemo(demoType)
    setDemoStep(0)
  }

  const nextStep = () => {
    setDemoStep((prev) => prev + 1)
  }

  const resetDemo = () => {
    setActiveDemo(null)
    setDemoStep(0)
  }

  const spendingSteps = [
    {
      title: "Card Purchase",
      description: "User makes a purchase with their connected card",
      icon: <CreditCard className="w-6 h-6 text-orange-500" />,
      details: "Every purchase triggers the automated DeFi flow",
    },
    {
      title: "Cashback Calculation",
      description: "2.5% cashback is automatically calculated",
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      details: "Higher badge tiers unlock better cashback rates",
    },
    {
      title: "LI.FI Routing",
      description: "Optimal cross-chain route is found for highest yield",
      icon: <Route className="w-6 h-6 text-blue-500" />,
      details: "Automatically routes to chains with best APY",
    },
    {
      title: "Circle CCTP Transfer",
      description: "Cashback is transferred cross-chain via Circle CCTP",
      icon: <RefreshCw className="w-6 h-6 text-purple-500" />,
      details: "Fast, secure cross-chain USDC transfers",
    },
    {
      title: "Auto-Stake to Vault",
      description: "Cashback is automatically staked to earn yield",
      icon: <Coins className="w-6 h-6 text-indigo-500" />,
      details: "Funds start earning yield immediately",
    },
    {
      title: "Points & Progress",
      description: "Earn points toward badge progression",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      details: "1 point per $1 spent, unlock better features",
    },
  ]

  const creditSteps = [
    {
      title: "Vault Collateral",
      description: "Your vault balance serves as collateral",
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      details: "No credit checks needed - vault-backed lending",
    },
    {
      title: "MetaMask DTK",
      description: "Delegation toolkit enables automated credit management",
      icon: <Wallet className="w-6 h-6 text-orange-500" />,
      details: "Smart contract automation for repayments",
    },
    {
      title: "Instant Approval",
      description: "Borrow up to your badge tier percentage instantly",
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      details: "30% → 50% → 70% credit limits by badge tier",
    },
    {
      title: "Yield-Powered Repayment",
      description: "Vault yield can automatically repay loans",
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      details: "Set up auto-repayment from earned yield",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">Spend2Earn</h1>
                  <p className="text-xs md:text-sm text-gray-600">How It Works</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Back to App</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How Spend2Earn Works</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform every card purchase into automated DeFi yield generation with trustless credit lines and
            progressive badge unlocks
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-orange-100 text-orange-800 px-4 py-2 text-sm">No Balance Limits</Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">Automated DeFi</Badge>
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">Trustless Credit</Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">Progressive Unlocks</Badge>
          </div>
        </div>

        {/* Interactive Demos */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 h-auto p-1 shadow-sm rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="spending" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Spending Flow
            </TabsTrigger>
            <TabsTrigger value="credit" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Credit System
            </TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              Badge System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Unlimited Spending</h3>
                <p className="text-sm text-gray-600">
                  Spend any amount with your card. No balance limits, no restrictions.
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Auto-Staked Cashback</h3>
                <p className="text-sm text-gray-600">
                  2.5% cashback automatically staked to earn yield in DeFi protocols.
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Trustless Credit</h3>
                <p className="text-sm text-gray-600">
                  Borrow against your vault balance with no credit checks or approvals.
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Badge Progression</h3>
                <p className="text-sm text-gray-600">
                  Earn points to unlock higher badge tiers with better rates and features.
                </p>
              </Card>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">The Complete Flow</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Spend</h3>
                  <p className="text-gray-600">
                    Make purchases with your connected card. Every dollar spent earns points.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Earn & Stake</h3>
                  <p className="text-gray-600">
                    Cashback is automatically routed to highest-yield DeFi protocols via LI.FI and Circle CCTP.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Unlock & Borrow</h3>
                  <p className="text-gray-600">
                    Progress through badge tiers to unlock higher credit limits and borrow against your vault.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Spending Flow Tab */}
          <TabsContent value="spending" className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Interactive Spending Demo</h2>
                <div className="flex items-center space-x-2">
                  {activeDemo !== "spending" ? (
                    <Button onClick={() => startDemo("spending")} className="bg-orange-500 hover:bg-orange-600">
                      <Play className="w-4 h-4 mr-2" />
                      Start Demo
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button onClick={nextStep} disabled={demoStep >= spendingSteps.length - 1}>
                        Next Step
                      </Button>
                      <Button onClick={resetDemo} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {spendingSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border transition-all duration-500 ${
                      activeDemo === "spending" && demoStep >= index
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          activeDemo === "spending" && demoStep >= index
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {activeDemo === "spending" && demoStep >= index ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <p className="text-sm text-gray-500">{step.details}</p>
                      </div>
                      {activeDemo === "spending" && demoStep === index && (
                        <div className="animate-pulse">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">SDK Integrations</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Route className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">LI.FI Protocol</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Cross-chain routing</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Circle CCTP</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 text-xs">USDC transfers</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">MetaMask DTK</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 text-xs">Delegation toolkit</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">No balance limits on spending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Automatic yield optimization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Cross-chain efficiency</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Real-time compounding</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Credit System Tab */}
          <TabsContent value="credit" className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Trustless Credit System</h2>
                <div className="flex items-center space-x-2">
                  {activeDemo !== "credit" ? (
                    <Button onClick={() => startDemo("credit")} className="bg-emerald-500 hover:bg-emerald-600">
                      <Play className="w-4 h-4 mr-2" />
                      Start Demo
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button onClick={nextStep} disabled={demoStep >= creditSteps.length - 1}>
                        Next Step
                      </Button>
                      <Button onClick={resetDemo} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {creditSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border transition-all duration-500 ${
                      activeDemo === "credit" && demoStep >= index
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          activeDemo === "credit" && demoStep >= index
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {activeDemo === "credit" && demoStep >= index ? <CheckCircle className="w-6 h-6" /> : step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <p className="text-sm text-gray-500">{step.details}</p>
                      </div>
                      {activeDemo === "credit" && demoStep === index && (
                        <div className="animate-pulse">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-emerald-600">30%</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Badge</h3>
                <p className="text-sm text-gray-600">Borrow up to 30% of vault balance</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-gray-600">50%</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Silver Master</h3>
                <p className="text-sm text-gray-600">Borrow up to 50% of vault balance</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-yellow-600">70%</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Gold Master</h3>
                <p className="text-sm text-gray-600">Borrow up to 70% of vault balance</p>
              </Card>
            </div>
          </TabsContent>

          {/* Badge System Tab */}
          <TabsContent value="badges" className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Badge Progression System</h2>
              <p className="text-gray-600 text-center mb-8">
                Earn points through spending to unlock higher badge tiers with enhanced features and better credit terms
              </p>

              <div className="space-y-6">
                {[
                  {
                    name: "Unverified",
                    points: 0,
                    credit: 0,
                    color: "from-gray-400 to-gray-500",
                    features: ["View Only"],
                    locked: false,
                  },
                  {
                    name: "Verified",
                    points: 100,
                    credit: 30,
                    color: "from-orange-400 to-orange-600",
                    features: ["30% Vault Credit", "Basic Protocols", "Manual Repay"],
                    locked: false,
                  },
                  {
                    name: "Silver Master",
                    points: 500,
                    credit: 50,
                    color: "from-gray-400 to-gray-600",
                    features: ["50% Vault Credit", "Auto Repay", "Cross-Chain", "LI.FI Routing"],
                    locked: true,
                  },
                  {
                    name: "Gold Master",
                    points: 1000,
                    credit: 70,
                    color: "from-yellow-400 to-yellow-600",
                    features: ["70% Vault Credit", "Premium Protocols", "AI Optimization", "Circle CCTP"],
                    locked: true,
                  },
                ].map((badge, index) => (
                  <div
                    key={badge.name}
                    className={`p-6 rounded-lg border ${badge.locked ? "border-gray-200 bg-gray-50" : "border-green-200 bg-green-50"}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center`}
                        >
                          {badge.locked ? (
                            <Lock className="w-8 h-8 text-white" />
                          ) : (
                            <Trophy className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{badge.name}</h3>
                          <p className="text-gray-600">Level {index}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{badge.points}</div>
                        <p className="text-sm text-gray-600">points required</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                        <div className="space-y-2">
                          {badge.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              {badge.locked ? (
                                <Lock className="w-4 h-4 text-gray-400" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                              <span className={`text-sm ${badge.locked ? "text-gray-500" : "text-gray-700"}`}>
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">{badge.credit}%</div>
                          <p className="text-sm text-blue-600">Credit Access</p>
                          <p className="text-xs text-gray-500 mt-1">of vault balance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the unlimited spending work?</AccordionTrigger>
              <AccordionContent>
                There are no balance limits in the demo version. You can spend any amount to test the complete DeFi
                flow. In production, spending would be limited by your actual card balance and credit limits.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What SDKs are integrated?</AccordionTrigger>
              <AccordionContent>
                We integrate MetaMask Delegation Toolkit for automated credit management, LI.FI SDK for cross-chain
                routing to find the highest yields, and Circle CCTP for fast, secure USDC transfers across chains.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How does the badge system work?</AccordionTrigger>
              <AccordionContent>
                You earn 1 point per $1 spent. Points unlock badge tiers: Verified (100 pts), Silver Master (500 pts),
                Gold Master (1000 pts). Higher badges unlock better credit limits and premium features.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is the credit system really trustless?</AccordionTrigger>
              <AccordionContent>
                Yes! Your vault balance serves as collateral, eliminating the need for credit checks. Smart contracts
                manage everything automatically, and you can only borrow up to your badge tier percentage of your vault
                balance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How does auto-repayment work?</AccordionTrigger>
              <AccordionContent>
                Using MetaMask Delegation Toolkit, you can set up automated repayments from your vault yield. The system
                can automatically use earned yield to repay loans, reducing your interest costs and maintaining healthy
                credit ratios.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your DeFi Journey?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Connect your wallet and start earning with every purchase. No limits, no restrictions.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            <Zap className="w-5 h-5" />
            <span>Launch Spend2Earn App</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
