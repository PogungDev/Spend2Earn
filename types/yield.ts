export interface Protocol {
  name: string
  chain: string
  apy: number
  tvl: number
  risk: "Low" | "Medium" | "High"
  category: string
  logo: string
}

export interface YieldData {
  date: string
  apy: number
  benchmark: number
  volume?: number
  protocols?: number
}

export interface AllocationData {
  name: string
  value: number
  color: string
  apy: number
  amount: number
}

export interface OptimizationResult {
  originalAPY: number
  optimizedAPY: number
  improvement: number
  allocations: Array<{
    protocol: string
    percentage: number
    apy: number
    amount: string
  }>
  expectedYearlyProfit: string
  riskScore: string
  txHash: string
  recommendations: string[]
}
