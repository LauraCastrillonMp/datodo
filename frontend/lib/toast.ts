import { toast as sonnerToast, type ToastT } from "sonner"

type ToastType = 'success' | 'error' | 'info' | 'warning'

export const toast = {
  success: (message: string, options?: Partial<ToastT>) => sonnerToast.success(message, options),
  error: (message: string, options?: Partial<ToastT>) => sonnerToast.error(message, options),
  info: (message: string, options?: Partial<ToastT>) => sonnerToast.info(message, options),
  warning: (message: string, options?: Partial<ToastT>) => sonnerToast.warning(message, options),
  custom: (message: string, options?: Partial<ToastT>) => sonnerToast(message, options)
} as const
