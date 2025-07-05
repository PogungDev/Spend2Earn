"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  Zap,
  Coffee,
  ShoppingCart,
  Utensils,
  Crown,
  Lock,
  RefreshCw,
  Home,
  Wallet,
  CreditCardIcon as CreditIcon,
  History,
  Trophy,
  AlertTriangle,
  DollarSign,
  Info,
  CreditCard,
  Vault,
  TrendingUp,
  Activity,
  CheckCircle,
} from "lucide-react"
import { toast } from "sonner"
import { WalletConnector } from "@/components/wallet/wallet-connector"
import { MetaMaskCardIntegration } from "@/components/metamask-card/card-integration"

interface AllocationData {
  aave: number
  compound: number
  curve: number
  yearn: number
}

interface SpendingData {
  amount: number
  merchant: string
  category: string
  timestamp: Date
  stakeTriggered: boolean
  stakeAmount: number
  protocol: string
  cashback: number
  txHash: string
  apr: string
}

interface ActivityLog {
  id: string
  type: "vault" | "card" | "routing" | "repay" | "badge" | "auto-stake" | "credit" | "spend" | "yield"
  description: string
  amount?: number
  timestamp: Date
  txHash?: string
  status: "completed" | "pending" | "failed"
  details?: string
  merchant?: string
  protocol?: string
  apr?: string
  cashbackRate?: string
  expectedYield?: string
  collateralRatio?: string
}

// Badge tier thresholds
const BADGE_THRESHOLDS = {
  unverified: 0,
  verified: 100,
  silver: 500,
  gold: 1000,
}

// Locked Feature Component
const LockedFeature = ({
  requiredTier,
  currentTier,
  featureName,
  onUpgrade,
}: {
  requiredTier: string
  currentTier: string
  featureName: string
  onUpgrade: () => void
}) => (
  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-lg">
    <CardContent className="pt-6">
      <div className="text-center py-12">
        <div className="relative mb-6">
          <Lock className="w-20 h-20 text-orange-400 mx-auto" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{requiredTier}</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-orange-700 mb-2">🔒 {featureName} Locked</h3>
        <p className="text-orange-600 mb-4">Requires {requiredTier} Badge to access this feature</p>
        <div className="bg-orange-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-orange-800">
            <strong>Current:</strong> {currentTier} Badge
            <br />
            <strong>Required:</strong> {requiredTier} Badge
          </p>
        </div>
        <Button
          onClick={onUpgrade}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
        >
          <Trophy className="mr-2 h-5 w-5" />
          Spend More to Unlock
        </Button>
      </div>
    </CardContent>
  </Card>
)

