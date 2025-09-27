"use client";
// lib/toasts.tsx
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export function showSuccessToast(
  title: string = "Success",
  message: string = "Your action was completed successfully."
) {
  toast.success(<div className="pl-3">{title}</div>, {
    description: <div className="pl-3">{message}</div>,
    icon: <CheckCircle2 className="text-green-600 " />,
    duration: 4000,
  });
}
export function showErrorToast(description: string = "Something went wrong.") {
  toast.error(<div className="pl-3">Something went wrong</div>, {
    description: <div className="pl-3">{description}</div>,
    icon: <AlertTriangle className="text-red-500 " />,
    duration: 5000,
  });
}

export function showLoadingToast(
  title: string = "Loading",
  message: string = "Please wait while we process your request..."
) {
  const id = toast.loading(<div className="pl-3">{title}</div>, {
    description: <div className="pl-3">{message}</div>,
    icon: <Loader2 className="animate-spin text-blue-500" />,
    duration: Infinity, // stays until dismissed or updated
  });

  return id; // so you can dismiss or update it later
}
