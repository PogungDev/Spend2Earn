"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  ArrowRight,
  TrendingUp,
  Zap,
  CheckCircle,
  Clock,
  Play,
  Link,
  Layers,
  RefreshCw,
} from "lucide-react"

interface ProtocolComposition {
  id: string
  name: string
  type: "lending" | "staking" | "yield" | "bridge"
  apy: number
  tvl: string
  integration: string
  cardTrigger: string
  status: "active" | "pending" | "available"
}

const protocolCompositions: ProtocolComposition[] = [
  {
    id: "aave-compound",
    name: "Aave + Compound Lending Stack",
    type: "lending",
    apy: 4.5,
    tvl: "$12.5M",
    integration: "Auto-borrow on card spend &gt; $100",
    cardTrigger: "Large purchases trigger instant borrowing",
    status: "active",
  },
  {
    id: "lido-pendle",
    name: "Lido + Pendle Staking Combo",
    type: "staking",
    apy: 18.2,
    tvl: "$8.7M",
    integration: "10% of card spend auto-stakes",
    cardTrigger: "Every purchase builds staking position",
    status: "active",
  },
  {
    id: "curve-convex",
    name: "Curve + Convex Yield Farming",
    type: "yield",
    apy: 12.1,
    tvl: "$15.2M",
    integration: "Repayment source from yield",
    cardTrigger: "Yield automatically repays card balance",
    status: "active",
  },
  {
    id: "lifi-stargate",
    name: "LI.FI + Stargate Bridge",
    type: "bridge",
    apy: 0,
    tvl: "$5.8M",
    integration: "Cross-chain optimization",
    cardTrigger: "Routes funds to highest yield chains",
    status: "pending",
  },
  {
    id: "yearn-convex",
    name: "Yearn + Convex Yield Stack",
    type: "yield",
    apy: 14.8,
    tvl: "$22.1M",
    integration: "Auto-compound on $50+ spends",
    cardTrigger: "Large purchases trigger yield optimization",
    status: "active",
  },
  {
    id: "balancer-aura",
    name: "Balancer + Aura Boosted Pool",
    type: "yield",
    apy: 16.3,
    tvl: "$18.7M",
    integration: "Liquidity provision on card top-up",
    cardTrigger: "Card funding triggers LP position",
    status: "pending",
  },
]