export default function DashboardPage() {
  // Start with Spend tab as default
  const [activeTab, setActiveTab] = useState("spend")

  // Core state - persisted in localStorage
  const [totalSpending, setTotalSpending] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spend2earn-total-spending")
      return saved ? Number.parseFloat(saved) : 0
    }
    return 0
  })

  const [totalCashback, setTotalCashback] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spend2earn-total-cashback")
      return saved ? Number.parseFloat(saved) : 0
    }
    return 0
  })

  const [vaultBalance, setVaultBalance] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spend2earn-vault-balance")
      return saved ? Number.parseFloat(saved) : 0
    }
    return 0
  })

  const [loanBalance, setLoanBalance] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spend2earn-loan-balance")
      return saved ? Number.parseFloat(saved) : 0
    }
    return 0
  })

  // Calculate badge tier based on total spending
  const getBadgeTier = (spending: number): string => {
    if (spending >= BADGE_THRESHOLDS.gold) return "Gold"
    if (spending >= BADGE_THRESHOLDS.silver) return "Silver"
    if (spending >= BADGE_THRESHOLDS.verified) return "Verified"
    return "Unverified"
  }

  const [currentBadge, setCurrentBadge] = useState(() => getBadgeTier(totalSpending))

  // Spending simulation state
  const [spendAmount, setSpendAmount] = useState("100")
  const [isProcessingSpend, setIsProcessingSpend] = useState(false)

  // Vault state
  const [depositAmount, setDepositAmount] = useState("1000")
  const [allocation, setAllocation] = useState<AllocationData>({
    aave: 40,
    compound: 30,
    curve: 20,
    yearn: 10,
  })
  const [isAllocating, setIsAllocating] = useState(false)

  // Routing state
  const [selectedChain, setSelectedChain] = useState("polygon")
  const [isRouting, setIsRouting] = useState(false)

  // Credit state
  const [borrowAmount, setBorrowAmount] = useState("500")
  const [repayAmount, setRepayAmount] = useState("100")
  const [autoRepayEnabled, setAutoRepayEnabled] = useState(true)

  // Auto-stake state
  const [autoStakeEnabled, setAutoStakeEnabled] = useState(true)
  const [stakeThreshold, setStakeThreshold] = useState(25)
  const [stakePercentage, setStakePercentage] = useState(15)
  const [recentSpends, setRecentSpends] = useState<SpendingData[]>([])

  // Activity log
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])

  // Yield simulation
  const [dailyYield, setDailyYield] = useState(0)

  // Persist state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("spend2earn-total-spending", totalSpending.toString())
      localStorage.setItem("spend2earn-total-cashback", totalCashback.toString())
      localStorage.setItem("spend2earn-vault-balance", vaultBalance.toString())
      localStorage.setItem("spend2earn-loan-balance", loanBalance.toString())
    }
  }, [totalSpending, totalCashback, vaultBalance, loanBalance])

  // Badge tier monitoring and notifications
  useEffect(() => {
    const newBadge = getBadgeTier(totalSpending)
    if (newBadge !== currentBadge) {
      const oldBadge = currentBadge
      setCurrentBadge(newBadge)

      // Toast notification for badge upgrade
      toast.success(`🎉 Badge Upgraded! ${oldBadge} → ${newBadge}`, {
        description: `You've unlocked new features with your ${newBadge} badge!`,
        duration: 5000,
      })

      // Add to activity log
      const newActivity: ActivityLog = {
        id: Date.now().toString(),
        type: "badge",
        description: `🎖️ Badge Upgraded: ${oldBadge} → ${newBadge}`,
        timestamp: new Date(),
        status: "completed",
        details: `Spending milestone reached: $${totalSpending.toFixed(2)}`,
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      }
      setActivityLog((prev) => [newActivity, ...prev.slice(0, 19)])
    }
  }, [totalSpending, currentBadge])

  // Vault yield simulation
  useEffect(() => {
    if (vaultBalance > 0) {
      const interval = setInterval(() => {
        const estimatedAPY = 8.5 // 8.5% APY
        const dailyRate = estimatedAPY / 365 / 100
        const newYield = vaultBalance * dailyRate

        setDailyYield(newYield)
        setVaultBalance((prev) => prev + newYield)

        // Add yield log every 10 seconds
        if (Math.random() < 0.1) {
          const newActivity: ActivityLog = {
            id: Date.now().toString(),
            type: "yield",
            description: `💰 Daily Yield Earned: $${newYield.toFixed(4)}`,
            amount: newYield,
            timestamp: new Date(),
            status: "completed",
            details: `8.5% APY from vault allocation`,
            apr: "8.5%",
          }
          setActivityLog((prev) => [newActivity, ...prev.slice(0, 19)])
        }
      }, 10000) // Every 10 seconds

      return () => clearInterval(interval)
    }
  }, [vaultBalance])

  // Auto-stake simulation
  useEffect(() => {
    if (!autoStakeEnabled || currentBadge === "Unverified") return

    const interval = setInterval(() => {
      const merchants = [
        { name: "Shopify Store", category: "Shopping", icon: ShoppingCart, amounts: [15.99, 29.99, 45.99] },
        { name: "Starbucks", category: "Coffee", icon: Coffee, amounts: [4.5, 6.75, 8.25] },
        { name: "Uber Eats", category: "Food", icon: Utensils, amounts: [18.5, 25.75, 32.25] },
        { name: "Amazon", category: "Shopping", icon: ShoppingCart, amounts: [25.99, 49.99, 89.99] },
      ]

      const merchant = merchants[Math.floor(Math.random() * merchants.length)]
      const amount = merchant.amounts[Math.floor(Math.random() * merchant.amounts.length)]
      const cashback = amount * 0.025 // 2.5% cashback
      const txHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`

      const newSpend: SpendingData = {
        amount,
        merchant: merchant.name,
        category: merchant.category,
        timestamp: new Date(),
        stakeTriggered: amount >= stakeThreshold,
        stakeAmount: amount >= stakeThreshold ? (cashback * stakePercentage) / 100 : 0,
        protocol: amount >= stakeThreshold ? "Auto-Stake Vault" : "",
        cashback,
        txHash,
        apr: "8.5%",
      }

      setRecentSpends((prev) => [newSpend, ...prev.slice(0, 4)])

      // Update totals
      setTotalSpending((prev) => prev + amount)
      setTotalCashback((prev) => prev + cashback)
      setVaultBalance((prev) => prev + cashback)

      // Add detailed activity log
      const newActivity: ActivityLog = {
        id: Date.now().toString(),
        type: "auto-stake",
        description: `💳 Auto-Spend: $${amount} at ${merchant.name} → $${cashback.toFixed(2)} cashback staked`,
        amount: cashback,
        timestamp: new Date(),
        txHash: newSpend.txHash,
        status: "completed",
        details: `LI.FI routed to Polygon, Circle CCTP transfer completed, auto-staked to vault`,
        merchant: merchant.name,
        protocol: "Auto-Stake Vault",
        apr: newSpend.apr,
        cashbackRate: "2.5%",
        expectedYield: `$${(cashback * 0.085).toFixed(4)}/year`,
      }
      setActivityLog((prev) => [newActivity, ...prev.slice(0, 19)])

      toast.success(`💳 ${merchant.name}: $${amount} → $${cashback.toFixed(2)} auto-staked`, {
        duration: 3000,
      })
    }, 12000) // Every 12 seconds

    return () => clearInterval(interval)
  }, [autoStakeEnabled, stakeThreshold, stakePercentage, currentBadge])

  // Protocol data
  const protocols = [
    { name: "Aave", apy: "7.2%", risk: "Low", audits: 5, color: "bg-blue-500", tvl: "$12.5B" },
    { name: "Compound", apy: "6.8%", risk: "Low", audits: 4, color: "bg-green-500", tvl: "$8.2B" },
    { name: "Curve", apy: "12.5%", risk: "Medium", audits: 3, color: "bg-purple-500", tvl: "$4.1B" },
    { name: "Yearn", apy: "8.9%", risk: "Medium", audits: 3, color: "bg-indigo-500", tvl: "$2.8B" },
  ]

  const chains = [
    { id: "ethereum", name: "Ethereum", apy: "5.2%", gas: "High", time: "~5 min", cost: "$15.00" },
    { id: "polygon", name: "Polygon", apy: "8.2%", gas: "Low", time: "~30 sec", cost: "$0.50" },
    { id: "arbitrum", name: "Arbitrum", apy: "7.8%", gas: "Medium", time: "~1 min", cost: "$2.00" },
    { id: "optimism", name: "Optimism", apy: "6.9%", gas: "Medium", time: "~1 min", cost: "$1.50" },
  ]

  // Calculate total allocation
  const totalAllocation = Object.values(allocation).reduce((sum, value) => sum + value, 0)

  // Calculate estimated APY
  const estimatedAPY = (
    (allocation.aave * 7.2 + allocation.compound * 6.8 + allocation.curve * 12.5 + allocation.yearn * 8.9) /
    100
  ).toFixed(1)

  // Calculate credit limit based on badge tier
  const getCreditLimit = (badge: string, vault: number): number => {
    if (vault < 100) return 0
    switch (badge) {
      case "Verified":
        return vault * 0.3 // 30%
      case "Silver":
        return vault * 0.5 // 50%
      case "Gold":
        return vault * 0.7 // 70%
      default:
        return 0 // Unverified = no credit
    }
  }

  const creditLimit = getCreditLimit(currentBadge, vaultBalance)

  // Badge tier benefits
  const getTierBenefits = (tier: string) => {
    switch (tier) {
      case "Unverified":
        return ["No DeFi access", "Must spend $100 to unlock Verified badge"]
      case "Verified":
        return ["Basic vault access", "30% credit limit", "Manual operations"]
      case "Silver":
        return ["Enhanced yield (+0.5% APY)", "50% credit limit", "Auto-repayment", "Premium vault access"]
      case "Gold":
        return ["Maximum yield (+1% APY)", "70% credit limit", "AI routing", "Elite vault access"]
      default:
        return []
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Unverified":
        return "from-gray-400 to-gray-600"
      case "Verified":
        return "from-orange-400 to-orange-600"
      case "Silver":
        return "from-gray-400 to-gray-600"
      case "Gold":
        return "from-yellow-400 to-yellow-600"
      default:
        return "from-purple-400 to-purple-600"
    }
  }

  // Spending simulation handler
  const handleSpendSimulation = async () => {
    setIsProcessingSpend(true)
    toast.loading("Processing card spending...")

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const amount = Number.parseFloat(spendAmount)
    const cashback = amount * 0.025 // 2.5% cashback

    // Update totals
    setTotalSpending((prev) => prev + amount)
    setTotalCashback((prev) => prev + cashback)
    setVaultBalance((prev) => prev + cashback)

    // Add detailed activity log with routing details
    const txHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: "spend",
      description: `💳 Card Spending: $${amount} → $${cashback.toFixed(2)} cashback earned`,
      amount: amount,
      timestamp: new Date(),
      txHash,
      status: "completed",
      details: `LI.FI routed to Polygon (optimal yield), Circle CCTP transferred USDC, auto-staked to vault`,
      cashbackRate: "2.5%",
      expectedYield: `$${(cashback * 0.085).toFixed(4)}/year`,
    }
    setActivityLog((prev) => [newActivity, ...prev.slice(0, 19)])

    setIsProcessingSpend(false)
    toast.success(`💳 Spent $${amount} → $${cashback.toFixed(2)} cashback auto-staked!`)
  }

  // Allocation handler
  const handleAllocation = async () => {
    if (totalAllocation !== 100) {
      toast.error("Total allocation must equal 100%")
      return
    }

    setIsAllocating(true)
    toast.loading("Allocating funds across protocols...")

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const amount = Number.parseFloat(depositAmount)
    setVaultBalance((prev) => prev + amount)

    // Add detailed activity log
    const txHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: "vault",
      description: `🟢 Allocated $${amount.toLocaleString()} across DeFi protocols`,
      amount: amount,
      timestamp: new Date(),
      txHash,
      status: "completed",
      details: `Aave: ${allocation.aave}% ($${((amount * allocation.aave) / 100).toFixed(2)}), Compound: ${allocation.compound}% ($${((amount * allocation.compound) / 100).toFixed(2)}), Curve: ${allocation.curve}% ($${((amount * allocation.curve) / 100).toFixed(2)}), Yearn: ${allocation.yearn}% ($${((amount * allocation.yearn) / 100).toFixed(2)})`,
      expectedYield: `$${((amount * Number.parseFloat(estimatedAPY)) / 100).toFixed(2)}/year`,
      apr: `${estimatedAPY}%`,
    }
    setActivityLog((prev) => [newActivity, ...prev.slice(0, 19)])

    setIsAllocating(false)
    toast.success(`Successfully allocated $${depositAmount} across DeFi protocols!`)
  }

  // Routing handler
  const handleRouting = async () => {
    setIsRouting(true)
    toast.loading(`Routing assets to ${chains.find((c) => c.id === selectedChain)?.name}...`)

    await new Promise((resolve) => setTimeout(resolve, 4000))

    const selectedChainData = chains.find((c) => c.id === selectedChain)
    const txHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
    const routeAmount = 500

    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: "routing",
      description: `🌉 LI.FI routed $${routeAmount} to ${selectedChainData?.name}`,
      amount: routeAmount,
      timestamp: new Date(),
      txHash,
      status: "completed",
      details: `LI.FI optimal route found, Circle CCTP bridge used, Bridge fee: ${selectedChainData?.cost}, Expected APY: ${selectedChainData?.apy}, Gas: ${selectedChainData?.gas}, Time: ${selectedChainData?.time}`,
      protocol: "LI.FI + Circle CCTP",
      apr: selectedChainData?.apy,
      expectedYield: `$${((routeAmount * Number.parseFloat(selectedChainData?.apy.replace("%", "") || "0")) / 100).toFixed(2)}/year`,
    }
    setActivityLog((prev) => [newActivity, ...prev.slice(0, 19)])

    setIsRouting(false)
    toast.success("Cross-chain routing completed via LI.FI + Circle CCTP!")
  }

  // Credit borrow handler
  const handleBorrow = async () => {
    if (currentBadge === "Unverified") {
      toast.error("🔒 Need Verified badge to access credit! Spend $100 first.")
      setActiveTab("spend")
      return
    }

    if (vaultBalance < 100) {
      toast.error("Need at least $100 in vault to access credit!")
      return
    }

    const amount = Number.parseFloat(borrowAmount)
    if (amount > creditLimit - loanBalance) {
      toast.error(`Credit limit exceeded. Available: $${(creditLimit - loanBalance).toFixed(2)}`)
      return
    }
    if (amount <= 0) {
      toast.error("Borrow amount must be greater than 0.")
      return
    }

    toast.loading("Processing credit request via MetaMask DTK...")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setLoanBalance((prev) => prev + amount)

    const interestRate = currentBadge === "Gold" ? "2.5%" : currentBadge === "Silver" ? "2.7%" : "3.2%"
    const collateralRatio = Math.floor((vaultBalance / (loanBalance + amount)) * 100)
    const txHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`

    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: "credit",
      description: `💰 Borrowed $${amount} via MetaMask DTK`,
      amount: amount,
      timestamp: new Date(),
      txHash,
      status: "completed",
      details: `Interest rate: ${interestRate} APR, Collateral ratio: ${collateralRatio}%, Vault backing: $${vaultBalance.toFixed(2)}, Auto-repay: ${autoRepayEnabled ? "enabled" : "disabled"}`,
      apr: interestRate,
      collateralRatio: `${collateralRatio}%`,
    }
    setActivityLog((prev) => [newActivity, ...prev.slice(0, 19)])

    toast.success(`Borrowed $${borrowAmount} with ${autoRepayEnabled ? "auto-repay enabled" : "manual repay"}`)
  }

  // Credit repayment handler
  const handleRepayCredit = async () => {
    if (loanBalance <= 0) {
      toast.error("No outstanding credit to repay.")
      return
    }

    const amount = Math.min(Number.parseFloat(repayAmount), loanBalance)

    toast.loading("Processing repayment from vault yield...")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Deduct from vault balance and loan balance
    setVaultBalance((prev) => Math.max(0, prev - amount))
    setLoanBalance((prev) => Math.max(0, prev - amount))

    const txHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: "repay",
      description: `💸 Repaid $${amount.toFixed(2)} from vault yield`,
      amount: amount,
      timestamp: new Date(),
      txHash,
      status: "completed",
      details: `Repayment source: Vault yield, Remaining loan: $${(loanBalance - amount).toFixed(2)}, Vault balance after repay: $${(vaultBalance - amount).toFixed(2)}`,
    }
    setActivityLog((prev) => [newActivity, ...prev.slice(0, 19)])

    toast.success(`Successfully repaid $${amount.toFixed(2)} from vault yield!`)
  }

  // Navigation handler for locked features
  const handleLockedFeatureClick = () => {
    setActiveTab("spend")
    toast.info("🔒 Spend more to unlock this feature!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Spend2Earn Dashboard</h1>
            <p className="text-gray-700">"Every Swipe, a Smarter DeFi Step"</p>
          </div>
          <div className="flex items-center space-x-2">
            <WalletConnector />
            <Badge className={`bg-gradient-to-r ${getTierColor(currentBadge)} text-white border-0`}>
              <Award className="w-3 h-3 mr-1" />
              {currentBadge}
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">${totalSpending.toFixed(0)} spent</Badge>
            <Link href="/how-it-works" passHref>
              <Button variant="outline" className="text-gray-700 hover:text-blue-600 bg-white">
                <Info className="w-4 h-4 mr-1" />
                How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* Badge Progress Alert */}
        {currentBadge === "Unverified" && (
          <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-300">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-800">🚨 Unverified Badge</h3>
                  <p className="text-orange-700">Spend $100 to unlock Verified badge and access DeFi features!</p>
                </div>
                <Button onClick={() => setActiveTab("spend")} className="bg-orange-600 hover:bg-orange-700 text-white">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Start Spending
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-white shadow-md h-auto p-1">
            <TabsTrigger value="spend" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs p-2">
              <Zap className="w-3 h-3 mr-1" />
              Spend
            </TabsTrigger>
            <TabsTrigger value="vault" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs p-2">
              <Vault className="w-3 h-3 mr-1" />
              Vault
            </TabsTrigger>
            <TabsTrigger value="credit" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-xs p-2">
              <DollarSign className="w-3 h-3 mr-1" />
              Borrow
            </TabsTrigger>
            <TabsTrigger value="repay" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs p-2">
              <RefreshCw className="w-3 h-3 mr-1" />
              Repay
            </TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-xs p-2">
              <Trophy className="w-3 h-3 mr-1" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white text-xs p-2">
              <Activity className="w-3 h-3 mr-1" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-xs p-2">
              <Home className="w-3 h-3 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="yield" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white text-xs p-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              Yield
            </TabsTrigger>
          </TabsList>

          {/* Spend Tab - Primary focus */}
          <TabsContent value="spend" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-white border-orange-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <DollarSign className="mr-2 h-5 w-5 text-orange-600" />
                      Unlimited Card Spending
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Spend any amount: Spend → Cashback → Auto-Stake → Points → Badge Progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-blue-100 text-blue-800">💳 Any Amount</Badge>
                      <Badge className="bg-orange-100 text-orange-800">🔥 2.5% Cashback</Badge>
                      <Badge className="bg-indigo-100 text-indigo-800">🌉 LI.FI Routing</Badge>
                      <Badge className="bg-purple-100 text-purple-800">⚡ Circle CCTP</Badge>
                      <Badge className="bg-green-100 text-green-800">🚫 No Limits</Badge>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Spend Amount ($) - No Limits!</label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={spendAmount}
                          onChange={(e) => setSpendAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                          className="pl-8 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-lg bg-white"
                          placeholder="e.g., 1000.00"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h3 className="font-medium mb-3 text-gray-900">💡 Spending Flow Preview</h3>
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <p className="text-gray-600">Cashback (2.5%)</p>
                          <p className="font-medium text-orange-600">
                            ${(Number.parseFloat(spendAmount || "0") * 0.025).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Auto-Stake</p>
                          <p className="font-medium text-green-600">
                            ${(Number.parseFloat(spendAmount || "0") * 0.025).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Badge Progress</p>
                          <p className="font-medium text-purple-600">
                            +${Number.parseFloat(spendAmount || "0").toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSpendSimulation}
                      disabled={isProcessingSpend || !spendAmount}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-4 text-lg"
                    >
                      {isProcessingSpend ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Spend & Auto-Stake
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">Total Spending</h3>
                    <div className="text-3xl font-bold">${totalSpending.toFixed(2)}</div>
                    <p className="text-orange-100 text-sm">unlimited spending power</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-orange-100">Total Cashback</span>
                        <span className="text-white font-medium">${totalCashback.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-100">Vault Balance</span>
                        <span className="text-white font-medium">${vaultBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-100">Points Earned</span>
                        <span className="text-white font-medium">{Math.floor(totalSpending)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-yellow-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Badge Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${getTierColor(currentBadge)} flex items-center justify-center mb-3`}
                      >
                        {currentBadge === "Unverified" ? (
                          <Lock className="h-8 w-8 text-white" />
                        ) : currentBadge === "Gold" ? (
                          <Crown className="h-8 w-8 text-white" />
                        ) : (
                          <Trophy className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{currentBadge} Badge</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress to next tier</span>
                        <span className="text-gray-900">
                          ${totalSpending.toFixed(0)}/
                          {currentBadge === "Unverified"
                            ? "$100"
                            : currentBadge === "Verified"
                              ? "$500"
                              : currentBadge === "Silver"
                                ? "$1000"
                                : "MAX"}
                        </span>
                      </div>
                      {currentBadge !== "Gold" && (
                        <Progress
                          value={
                            currentBadge === "Unverified"
                              ? (totalSpending / 100) * 100
                              : currentBadge === "Verified"
                                ? ((totalSpending - 100) / 400) * 100
                                : currentBadge === "Silver"
                                  ? ((totalSpending - 500) / 500) * 100
                                  : 100
                          }
                          className="h-2"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Vault Tab */}
          <TabsContent value="vault" className="space-y-6">
            {currentBadge === "Unverified" ? (
              <LockedFeature
                requiredTier="Verified"
                currentTier={currentBadge}
                featureName="Vault Allocation"
                onUpgrade={handleLockedFeatureClick}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-white border-blue-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-900">
                        <Wallet className="mr-2 h-5 w-5 text-blue-600" />
                        Vault Allocation Strategy
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Distribute assets across DeFi protocols for optimal yield
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Deposit Amount</label>
                        <div className="relative">
                          <Input
                            type="text"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                            className="pl-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900">Protocol Allocation</h3>
                          <Badge
                            variant={totalAllocation === 100 ? "default" : "destructive"}
                            className={
                              totalAllocation === 100 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }
                          >
                            Total: {totalAllocation}%
                          </Badge>
                        </div>

                        {protocols.map((protocol, index) => {
                          const key = protocol.name.toLowerCase() as keyof AllocationData
                          return (
                            <div key={protocol.name} className="space-y-2">
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-4 h-4 rounded-full ${protocol.color}`} />
                                  <span className="font-medium text-gray-900">{protocol.name}</span>
                                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">{protocol.apy}</Badge>
                                  <Badge className="bg-blue-100 text-blue-600 text-xs">{protocol.risk}</Badge>
                                  <Badge className="bg-gray-100 text-gray-600 text-xs">{protocol.tvl}</Badge>
                                </div>
                                <span className="font-medium text-gray-900">{allocation[key]}%</span>
                              </div>
                              <Slider
                                value={[allocation[key]]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={(value) => setAllocation((prev) => ({ ...prev, [key]: value[0] }))}
                                className="[&>span]:bg-blue-600"
                              />
                            </div>
                          )
                        })}
                      </div>

                      <Button
                        onClick={handleAllocation}
                        disabled={isAllocating || totalAllocation !== 100}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isAllocating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Allocating...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Execute Allocation
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-white border-blue-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Vault Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Balance</span>
                        <span className="font-medium text-blue-600">${vaultBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Estimated APY</span>
                        <span className="font-medium text-emerald-600">{estimatedAPY}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Daily Yield</span>
                        <span className="font-medium text-emerald-600">${dailyYield.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Monthly Yield</span>
                        <span className="font-medium text-emerald-600">
                          ~${((vaultBalance * Number.parseFloat(estimatedAPY)) / 100 / 12).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Credit Tab */}
          <TabsContent value="credit" className="space-y-6">
            {currentBadge === "Unverified" ? (
              <LockedFeature
                requiredTier="Verified"
                currentTier={currentBadge}
                featureName="Credit Features"
                onUpgrade={handleLockedFeatureClick}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-white border-green-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-900">
                        <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                        Vault-Backed Credit Line
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Borrow against your vault balance with competitive rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Available Credit</p>
                            <p className="text-xl font-bold text-green-600">
                              ${(getCreditLimit(currentBadge, vaultBalance) - loanBalance).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Used Credit</p>
                            <p className="text-xl font-bold text-orange-600">${loanBalance.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">APR Rate</p>
                            <p className="text-xl font-bold text-blue-600">
                              {currentBadge === "Verified" ? "4.5%" : currentBadge === "Silver" ? "3.2%" : "2.1%"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-900">Borrow Funds</h3>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Amount to Borrow</label>
                            <div className="relative">
                              <Input
                                type="text"
                                value={borrowAmount}
                                onChange={(e) => setBorrowAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                                className="pl-8 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white"
                                placeholder="0.00"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Max: ${(getCreditLimit(currentBadge, vaultBalance) - loanBalance).toFixed(2)}
                          </div>
                          <Button
                            onClick={handleBorrow}
                            disabled={!borrowAmount || Number.parseFloat(borrowAmount) > getCreditLimit(currentBadge, vaultBalance) - loanBalance}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <DollarSign className="mr-2 h-4 w-4" />
                            Borrow Now
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-900">Repay Loan</h3>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Repayment Amount</label>
                            <div className="relative">
                              <Input
                                type="text"
                                value={repayAmount}
                                onChange={(e) => setRepayAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                                className="pl-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                placeholder="0.00"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Outstanding: ${loanBalance.toFixed(2)}
                          </div>
                          <Button
                            onClick={handleRepayCredit}
                            disabled={!repayAmount || Number.parseFloat(repayAmount) > loanBalance}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Repay Loan
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Auto-Repayment from Yield</span>
                          <Button
                            variant={autoRepayEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setAutoRepayEnabled(!autoRepayEnabled)}
                            className={autoRepayEnabled ? "bg-green-600" : ""}
                          >
                            {autoRepayEnabled ? "Enabled" : "Disabled"}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                          {autoRepayEnabled 
                            ? "Vault yield will automatically repay loans when generated" 
                            : "Manual repayment required"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-white border-green-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Credit Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Credit Limit</span>
                        <span className="font-medium text-green-600">
                          ${getCreditLimit(currentBadge, vaultBalance).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Utilization</span>
                        <span className="font-medium text-orange-600">
                          {((loanBalance / getCreditLimit(currentBadge, vaultBalance)) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Monthly Interest</span>
                        <span className="font-medium text-red-600">
                          ${(loanBalance * (currentBadge === "Verified" ? 0.045 : currentBadge === "Silver" ? 0.032 : 0.021) / 12).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Collateral Value</span>
                        <span className="font-medium text-blue-600">${vaultBalance.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2">Credit Health</h3>
                      <div className="text-3xl font-bold mb-2">
                        {vaultBalance > 0 ? (loanBalance / vaultBalance < 0.8 ? "Healthy" : "At Risk") : "No Collateral"}
                      </div>
                      <p className="text-green-100 text-sm">
                        {vaultBalance > 0 && loanBalance / vaultBalance < 0.8 
                          ? "Your credit position is safe" 
                          : vaultBalance > 0 
                            ? "Consider adding collateral or repaying"
                            : "Add vault balance to enable borrowing"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Repay Tab */}
          <TabsContent value="repay" className="space-y-6">
            {currentBadge === "Unverified" ? (
              <LockedFeature
                requiredTier="Verified"
                currentTier={currentBadge}
                featureName="Repay Features"
                onUpgrade={handleLockedFeatureClick}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-white border-emerald-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-900">
                        <RefreshCw className="mr-2 h-5 w-5 text-emerald-600" />
                        Loan Repayment Center
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Manage your loan repayments and auto-repayment settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Outstanding Balance</p>
                            <p className="text-2xl font-bold text-red-600">${loanBalance.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Monthly Interest</p>
                            <p className="text-xl font-bold text-orange-600">
                              ${(loanBalance * (currentBadge === "Verified" ? 0.045 : currentBadge === "Silver" ? 0.032 : 0.021) / 12).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">Manual Repayment</h3>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Repayment Amount</label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={repayAmount}
                              onChange={(e) => setRepayAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                              className="pl-8 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                              placeholder="0.00"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setRepayAmount((loanBalance * 0.25).toFixed(2))}
                            variant="outline"
                            size="sm"
                          >
                            25%
                          </Button>
                          <Button
                            onClick={() => setRepayAmount((loanBalance * 0.5).toFixed(2))}
                            variant="outline"
                            size="sm"
                          >
                            50%
                          </Button>
                          <Button
                            onClick={() => setRepayAmount((loanBalance * 0.75).toFixed(2))}
                            variant="outline"
                            size="sm"
                          >
                            75%
                          </Button>
                          <Button
                            onClick={() => setRepayAmount(loanBalance.toFixed(2))}
                            variant="outline"
                            size="sm"
                          >
                            100%
                          </Button>
                        </div>
                        <Button
                          onClick={handleRepayCredit}
                          disabled={!repayAmount || Number.parseFloat(repayAmount) > loanBalance}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Repay ${repayAmount || "0"}
                        </Button>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">Auto-Repayment Settings</h4>
                            <p className="text-sm text-gray-600">Use vault yield to automatically repay loans</p>
                          </div>
                          <Button
                            variant={autoRepayEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setAutoRepayEnabled(!autoRepayEnabled)}
                            className={autoRepayEnabled ? "bg-green-600" : ""}
                          >
                            {autoRepayEnabled ? "Enabled" : "Disabled"}
                          </Button>
                        </div>
                        
                        {autoRepayEnabled && (
                          <div className="space-y-3 pt-3 border-t border-blue-200">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Next Auto-Repay:</span>
                              <span className="font-medium text-blue-600">${(vaultBalance * 0.087 / 365).toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Frequency:</span>
                              <span className="font-medium text-blue-600">Daily (from yield)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Time to Full Repay:</span>
                              <span className="font-medium text-blue-600">
                                {vaultBalance * 0.087 / 365 > 0 
                                  ? `${Math.ceil(loanBalance / (vaultBalance * 0.087 / 365))} days`
                                  : "∞"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-yellow-800 mb-2">💡 Repayment Tips</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Early repayment reduces total interest costs</li>
                          <li>• Auto-repayment uses daily vault yield when available</li>
                          <li>• Higher badge tiers get better interest rates</li>
                          <li>• Maintaining low utilization improves credit health</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2">Repayment Progress</h3>
                      <div className="text-3xl font-bold mb-2">
                        {loanBalance > 0 ? `${((1 - loanBalance / Math.max(getCreditLimit(currentBadge, vaultBalance), 1)) * 100).toFixed(1)}%` : "100%"}
                      </div>
                      <p className="text-emerald-100 text-sm mb-4">
                        {loanBalance > 0 ? "of credit limit available" : "No outstanding loans"}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-emerald-100">Interest Saved:</span>
                          <span className="text-white font-medium">$0.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-100">Total Repaid:</span>
                          <span className="text-white font-medium">
                            ${(getCreditLimit(currentBadge, vaultBalance) - loanBalance).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-emerald-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Repayment History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {loanBalance > 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No repayments yet</p>
                          <p className="text-xs">Start repaying to see history</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                          <p className="text-sm font-medium text-green-700">All loans repaid!</p>
                          <p className="text-xs text-gray-500">Great job maintaining good credit</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-emerald-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Payment Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-gray-500 py-4">
                        <p className="text-sm">
                          {autoRepayEnabled 
                            ? "Auto-repayment active - no scheduled payments needed"
                            : "Enable auto-repayment or set up manual payment schedule"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Yield Tab */}
          <TabsContent value="yield" className="space-y-6">
            {currentBadge === "Unverified" ? (
              <LockedFeature
                requiredTier="Verified"
                currentTier={currentBadge}
                featureName="Yield Farming"
                onUpgrade={handleLockedFeatureClick}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-white border-purple-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-900">
                        <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
                        Yield Performance Dashboard
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Track your yield farming performance across all protocols
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">${(vaultBalance * 0.087 / 365).toFixed(4)}</div>
                          <div className="text-sm text-gray-600">Daily Yield</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">${(vaultBalance * 0.087 / 12).toFixed(2)}</div>
                          <div className="text-sm text-gray-600">Monthly Est.</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">8.7%</div>
                          <div className="text-sm text-gray-600">Current APY</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">Protocol Performance</h3>
                        <div className="space-y-3">
                          {[
                            { name: "Aave USDC", allocation: 40, apy: 4.5, tvl: "$2.1B", color: "bg-blue-500" },
                            { name: "Compound cUSDC", allocation: 30, apy: 3.8, tvl: "$1.8B", color: "bg-green-500" },
                            { name: "Curve 3Pool", allocation: 20, apy: 12.3, tvl: "$890M", color: "bg-yellow-500" },
                            { name: "Yearn USDC", allocation: 10, apy: 15.2, tvl: "$450M", color: "bg-purple-500" }
                          ].map((protocol, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-4 h-4 rounded-full ${protocol.color}`} />
                                  <span className="font-medium text-gray-900">{protocol.name}</span>
                                  <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                                    {protocol.apy}% APY
                                  </Badge>
                                </div>
                                <span className="text-sm text-gray-600">{protocol.allocation}% allocated</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>TVL: {protocol.tvl}</span>
                                <span>Earning: ${((vaultBalance * protocol.allocation / 100) * (protocol.apy / 100) / 365).toFixed(4)}/day</span>
                              </div>
                              <Progress value={protocol.allocation} className="h-2 mt-2" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-yellow-800 mb-2">🚀 Optimization Opportunity</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          Rebalancing to higher-yield protocols could increase your APY by +2.3%
                        </p>
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                          Auto-Optimize Allocation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2">Total Yield Earned</h3>
                      <div className="text-3xl font-bold mb-2">${(vaultBalance * 0.087 * 0.25).toFixed(2)}</div>
                      <p className="text-purple-100 text-sm">+${(vaultBalance * 0.087 / 365).toFixed(4)} today</p>
                      
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-100">This Week</span>
                          <span className="text-white font-medium">${(vaultBalance * 0.087 / 52).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-100">This Month</span>
                          <span className="text-white font-medium">${(vaultBalance * 0.087 / 12).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-100">Projected Annual</span>
                          <span className="text-white font-medium">${(vaultBalance * 0.087).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-purple-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Yield Strategy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Risk Level</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Auto-Compound</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Gas Optimization</span>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rebalancing</span>
                        <Badge className="bg-purple-100 text-purple-800">Weekly</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Activity className="mr-2 h-5 w-5 text-indigo-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-600">
                  All your spending, staking, and DeFi activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    type: "spend",
                    title: "Card Purchase",
                    description: `Spent $${spendAmount || "100"} at Starbucks Coffee`,
                    amount: `+$${((Number.parseFloat(spendAmount || "100")) * 0.025).toFixed(2)}`,
                    time: "2 minutes ago",
                    icon: <CreditCard className="w-5 h-5 text-orange-500" />,
                    status: "completed"
                  },
                  {
                    type: "vault",
                    title: "Auto-Stake Triggered",
                    description: "Cashback staked to Aave USDC vault",
                    amount: `+$${((Number.parseFloat(spendAmount || "100")) * 0.025).toFixed(2)}`,
                    time: "2 minutes ago",
                    icon: <Vault className="w-5 h-5 text-blue-500" />,
                    status: "completed"
                  },
                  {
                    type: "yield",
                    title: "Yield Generated",
                    description: "Daily compound interest earned",
                    amount: `+$${(vaultBalance * 0.087 / 365).toFixed(4)}`,
                    time: "5 minutes ago",
                    icon: <TrendingUp className="w-5 h-5 text-green-500" />,
                    status: "completed"
                  },
                  {
                    type: "credit",
                    title: "Credit Available",
                    description: `Vault growth increased credit limit`,
                    amount: `+$${(getCreditLimit(currentBadge, vaultBalance) * 0.1).toFixed(2)}`,
                    time: "1 hour ago",
                    icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
                    status: "completed"
                  },
                  {
                    type: "badge",
                    title: "Badge Progress",
                    description: `${Math.min(100 - (totalSpending % 100), 100).toFixed(0)} points to next tier`,
                    amount: `+${Math.floor(Number.parseFloat(spendAmount || "100"))} pts`,
                    time: "2 hours ago",
                    icon: <Trophy className="w-5 h-5 text-yellow-500" />,
                    status: totalSpending >= 100 ? "completed" : "pending"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            activity.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {activity.amount}
                          </span>
                          <Badge 
                            className={
                              activity.status === 'completed' 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
                  Badge Collection & Progress
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Earn badges by spending and unlock exclusive features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      name: "Unverified",
                      requirement: "$0 spent",
                      features: ["View Only", "Basic Dashboard"],
                      unlocked: true,
                      current: currentBadge === "Unverified",
                      color: "from-gray-400 to-gray-500",
                      icon: <Lock className="w-8 h-8 text-white" />
                    },
                    {
                      name: "Verified",
                      requirement: "$100 spent",
                      features: ["30% Vault Credit", "Basic Protocols", "Manual Repay"],
                      unlocked: totalSpending >= 100,
                      current: currentBadge === "Verified",
                      color: "from-orange-400 to-orange-600",
                      icon: <Trophy className="w-8 h-8 text-white" />
                    },
                    {
                      name: "Silver Master",
                      requirement: "$500 spent",
                      features: ["50% Vault Credit", "Auto Repay", "Cross-Chain", "LI.FI Routing"],
                      unlocked: totalSpending >= 500,
                      current: currentBadge === "Silver",
                      color: "from-gray-400 to-gray-600",
                      icon: <Award className="w-8 h-8 text-white" />
                    },
                    {
                      name: "Gold Master",
                      requirement: "$1000 spent",
                      features: ["70% Vault Credit", "Premium Protocols", "AI Optimization", "Circle CCTP"],
                      unlocked: totalSpending >= 1000,
                      current: currentBadge === "Gold",
                      color: "from-yellow-400 to-yellow-600",
                      icon: <Crown className="w-8 h-8 text-white" />
                    }
                  ].map((badge, index) => (
                    <Card key={index} className={`relative ${badge.current ? 'ring-2 ring-blue-500' : ''} ${!badge.unlocked ? 'opacity-60' : ''}`}>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center mb-4 ${!badge.unlocked ? 'grayscale' : ''}`}>
                            {badge.icon}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{badge.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">{badge.requirement}</p>
                          
                          <div className="space-y-2 mb-4">
                            {badge.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center justify-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${badge.unlocked ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className="text-xs text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {badge.current && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              Current Badge
                            </Badge>
                          )}
                          {!badge.unlocked && (
                            <Badge className="bg-gray-100 text-gray-600">
                              Locked
                            </Badge>
                          )}
                          {badge.unlocked && !badge.current && (
                            <Badge className="bg-green-100 text-green-800">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Badge Progress</h3>
                      <p className="text-gray-600 mb-4">
                        You've spent ${totalSpending.toFixed(0)} and earned {Math.floor(totalSpending)} points
                      </p>
                      
                      <div className="max-w-md mx-auto">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Current Progress</span>
                          <span>
                            {currentBadge === "Gold" 
                              ? "Max Level Reached!"
                              : `${(totalSpending % (
                                  currentBadge === "Unverified" ? 100 :
                                  currentBadge === "Verified" ? 400 :
                                  currentBadge === "Silver" ? 500 : 0
                                )).toFixed(0)} / ${
                                  currentBadge === "Unverified" ? "100" :
                                  currentBadge === "Verified" ? "400" :
                                  currentBadge === "Silver" ? "500" : "MAX"
                                }`
                            }
                          </span>
                        </div>
                        {currentBadge !== "Gold" && (
                          <Progress
                            value={
                              currentBadge === "Unverified" ? (totalSpending / 100) * 100 :
                              currentBadge === "Verified" ? ((totalSpending - 100) / 400) * 100 :
                              currentBadge === "Silver" ? ((totalSpending - 500) / 500) * 100 : 100
                            }
                            className="h-3"
                          />
                        )}
                      </div>

                      {currentBadge !== "Gold" && (
                        <div className="mt-4">
                          <Button
                            onClick={() => setActiveTab("spend")}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          >
                            <Zap className="mr-2 h-4 w-4" />
                            Continue Spending to Unlock
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Total Spending</p>
                      <p className="text-2xl font-bold">${totalSpending.toFixed(0)}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Vault Balance</p>
                      <p className="text-2xl font-bold">${vaultBalance.toFixed(0)}</p>
                    </div>
                    <Vault className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Yield</p>
                      <p className="text-2xl font-bold">${(vaultBalance * 0.087 * 0.25).toFixed(0)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Available Credit</p>
                      <p className="text-2xl font-bold">${(getCreditLimit(currentBadge, vaultBalance) - loanBalance).toFixed(0)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Portfolio Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Badge</span>
                    <Badge className={`bg-gradient-to-r ${getTierColor(currentBadge)} text-white border-0`}>
                      {currentBadge}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credit Utilization</span>
                    <span className="font-medium">{((loanBalance / Math.max(getCreditLimit(currentBadge, vaultBalance), 1)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Yield</span>
                    <span className="font-medium text-green-600">${(vaultBalance * 0.087 / 12).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Points Earned</span>
                    <span className="font-medium text-purple-600">{Math.floor(totalSpending)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setActiveTab("spend")}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Make a Purchase
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("vault")}
                    variant="outline" 
                    className="w-full"
                  >
                    <Vault className="mr-2 h-4 w-4" />
                    Manage Vault
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("credit")}
                    variant="outline" 
                    className="w-full"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Access Credit
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("yield")}
                    variant="outline" 
                    className="w-full"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Yield
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🎉 Welcome to Spend2Earn!</h3>
                  <p className="text-gray-600 mb-6">
                    Transform every purchase into DeFi yield. Connect your MetaMask Card and start earning automatically.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-white rounded-lg">
                      <div className="font-semibold text-orange-600">💳 Unlimited Spending</div>
                      <div className="text-gray-600">No balance limits</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <div className="font-semibold text-green-600">🔄 Auto-Staking</div>
                      <div className="text-gray-600">2.5% cashback staked</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <div className="font-semibold text-purple-600">🏆 Badge Progression</div>
                      <div className="text-gray-600">Unlock better rates</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
