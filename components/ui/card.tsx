import * as React from "react"
import { cn } from "@/lib/utils"

// This is a custom Card component that extends shadcn's Card to support custom variants
// In a real project, you might extend shadcn's Card or apply these styles directly.
// For this example, we'll create a simple wrapper.

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "premium" | "gradient" | "glass"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant = "default", ...props }, ref) => {
  const baseClasses = "rounded-xl border bg-card text-card-foreground shadow-sm"
  const variantClasses = {
    default: "bg-gray-800/50 border-gray-700/50",
    premium: "bg-gradient-to-br from-purple-900/70 to-indigo-900/70 border-purple-800/50",
    gradient: "bg-gradient-to-br from-blue-900/70 to-cyan-900/70 border-blue-800/50",
    glass: "bg-white/5 backdrop-blur-lg border-white/10",
  }

  return <div ref={ref} className={cn(baseClasses, variantClasses[variant], className)} {...props} />
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
