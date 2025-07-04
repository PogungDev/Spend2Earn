import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits, formatUnits } from "viem"
import { CONTRACT_ADDRESSES, SPENDING_ABI } from "@/lib/contract-abis"
import { toast } from "sonner"

export function useSpendingContract() {
  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Read cashback balance
  const { data: cashbackBalance, refetch: refetchCashback } = useReadContract({
    address: CONTRACT_ADDRESSES.SPENDING,
    abi: SPENDING_ABI,
    functionName: "getCashbackBalance",
    args: [], // Will be filled with user address
  })

  const recordSpending = async (amount: string) => {
    try {
      const amountWei = parseUnits(amount, 6) // USDC has 6 decimals

      writeContract({
        address: CONTRACT_ADDRESSES.SPENDING,
        abi: SPENDING_ABI,
        functionName: "recordSpending",
        args: [amountWei],
      })

      toast.loading("Recording spending...", { id: "spending-record" })
    } catch (error) {
      console.error("Record spending error:", error)
      toast.error("Failed to record spending")
    }
  }

  const claimCashback = async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.SPENDING,
        abi: SPENDING_ABI,
        functionName: "claimCashback",
        args: [],
      })

      toast.loading("Claiming cashback...", { id: "spending-claim" })
    } catch (error) {
      console.error("Claim cashback error:", error)
      toast.error("Failed to claim cashback")
    }
  }

  // Handle transaction confirmations
  if (isConfirmed) {
    toast.success("Transaction confirmed!", { id: "spending-record" })
    toast.success("Transaction confirmed!", { id: "spending-claim" })
    refetchCashback()
  }

  return {
    recordSpending,
    claimCashback,
    cashbackBalance: cashbackBalance ? formatUnits(cashbackBalance as bigint, 6) : "0",
    isPending,
    isConfirming,
    isConfirmed,
    refetchCashback,
  }
}
