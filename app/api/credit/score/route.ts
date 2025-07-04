import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Generate mock credit score based on address
  const addressNum = Number.parseInt(address.slice(-4), 16)
  const baseScore = 550 + (addressNum % 300) // Score between 550-850
  const trend = baseScore > 650 ? "up" : "down"

  const mockData = {
    score: baseScore,
    trend,
    factors: [
      "On-chain transaction history",
      "DeFi protocol interactions",
      "Repayment consistency",
      "Portfolio diversification",
      "Yield generation activity",
    ],
    lastUpdated: new Date().toISOString(),
    improvement: {
      potential: Math.min(850, baseScore + 50),
      recommendations: [
        "Increase DeFi protocol diversity",
        "Maintain consistent repayment schedule",
        "Optimize yield generation strategies",
      ],
    },
  }

  return NextResponse.json(mockData)
}