const ComposableProtocolCard = ({
  protocol,
  onActivate,
}: {
  protocol: ProtocolComposition
  onActivate: (id: string) => void
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "lending":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "staking":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "yield":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "bridge":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = () => {
    switch (protocol.status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
      case "available":
        return <Play className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <Card className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-orange-500/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Layers className="w-5 h-5 text-orange-500" />
            <Link className="w-3 h-3 text-orange-400" />
          </div>
          <div>
            <p className="font-medium text-white">{protocol.name}</p>
            <p className="text-sm text-gray-400">TVL: {protocol.tvl}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge className={getTypeColor(protocol.type)}>
            {getStatusIcon()}
            <span className="ml-1 capitalize">{protocol.type}</span>
          </Badge>
          {protocol.apy > 0 && <p className="text-sm text-green-400 mt-1">{protocol.apy}% APY</p>}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2 text-sm">
          <CreditCard className="w-3 h-3 text-orange-500" />
          <span className="text-gray-400">Card Integration:</span>
          <span className="text-orange-400 font-medium">{protocol.integration}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Zap className="w-3 h-3 text-blue-500" />
          <span className="text-gray-400">Trigger:</span>
          <span className="text-blue-400">{protocol.cardTrigger}</span>
        </div>
      </div>

      {protocol.status === "available" && (
        <Button onClick={() => onActivate(protocol.id)} size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
          <Play className="w-3 h-3 mr-1" />
          Activate Protocol
        </Button>
      )}
    </Card>
  )
}

const CardActivityFlow = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)

  const flowSteps = [
    {
      step: 1,
      title: "Card Purchase",
      description: "User spends $250 at grocery store",
      icon: <CreditCard className="w-5 h-5 text-orange-500" />,
      protocols: [],
    },
    {
      step: 2,
      title: "Multi-Protocol Composition Triggered",
      description: "6 different DeFi protocols activate simultaneously",
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      protocols: [
        { name: "Aave V3", action: "Borrow $250 against vault collateral (2.1% APR)", color: "text-purple-400" },
        { name: "Pendle", action: "Stake $25 (10% of spend) in PT-stETH vault", color: "text-green-400" },
        { name: "LI.FI", action: "Route to Arbitrum for 3.2% higher yield", color: "text-orange-400" },
        { name: "Yearn", action: "Auto-compound strategy activation", color: "text-blue-400" },
        { name: "Convex", action: "Boost CRV rewards by 2.5x multiplier", color: "text-yellow-400" },
        { name: "1inch", action: "Optimize swap routes for gas efficiency", color: "text-pink-400" },
      ],
    },
    {
      step: 3,
      title: "Cross-Protocol Execution",
      description: "Protocols work together seamlessly",
      icon: <RefreshCw className="w-5 h-5 text-green-500" />,
      protocols: [
        { name: "Compound", action: "Lend excess funds at 4.2% APY", color: "text-blue-400" },
        { name: "Curve", action: "Generate yield for auto-repayment", color: "text-yellow-400" },
        { name: "Stargate", action: "Bridge funds cross-chain ($1.20 fee)", color: "text-pink-400" },
      ],
    },
    {
      step: 4,
      title: "Automatic Repayment",
      description: "Yield from composed protocols repays card balance",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      protocols: [
        { name: "Result", action: "Card balance auto-repaid from yield", color: "text-green-400" },
        { name: "Profit", action: "+$3.50 net profit from composition", color: "text-green-400" },
      ],
    },
  ]

  const simulateFlow = async () => {
    setIsSimulating(true)
    setCurrentStep(0)

    for (let i = 0; i < flowSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setCurrentStep(i + 1)
    }

    setIsSimulating(false)
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Composable DeFi Protocol Flow</h3>
          <p className="text-gray-300 text-sm">Watch how multiple protocols compose together when you use your card</p>
        </div>
        <Button
          onClick={simulateFlow}
          disabled={isSimulating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Simulate Card Purchase
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {flowSteps.map((step, index) => (
          <div
            key={step.step}
            className={`p-4 rounded-lg border transition-all duration-500 ${
              currentStep >= step.step
                ? "bg-green-600/10 border-green-600/30"
                : currentStep === step.step - 1 && isSimulating
                  ? "bg-yellow-600/10 border-yellow-600/30 animate-pulse"
                  : "bg-gray-700/30 border-gray-600/30"
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              {step.icon}
              <div>
                <h4 className="font-medium text-white">{step.title}</h4>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
              {currentStep >= step.step && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
            </div>

            {step.protocols.length > 0 && currentStep >= step.step && (
              <div className="ml-8 space-y-2">
                {step.protocols.map((protocol, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm">
                    <ArrowRight className="w-3 h-3 text-orange-500" />
                    <span className={protocol.color}>{protocol.name}:</span>
                    <span className="text-gray-300">{protocol.action}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {currentStep === flowSteps.length && (
        <div className="mt-4 p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h4 className="font-medium text-green-400">✅ Composable DeFi Complete!</h4>
          </div>
          <p className="text-sm text-gray-300">
            Your $250 card purchase triggered 6 different DeFi protocols working together. The composition generated
            enough yield to repay your card balance plus $3.50 profit!
          </p>
        </div>
      )}
    </Card>
  )
}

const ProtocolCompositionStats = () => (
  <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Active Protocol Compositions</h3>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-green-400">6 Protocols Active</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-2xl font-bold text-blue-400">$47.2M</p>
        <p className="text-sm text-gray-400">Total Composable TVL</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-green-400">12.8%</p>
        <p className="text-sm text-gray-400">Avg Composed APY</p>
      </div>
    </div>

    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Lending Protocols</span>
          <span className="text-blue-400">40%</span>
        </div>
        <Progress value={40} className="h-2" />
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Staking Protocols</span>
          <span className="text-purple-400">35%</span>
        </div>
        <Progress value={35} className="h-2" />
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Yield Protocols</span>
          <span className="text-green-400">25%</span>
        </div>
        <Progress value={25} className="h-2" />
      </div>
    </div>
  </Card>
)

export function ComposableProtocolsDashboard() {
  const [protocols, setProtocols] = useState(protocolCompositions)

  const activateProtocol = (id: string) => {
    setProtocols((prev) => prev.map((p) => (p.id === id ? { ...p, status: "active" as const } : p)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Layers className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-3xl font-bold text-white">Composable DeFi Protocols</h2>
            <p className="text-gray-400">Multiple protocols working together, triggered by card activity</p>
          </div>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Link className="mr-2 h-4 w-4" />
          Protocol Composition
        </Badge>
      </div>

      {/* Card Activity Flow Simulator */}
      <CardActivityFlow />

      {/* Protocol Composition Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProtocolCompositionStats />

        <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Card-Triggered Actions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-600/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-orange-500" />
                <span className="text-sm">Purchases &gt; $100</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-blue-400">Auto-borrow</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-600/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-orange-500" />
                <span className="text-sm">Any purchase</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-purple-400">10% auto-stake</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-600/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm">Yield generated</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-green-400">Auto-repay</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Cross-Chain Routing</h3>
          <div className="space-y-3">
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Link className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">LI.FI + Stargate</span>
              </div>
              <p className="text-xs text-gray-400">Routes to highest yield chains automatically</p>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Ethereum → Polygon:</span>
                <span className="text-green-400">+2.3% APY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bridge Fee:</span>
                <span className="text-orange-400">$1.20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Net Benefit:</span>
                <span className="text-green-400">+$45/month</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Protocol Compositions */}
      <Card className="p-6 bg-gray-800/50 backdrop-blur-md text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Available Protocol Compositions</h3>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            {protocols.filter((p) => p.status === "active").length} Active Compositions
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocols.map((protocol) => (
            <ComposableProtocolCard key={protocol.id} protocol={protocol} onActivate={activateProtocol} />
          ))}
        </div>
      </Card>

      {/* How Composability Works */}
      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">How Composable DeFi Powers Your Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-white mb-2">1. Protocol Composition</h4>
            <p className="text-sm text-gray-400">Multiple DeFi protocols work together as building blocks</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-white mb-2">2. Card Activity Triggers</h4>
            <p className="text-sm text-gray-400">Every purchase activates the composed protocol stack</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-white mb-2">3. Automatic Execution</h4>
            <p className="text-sm text-gray-400">Borrowing, staking, and repayments happen seamlessly</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
