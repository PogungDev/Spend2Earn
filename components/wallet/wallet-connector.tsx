"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Wallet, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export function WalletConnector() {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [hasManuallyConnected, setHasManuallyConnected] = useState(false)

  // Auto-disconnect on mount to force manual connection
  useEffect(() => {
    if (isConnected && !hasManuallyConnected) {
      disconnect()
    }
  }, [isConnected, hasManuallyConnected, disconnect])

  const handleConnect = async () => {
    try {
      const injectedConnector = connectors.find((c) => c.id === "injected")
      if (injectedConnector) {
        await connect({ connector: injectedConnector })
        setHasManuallyConnected(true)
        toast.success("Wallet connected successfully!")
      }
    } catch (err) {
      console.error("Connection failed:", err)
      toast.error("Failed to connect wallet")
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setHasManuallyConnected(false)
    toast.info("Wallet disconnected")
  }

  if (error) {
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
        <AlertCircle className="w-3 h-3 mr-1" />
        Connection Error
      </Badge>
    )
  }

  if (isConnected && hasManuallyConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          MetaMask Connected
        </Badge>
        <Button variant="outline" size="sm" onClick={handleDisconnect} className="text-xs bg-transparent">
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      variant="outline"
      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      {isPending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
