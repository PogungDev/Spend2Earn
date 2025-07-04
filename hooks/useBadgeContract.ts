import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, BADGE_ABI } from "@/lib/contract-abis"
import { formatUnits } from "viem"

export function useBadgeContract(userAddress?: string) {
  // Read user badge tier
  const { data: badgeTier, refetch: refetchBadge } = useReadContract({
    address: CONTRACT_ADDRESSES.BADGE,
    abi: BADGE_ABI,
    functionName: "getUserBadge",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
  })

  // Read total spending
  const { data: totalSpending, refetch: refetchSpending } = useReadContract({
    address: CONTRACT_ADDRESSES.BADGE,
    abi: BADGE_ABI,
    functionName: "getTotalSpending",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
  })

  const getBadgeName = (tier: number) => {
    switch (tier) {
      case 0:
        return "Unverified"
      case 1:
        return "Verified"
      case 2:
        return "Silver"
      case 3:
        return "Gold"
      default:
        return "Unknown"
    }
  }

  const getNextThreshold = (tier: number) => {
    switch (tier) {
      case 0:
        return "100" // $100 for Verified
      case 1:
        return "500" // $500 for Silver
      case 2:
        return "1000" // $1000 for Gold
      case 3:
        return "MAX" // Already at max
      default:
        return "0"
    }
  }

  return {
    badgeTier: badgeTier ? Number(badgeTier) : 0,
    badgeName: getBadgeName(badgeTier ? Number(badgeTier) : 0),
    totalSpending: totalSpending ? formatUnits(totalSpending as bigint, 6) : "0",
    nextThreshold: getNextThreshold(badgeTier ? Number(badgeTier) : 0),
    refetchBadge,
    refetchSpending,
  }
}
