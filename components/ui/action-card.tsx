"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ActionCardProps {
  title: string
  description: string
  action: string
  onAction: () => void
  icon?: React.ReactNode
  variant?: "default" | "outline"
  className?: string
}

export function ActionCard({
  title,
  description,
  action,
  onAction,
  icon,
  variant = "default",
  className,
}: ActionCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onAction} variant={variant} className="w-full">
          {action}
        </Button>
      </CardContent>
    </Card>
  )
}
