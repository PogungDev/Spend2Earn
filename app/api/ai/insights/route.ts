import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const mockInsights = [
    {
      type: "opportunity",
      title: "High APY Opportunity Detected",
      description:
        "Curve Finance on Arbitrum is offering 18.5% APY for USDC-USDT LP. Consider reallocating 15% of your stable portfolio.",
      action: "Optimize Allocation",
      confidence: 0.87,
      potentialGain: "$2,340 annually",
    },
    {
      type: "warning",
      title: "Credit Utilization Alert",
      description: "Your credit utilization is at 68%. Consider repaying $1,500 to improve your credit health score.",
      action: "Auto-Repay Now",
      urgency: "medium",
    },
    {
      type: "suggestion",
      title: "Cross-Chain Arbitrage",
      description: "USDC yield on Base (12.3%) vs Ethereum (4.2%). Bridge $5,000 to capture 8.1% difference.",
      action: "Execute Bridge",
      gasCost: "$12.50",
      netBenefit: "$405 annually",
    },
    {
      type: "info",
      title: "Portfolio Rebalancing Due",
      description: "Your portfolio allocation has drifted from target. Last rebalance was 12 days ago.",
      action: "Rebalance Portfolio",
      lastRebalance: "12 days ago",
    },
  ]

  // Randomize which insights to show based on address or demo mode
  const selectedInsights = mockInsights.sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2)) // Show 2-3 insights

  return NextResponse.json({ insights: selectedInsights })
}
