"use client"

import { toast as sonnerToast, type ToastT } from "sonner"

export const useToast = () => {
  const toast = (props: Partial<ToastT> & { title?: string; description?: string; variant?: 'destructive' }) => {
    const { title, description, variant, ...options } = props
    const message = description || title || 'Notification'
    
    if (variant === 'destructive') {
      return sonnerToast.error(message, options)
    }
    
    return sonnerToast.success(message, options)
      }

  return {
    toast,
    dismiss: sonnerToast.dismiss,
    error: sonnerToast.error,
    success: sonnerToast.success,
    info: sonnerToast.info,
    warning: sonnerToast.warning
  }
}

export { toast } from 'sonner'
