export const mockStrategies = [
  {
    id: "conservative",
    name: "Conservative",
    expectedApy: 7.5,
    riskLevel: "Low" as const,
    description: "Stable yields with minimal risk",
    protocols: ["Aave", "Compound"],
    allocation: { aave: 60, compound: 40 },
    minAmount: 100,
  },
  {
    id: "balanced",
    name: "Balanced",
    expectedApy: 11.2,
    riskLevel: "Medium" as const,
    description: "Balanced risk-reward optimization",
    protocols: ["Aave", "Curve", "Pendle"],
    allocation: { aave: 40, curve: 35, pendle: 25 },
    minAmount: 500,
  },
  {
    id: "growth",
    name: "Growth",
    expectedApy: 18.7,
    riskLevel: "High" as const,
    description: "Maximum yield with higher risk",
    protocols: ["Pendle", "Velodrome", "GMX"],
    allocation: { pendle: 40, velodrome: 35, gmx: 25 },
    minAmount: 1000,
  },
]

export const mockChains = [
  { id: "ethereum", name: "Ethereum", currentAPY: "7.2%", tvl: "$15.2B", protocols: 12, color: "bg-blue-500" },
  { id: "arbitrum", name: "Arbitrum", currentAPY: "12.4%", tvl: "$3.8B", protocols: 8, color: "bg-cyan-500" },
  { id: "polygon", name: "Polygon", currentAPY: "9.8%", tvl: "$2.1B", protocols: 6, color: "bg-purple-500" },
  { id: "base", name: "Base", currentAPY: "15.6%", tvl: "$1.9B", protocols: 5, color: "bg-blue-600" },
  { id: "optimism", name: "Optimism", currentAPY: "11.1%", tvl: "$1.5B", protocols: 4, color: "bg-red-500" },
]

export const mockTransactions = [
  {
    id: "1",
    type: "card_spend" as const,
    description: "Coffee Shop Purchase",
    amount: 4.5,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    trigger: "Auto-stake cashback",
    triggerAmount: 0.23,
  },
  {
    id: "2",
    type: "yield_earned" as const,
    description: "Aave USDC Yield",
    amount: 12.45,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    trigger: "Auto-compound",
  },
  {
    id: "3",
    type: "credit_repay" as const,
    description: "Auto Credit Repayment",
    amount: 25.0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    trigger: "Yield surplus",
  },
]

export const mockYieldData = {
  totalStaked: 12500,
  totalEarned: 1234.56,
  currentAPY: 11.2,
  monthlyProjection: 116.67,
  bestProtocol: "Pendle USDC",
}

export const mockCreditData = {
  limit: 5000,
  used: 1500,
  available: 3500,
  score: 785,
  nextPayment: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  vaultBackedPercentage: 30,
}
