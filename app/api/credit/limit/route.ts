import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Generate mock credit limit data based on address
  const addressNum = Number.parseInt(address.slice(-3), 16)
  const currentLimit = 5000 + (addressNum % 15000) // $5k-$20k limit
  const usedAmount = currentLimit * (0.1 + (addressNum % 60) / 100) // 10-70% utilization
  const availableCredit = currentLimit - usedAmount
  const utilizationRate = (usedAmount / currentLimit) * 100
  const maxPossibleLimit = currentLimit * 1.8 // 80% higher potential

  const mockData = {
    currentLimit,
    availableCredit,
    utilizationRate,
    maxPossibleLimit,
    creditHistory: {
      monthlyLimits: [
        { month: "Jan", limit: currentLimit * 0.7 },
        { month: "Feb", limit: currentLimit * 0.8 },
        { month: "Mar", limit: currentLimit * 0.9 },
        { month: "Apr", limit: currentLimit },
      ],
      utilizationHistory: [
        { month: "Jan", utilization: 45 },
        { month: "Feb", utilization: 38 },
        { month: "Mar", utilization: 52 },
        { month: "Apr", utilization: utilizationRate },
      ],
    },
  }

  return NextResponse.json(mockData)
}
