export interface CreditProfile {
  userId: string
  creditScore: CreditScore
  creditLimit: CreditLimit
  availableCredit: number
  usedCredit: number
  utilizationRate: number
  paymentHistory: CreditPayment[]
  autoRepayEnabled: boolean
  vaultCollateral: VaultCollateral[]
  riskAssessment: RiskAssessment
  creditUtilization: CreditUtilization
  creditSettings: CreditSettings
  creditAnalytics: CreditAnalytics
}

export interface CreditPayment {
  id: string
  amount: number
  date: Date
  type: "manual" | "auto" | "yield-based"
  source: "wallet" | "yield" | "cashback"
  status: "completed" | "pending" | "failed"
  transactionHash?: string
}

export interface VaultCollateral {
  vaultId: string
  protocolName: string
  collateralValue: number
  ltv: number
  liquidationThreshold: number
  healthFactor: number
  yieldRate: number
  autoRepayAllocation: number
}

export interface RiskAssessment {
  overallScore: number
  factors: {
    vaultStability: number
    yieldConsistency: number
    protocolRisk: number
    marketVolatility: number
    liquidityRisk: number
  }
  recommendation: "increase" | "maintain" | "decrease"
  maxSafeCredit: number
}

export interface CreditUtilization {
  totalSpent: number
  categories: {
    category: string
    amount: number
    percentage: number
  }[]
  monthlyTrend: {
    month: string
    amount: number
  }[]
  autoRepayments: {
    date: Date
    amount: number
    source: "yield" | "cashback" | "roundup"
  }[]
}

export interface CreditSettings {
  autoRepayEnabled: boolean
  repaymentSource: "yield" | "wallet" | "mixed"
  repaymentThreshold: number
  maxUtilization: number
  alertSettings: {
    highUtilization: boolean
    lowYield: boolean
    paymentDue: boolean
  }
  emergencySettings: {
    autoLiquidateThreshold: number
    emergencyContact?: string
  }
}

export interface CreditAnalytics {
  totalSaved: number
  interestAvoided: number
  yieldGenerated: number
  automationEfficiency: number
  comparisonToTraditional: {
    traditionalInterest: number
    yieldPayInterest: number
    savings: number
    savingsPercentage: number
  }
  projections: {
    nextMonth: number
    nextYear: number
    fiveYear: number
  }
}

export interface CreditScore {
  score: number
  trend: "up" | "down" | "neutral"
  factors: {
    vaultBalance: number
    activityLevel: number
    yieldPerformance: number
    usageHistory: number
  }
  monthlyChange: number
}

export interface CreditLimit {
  total: number
  used: number
  breakdown: {
    vaultBased: number
    activityBased: number
  }
  usageFeeRate: number
}

export interface RepaymentSettings {
  autoRepayEnabled: boolean
  repaymentThreshold: number
  repaymentAmount: number
}
