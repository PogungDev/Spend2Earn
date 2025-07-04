import { NextResponse } from "next/server"

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const mockProtocols = [
    {
      name: "Aave V3",
      chain: "Ethereum",
      apy: 4.5 + Math.random() * 2,
      tvl: 15000000000 + Math.random() * 5000000000,
      risk: "Low",
      category: "Lending",
      logo: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Compound V3",
      chain: "Ethereum",
      apy: 3.8 + Math.random() * 1.5,
      tvl: 8000000000 + Math.random() * 2000000000,
      risk: "Low",
      category: "Lending",
      logo: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Uniswap V3",
      chain: "Polygon",
      apy: 12.1 + Math.random() * 8,
      tvl: 3000000000 + Math.random() * 1000000000,
      risk: "Medium",
      category: "DEX",
      logo: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Curve Finance",
      chain: "Arbitrum",
      apy: 7.2 + Math.random() * 4,
      tvl: 5000000000 + Math.random() * 2000000000,
      risk: "Low",
      category: "Stableswap",
      logo: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Balancer",
      chain: "Base",
      apy: 9.5 + Math.random() * 6,
      tvl: 2500000000 + Math.random() * 1000000000,
      risk: "Medium",
      category: "DEX",
      logo: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "GMX",
      chain: "Arbitrum",
      apy: 18.0 + Math.random() * 12,
      tvl: 1200000000 + Math.random() * 500000000,
      risk: "High",
      category: "Perps",
      logo: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Lido (stETH)",
      chain: "Ethereum",
      apy: 3.5 + Math.random() * 1,
      tvl: 20000000000 + Math.random() * 5000000000,
      risk: "Low",
      category: "Staking",
      logo: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Rocket Pool",
      chain: "Ethereum",
      apy: 3.3 + Math.random() * 1.2,
      tvl: 5000000000 + Math.random() * 1000000000,
      risk: "Low",
      category: "Staking",
      logo: "/placeholder.svg?height=32&width=32",
    },
  ]

  // Sort by profit share descending
  mockProtocols.sort((a, b) => b.apy - a.apy)

  return NextResponse.json({
    protocols: mockProtocols,
    lastUpdated: new Date().toISOString(),
    totalProtocols: mockProtocols.length,
  })
}
