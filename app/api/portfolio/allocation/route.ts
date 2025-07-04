import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate allocation based on address hash or demo data
  const hash = address && address !== "demo" ? Number.parseInt(address.slice(-4), 16) : 12345

  const baseAllocations = [
    { name: "Aave V3", value: 25, color: "#B6509E", apy: 4.5, amount: 12500 },
    { name: "Compound V3", value: 20, color: "#2EBAC6", apy: 3.8, amount: 10000 },
    { name: "Uniswap V3", value: 25, color: "#FF007A", apy: 12.1, amount: 12500 },
    { name: "Curve Finance", value: 15, color: "#40E0D0", apy: 7.2, amount: 7500 },
    { name: "GMX", value: 10, color: "#4C82FB", apy: 18.0, amount: 5000 },
    { name: "Balancer", value: 5, color: "#1E1E1E", apy: 9.5, amount: 2500 },
  ]

  // Add some randomization based on address
  const allocations = baseAllocations.map((allocation, index) => ({
    ...allocation,
    value: Math.max(1, allocation.value + (hash % (10 + index)) - 5),
    amount: allocation.amount * (1 + ((hash % 20) - 10) / 100),
  }))

  // Normalize to 100%
  const total = allocations.reduce((sum, item) => sum + item.value, 0)
  const normalizedAllocations = allocations.map((item) => ({
    ...item,
    value: Number.parseFloat(((item.value / total) * 100).toFixed(1)),
  }))

  const totalValue = normalizedAllocations.reduce((sum, item) => sum + item.amount, 0)
  const weightedAPY = normalizedAllocations.reduce((sum, item) => sum + (item.apy * item.value) / 100, 0)

  return NextResponse.json({
    allocation: normalizedAllocations,
    summary: {
      totalValue,
      weightedAPY: Number.parseFloat(weightedAPY.toFixed(2)),
      totalProtocols: normalizedAllocations.length,
      riskScore: 6.8, // Mock risk score
      lastRebalance: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  })
}
