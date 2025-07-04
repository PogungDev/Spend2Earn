export interface JourneyStep {
  id: string
  title: string
  description: string
  completed: boolean
  path?: string
}

export const journeySteps: JourneyStep[] = [
  {
    id: "connect_wallet",
    title: "Connect Wallet",
    description: "Connect your Web3 wallet to get started",
    completed: false,
    path: "/",
  },
  {
    id: "allocate_assets",
    title: "Allocate Assets",
    description: "Set up your yield farming strategy",
    completed: false,
    path: "/allocation",
  },
  {
    id: "setup_routing",
    title: "Setup Routing",
    description: "Configure cross-chain routing",
    completed: false,
    path: "/routing",
  },
  {
    id: "enable_credit",
    title: "Enable Credit",
    description: "Set up vault-backed credit line",
    completed: false,
    path: "/credit",
  },
  {
    id: "activity_log",
    title: "Activity Log",
    description: "Review your transaction history",
    completed: false,
    path: "/log",
  },
  {
    id: "mint_badge",
    title: "Mint Badge",
    description: "Claim your achievement badge",
    completed: false,
    path: "/badge",
  },
]

export function getStepProgress(completedSteps: string[]): number {
  return (completedSteps.length / journeySteps.length) * 100
}

export function getNextStep(completedSteps: string[]): JourneyStep | undefined {
  return journeySteps.find((step) => !completedSteps.includes(step.id))
}
