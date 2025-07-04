import { http, createConfig } from "wagmi"
import { mainnet, sepolia, polygon, polygonMumbai } from "wagmi/chains"
import { injected, metaMask, walletConnect } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo-project-id"

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId,
      metadata: {
        name: "Spend2Earn",
        description: "Smart DeFi Credit Card",
        url: "https://spend2earn.app",
        icons: ["https://spend2earn.app/icon.png"],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
  ssr: true,
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
