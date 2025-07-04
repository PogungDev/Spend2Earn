import { type NextRequest, NextResponse } from "next/server"
import { subDays, format } from "date-fns"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get("timeRange") || "30d"
  const address = searchParams.get("address")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const today = new Date()
  let startDate: Date
  let numDays: number

  switch (timeRange) {
    case "7d":
      startDate = subDays(today, 7)
      numDays = 7
      break
    case "30d":
      startDate = subDays(today, 30)
      numDays = 30
      break
    case "90d":
      startDate = subDays(today, 90)
      numDays = 90
      break
    case "1y":
      startDate = subDays(today, 365)
      numDays = 365
      break
    default:
      startDate = subDays(today, 30)
      numDays = 30
  }

  const history = []
  const marketAverage = 8.5 // Market average APY instead of specific competitor
  const baseAPY = 18.5 // YieldPay Pro's base performance

  for (let i = 0; i <= numDays; i++) {
    const currentDate = subDays(today, numDays - i)
    const dateString = format(currentDate, "MMM dd")

    // Simulate realistic APY fluctuation
    const volatility = Math.sin(i / 7) * 2 + Math.random() * 3 - 1.5
    const apy = baseAPY + volatility

    // Add some market events simulation
    let eventMultiplier = 1
    if (i > numDays * 0.7 && i < numDays * 0.8) {
      eventMultiplier = 1.15 // Bull market period
    } else if (i > numDays * 0.3 && i < numDays * 0.4) {
      eventMultiplier = 0.85 // Market correction
    }

    history.push({
      date: dateString,
      apy: Number.parseFloat((apy * eventMultiplier).toFixed(2)),
      benchmark: marketAverage, // Changed from metayieldBenchmark to marketAverage
      volume: Math.floor(Math.random() * 1000000) + 500000,
      protocols: Math.floor(Math.random() * 5) + 8,
    })
  }

  return NextResponse.json({
    data: history,
    summary: {
      averageAPY: history.reduce((sum, item) => sum + item.apy, 0) / history.length,
      bestAPY: Math.max(...history.map((item) => item.apy)),
      worstAPY: Math.min(...history.map((item) => item.apy)),
      outperformance: history[history.length - 1].apy - marketAverage, // Updated here too
    },
  })
}
