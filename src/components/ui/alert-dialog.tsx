"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const AlertDialog = Dialog
const AlertDialogTrigger = DialogTrigger
const AlertDialogContent = DialogContent
const AlertDialogHeader = DialogHeader
const AlertDialogTitle = DialogTitle
const AlertDialogDescription = DialogDescription
const AlertDialogFooter = DialogFooter

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", ...props }, ref) => (
  <DialogClose asChild>
    <Button
      ref={ref}
      variant={variant}
      className={cn("mt-2 sm:mt-0", className)}
      {...props}
    />
  </DialogClose>
))
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
