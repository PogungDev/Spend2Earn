export interface AIInsight {
  id: string
  title: string
  description: string
  confidence: number
  category: "optimization" | "risk" | "opportunity"
  actionable: boolean
  actions?: AIAction[]
  createdAt: Date
  expiresAt?: Date
}

export interface AIAction {
  id: string
  type: "rebalance" | "bridge" | "adjust_credit" | "stake" | "unstake"
  description: string
  estimatedGas: number
  estimatedTime: number
  expectedBenefit: number
  riskLevel: number
  autoExecutable: boolean
  parameters: Record<string, any>
}

export interface AIOptimization {
  currentPerformance: {
    apy: number
    risk: number
    efficiency: number
  }
  optimizedPerformance: {
    apy: number
    risk: number
    efficiency: number
  }
  improvements: {
    apyIncrease: number
    riskReduction: number
    efficiencyGain: number
  }
  recommendations: AIRecommendation[]
  confidence: number
}

export interface AIRecommendation {
  id: string
  type: "yield" | "credit" | "risk"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  effort: "high" | "medium" | "low"
  priority?: number
  expectedBenefit?: number
  cost?: number
  timeframe?: string
  complexity?: "simple" | "moderate" | "complex"
  steps?: string[]
  risks?: string[]
  alternatives?: AIRecommendation[]
}

export interface AIMarketAnalysis {
  marketConditions: {
    overall: "bullish" | "bearish" | "neutral"
    defi: "bullish" | "bearish" | "neutral"
    stablecoins: "stable" | "volatile"
  }
  yieldTrends: {
    direction: "increasing" | "decreasing" | "stable"
    protocols: {
      name: string
      trend: "up" | "down" | "stable"
      confidence: number
    }[]
  }
  riskFactors: {
    factor: string
    level: "low" | "medium" | "high"
    impact: string
  }[]
  opportunities: {
    protocol: string
    opportunity: string
    timeframe: string
    confidence: number
  }[]
}

export interface AIPersonalization {
  userId: string
  riskTolerance: number
  yieldPreference: number
  automationLevel: number
  learningData: {
    preferredProtocols: string[]
    avoidedProtocols: string[]
    typicalTransactionSize: number
    activityPatterns: Record<string, number>
  }
  adaptiveSettings: {
    autoRebalanceThreshold: number
    riskAdjustmentFactor: number
    yieldOptimizationAggression: number
  }
}
