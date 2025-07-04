import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits, formatUnits } from "viem"
import { CONTRACT_ADDRESSES, VAULT_ABI } from "@/lib/contract-abis"
import { toast } from "sonner"

export function useVaultContract() {
  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Read user balance
  const { data: userBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: VAULT_ABI,
    functionName: "getUserBalance",
    args: [], // Will be filled with user address
  })

  // Read user yield
  const { data: userYield, refetch: refetchYield } = useReadContract({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: VAULT_ABI,
    functionName: "getYield",
    args: [], // Will be filled with user address
  })

  const deposit = async (amount: string) => {
    try {
      const amountWei = parseUnits(amount, 6) // USDC has 6 decimals

      writeContract({
        address: CONTRACT_ADDRESSES.VAULT,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [amountWei],
      })

      toast.loading("Depositing to vault...", { id: "vault-deposit" })
    } catch (error) {
      console.error("Deposit error:", error)
      toast.error("Failed to deposit to vault")
    }
  }

  const withdraw = async (amount: string) => {
    try {
      const amountWei = parseUnits(amount, 6)

      writeContract({
        address: CONTRACT_ADDRESSES.VAULT,
        abi: VAULT_ABI,
        functionName: "withdraw",
        args: [amountWei],
      })

      toast.loading("Withdrawing from vault...", { id: "vault-withdraw" })
    } catch (error) {
      console.error("Withdraw error:", error)
      toast.error("Failed to withdraw from vault")
    }
  }

  const allocateToProtocol = async (protocolAddress: string, percentage: number) => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.VAULT,
        abi: VAULT_ABI,
        functionName: "allocateToProtocol",
        args: [protocolAddress as `0x${string}`, BigInt(percentage)],
      })

      toast.loading("Allocating to protocol...", { id: "vault-allocate" })
    } catch (error) {
      console.error("Allocation error:", error)
      toast.error("Failed to allocate to protocol")
    }
  }

  // Handle transaction confirmations
  if (isConfirmed) {
    toast.success("Transaction confirmed!", { id: "vault-deposit" })
    toast.success("Transaction confirmed!", { id: "vault-withdraw" })
    toast.success("Transaction confirmed!", { id: "vault-allocate" })
    refetchBalance()
    refetchYield()
  }

  return {
    deposit,
    withdraw,
    allocateToProtocol,
    userBalance: userBalance ? formatUnits(userBalance as bigint, 6) : "0",
    userYield: userYield ? formatUnits(userYield as bigint, 6) : "0",
    isPending,
    isConfirming,
    isConfirmed,
    refetchBalance,
    refetchYield,
  }
}
