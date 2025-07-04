"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Zap, TrendingUp, Shield, Sparkles, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface CardTransaction {
  id: string
  amount: number
  merchant: string
  category: string
  timestamp: Date
  cashback: number
  autoStaked: boolean
  chainUsed: string
  protocolUsed: string
}

export function MetaMaskCardIntegration() {
  const [isCardConnected, setIsCardConnected] = useState(false)
  const [recentTransactions, setRecentTransactions] = useState<CardTransaction[]>([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [totalCashback, setTotalCashback] = useState(0)
  const [cardBalance, setCardBalance] = useState(2500)
  const [isProcessing, setIsProcessing] = useState(false)

  // Simulate MetaMask Card connection
  const connectMetaMaskCard = async () => {
    setIsProcessing(true)
    toast.loading("Connecting to MetaMask Card...")
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsCardConnected(true)
    setIsProcessing(false)
    toast.success("🎉 MetaMask Card Connected Successfully!")
    
    // Add welcome transaction
    const welcomeTx: CardTransaction = {
      id: `card_${Date.now()}`,
      amount: 50,
      merchant: "MetaMask Card Activation",
      category: "Setup",
      timestamp: new Date(),
      cashback: 1.25,
      autoStaked: true,
      chainUsed: "Polygon",
      protocolUsed: "Aave"
    }
    
    setRecentTransactions([welcomeTx])
    setTotalSpent(50)
    setTotalCashback(1.25)
  }

  // Simulate card transactions
  const simulateCardSpending = () => {
    const merchants = [
      { name: "Starbucks", category: "Coffee", amounts: [4.5, 6.75, 8.25] },
      { name: "Amazon", category: "Shopping", amounts: [25.99, 49.99, 89.99] },
      { name: "Uber", category: "Transport", amounts: [12.50, 18.75, 25.00] },
      { name: "Netflix", category: "Entertainment", amounts: [15.99] },
      { name: "Whole Foods", category: "Groceries", amounts: [45.67, 78.23, 123.45] }
    ]

    const merchant = merchants[Math.floor(Math.random() * merchants.length)]
    const amount = merchant.amounts[Math.floor(Math.random() * merchant.amounts.length)]
    const cashback = amount * 0.025 // 2.5% cashback
    
    const newTransaction: CardTransaction = {
      id: `card_${Date.now()}`,
      amount,
      merchant: merchant.name,
      category: merchant.category,
      timestamp: new Date(),
      cashback,
      autoStaked: true,
      chainUsed: Math.random() > 0.5 ? "Polygon" : "Arbitrum",
      protocolUsed: ["Aave", "Compound", "Curve"][Math.floor(Math.random() * 3)]
    }

    setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 4)])
    setTotalSpent(prev => prev + amount)
    setTotalCashback(prev => prev + cashback)
    setCardBalance(prev => prev - amount)

    toast.success(
      `💳 ${merchant.name}: $${amount} → $${cashback.toFixed(2)} auto-staked on ${newTransaction.chainUsed}!`,
      { duration: 4000 }
    )
  }

  // Auto-generate transactions when card is connected
  useEffect(() => {
    if (!isCardConnected) return

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        simulateCardSpending()
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [isCardConnected])

  const calculateProgress = () => {
    const thresholds = [100, 500, 1000]
    let currentTier = 0
    
    for (let i = 0; i < thresholds.length; i++) {
      if (totalSpent >= thresholds[i]) currentTier = i + 1
    }
    
    const nextThreshold = thresholds[currentTier] || 1000
    return (totalSpent / nextThreshold) * 100
  }

  return (
    <div className="space-y-6">
      {/* MetaMask Card Connection */}
      <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">MetaMask Card</CardTitle>
                <p className="text-orange-100">Smart DeFi Credit Card</p>
              </div>
            </div>
            {isCardConnected && (
              <Badge className="bg-green-500/20 text-green-100 border-green-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCardConnected ? (
            <div className="text-center space-y-4">
              <p className="text-orange-100">
                Connect your MetaMask Card to start earning DeFi yield on every purchase
              </p>
              <Button
                onClick={connectMetaMaskCard}
                disabled={isProcessing}
                className="bg-white text-orange-600 hover:bg-orange-50 w-full"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Connect MetaMask Card
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-orange-100 text-sm">Card Balance</p>
                <p className="text-2xl font-bold">${cardBalance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-orange-100 text-sm">Total Cashback</p>
                <p className="text-2xl font-bold">${totalCashback.toFixed(2)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isCardConnected && (
        <>
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>Badge Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Total Spent: ${totalSpent.toFixed(2)}</span>
                <span>Next Tier: $500</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
              <p className="text-sm text-gray-600">
                Spend ${(500 - totalSpent).toFixed(2)} more to unlock Silver Badge benefits
              </p>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Recent Card Transactions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No transactions yet. Start spending to see your DeFi flow!</p>
                  </div>
                ) : (
                  recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <CreditCard className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{tx.merchant}</p>
                          <p className="text-sm text-gray-600">
                            {tx.category} • {tx.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${tx.amount}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            +${tx.cashback.toFixed(2)}
                          </Badge>
                          <Badge className="text-xs bg-green-100 text-green-800">
                            <Zap className="w-3 h-3 mr-1" />
                            {tx.protocolUsed}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {isCardConnected && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={simulateCardSpending}
                    variant="outline"
                    className="w-full"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Simulate Card Purchase
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 