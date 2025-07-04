import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency values
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format large numbers with abbreviations
export function formatNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B"
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M"
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K"
  }
  return num.toString()
}

// Format percentage values
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

// Format dates
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  return formatDate(date)
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

// Truncate wallet address
export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Sleep function for delays
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Calculate APY from APR
export function aprToApy(apr: number, compoundingFrequency = 365): number {
  return Math.pow(1 + apr / compoundingFrequency, compoundingFrequency) - 1
}

// Calculate compound interest
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  compoundingFrequency = 365,
): number {
  return principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * time)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate Ethereum address
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Convert wei to ether
export function weiToEther(wei: string | number): number {
  return Number(wei) / 1e18
}

// Convert ether to wei
export function etherToWei(ether: number): string {
  return (ether * 1e18).toString()
}

// Get color based on value change
export function getChangeColor(value: number): string {
  if (value > 0) return "text-green-600"
  if (value < 0) return "text-red-600"
  return "text-gray-600"
}

// Get badge color based on tier
export function getBadgeColor(tier: string): string {
  switch (tier.toLowerCase()) {
    case "unverified":
      return "bg-gray-100 text-gray-800"
    case "verified":
      return "bg-orange-100 text-orange-800"
    case "silver master":
      return "bg-gray-100 text-gray-800"
    case "gold master":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Calculate credit utilization
export function calculateCreditUtilization(used: number, limit: number): number {
  if (limit === 0) return 0
  return (used / limit) * 100
}

// Get risk level based on utilization
export function getRiskLevel(utilization: number): {
  level: string
  color: string
  description: string
} {
  if (utilization < 30) {
    return {
      level: "Low",
      color: "text-green-600",
      description: "Excellent credit management",
    }
  }
  if (utilization < 60) {
    return {
      level: "Medium",
      color: "text-yellow-600",
      description: "Good credit usage",
    }
  }
  if (utilization < 80) {
    return {
      level: "High",
      color: "text-orange-600",
      description: "Consider reducing usage",
    }
  }
  return {
    level: "Very High",
    color: "text-red-600",
    description: "High risk - reduce immediately",
  }
}

// Format transaction hash
export function formatTxHash(hash: string): string {
  return truncateAddress(hash, 8, 6)
}

// Get protocol icon
export function getProtocolIcon(protocol: string): string {
  const icons: Record<string, string> = {
    aave: "🏦",
    compound: "🏛️",
    yearn: "🌾",
    curve: "🌊",
    convex: "⚡",
    lido: "🔥",
    pendle: "📈",
    balancer: "⚖️",
    uniswap: "🦄",
    sushiswap: "🍣",
  }
  return icons[protocol.toLowerCase()] || "🔗"
}

// Get chain name
export function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: "Ethereum",
    137: "Polygon",
    42161: "Arbitrum",
    10: "Optimism",
    56: "BSC",
    43114: "Avalanche",
    250: "Fantom",
  }
  return chains[chainId] || `Chain ${chainId}`
}

// Local storage helpers
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage:`, error)
    return defaultValue
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage:`, error)
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage:`, error)
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
    return false
  }
}

// Download data as JSON
export function downloadJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Check if mobile device
export function isMobile(): boolean {
  if (typeof window === "undefined") return false
  return window.innerWidth < 768
}

// Get device type
export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop"

  const width = window.innerWidth
  if (width < 768) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}
