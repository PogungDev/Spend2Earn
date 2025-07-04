import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits, formatUnits } from "viem"
import { CONTRACT_ADDRESSES, CREDIT_ABI } from "@/lib/contract-abis"
import { toast } from "sonner"

export function useCreditContract() {
  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Read credit limit
  const { data: creditLimit, refetch: refetchCreditLimit } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT,
    abi: CREDIT_ABI,
    functionName: "getCreditLimit",
    args: [], // Will be filled with user address
  })

  // Read borrowed amount
  const { data: borrowedAmount, refetch: refetchBorrowedAmount } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT,
    abi: CREDIT_ABI,
    functionName: "getBorrowedAmount",
    args: [], // Will be filled with user address
  })

  const borrow = async (amount: string) => {
    try {
      const amountWei = parseUnits(amount, 6) // USDC has 6 decimals

      writeContract({
        address: CONTRACT_ADDRESSES.CREDIT,
        abi: CREDIT_ABI,
        functionName: "borrow",
        args: [amountWei],
      })

      toast.loading("Processing borrow request...", { id: "credit-borrow" })
    } catch (error) {
      console.error("Borrow error:", error)
      toast.error("Failed to borrow")
    }
  }

  const repay = async (amount: string) => {
    try {
      const amountWei = parseUnits(amount, 6)

      writeContract({
        address: CONTRACT_ADDRESSES.CREDIT,
        abi: CREDIT_ABI,
        functionName: "repay",
        args: [amountWei],
      })

      toast.loading("Processing repayment...", { id: "credit-repay" })
    } catch (error) {
      console.error("Repay error:", error)
      toast.error("Failed to repay")
    }
  }

  // Handle transaction confirmations
  if (isConfirmed) {
    toast.success("Transaction confirmed!", { id: "credit-borrow" })
    toast.success("Transaction confirmed!", { id: "credit-repay" })
    refetchCreditLimit()
    refetchBorrowedAmount()
  }

  return {
    borrow,
    repay,
    creditLimit: creditLimit ? formatUnits(creditLimit as bigint, 6) : "0",
    borrowedAmount: borrowedAmount ? formatUnits(borrowedAmount as bigint, 6) : "0",
    isPending,
    isConfirming,
    isConfirmed,
    refetchCreditLimit,
    refetchBorrowedAmount,
  }
}
