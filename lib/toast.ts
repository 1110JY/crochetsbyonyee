import { toast as toastFn } from "@/hooks/use-toast"

// Utility functions for common toast patterns
export const toast = {
  success: (title: string, description?: string) => {
    toastFn({
      variant: "success",
      title,
      description,
    })
  },
  
  error: (title: string, description?: string) => {
    toastFn({
      variant: "error", 
      title,
      description,
    })
  },
  
  info: (title: string, description?: string) => {
    toastFn({
      variant: "default",
      title,
      description,
    })
  },
  
  // Convenience methods for common scenarios
  saved: (item = "Changes") => {
    toastFn({
      variant: "success",
      title: `${item} saved!`,
      description: "Your changes have been saved successfully.",
    })
  },
  
  deleted: (item = "Item") => {
    toastFn({
      variant: "success",
      title: `${item} deleted!`,
      description: "The item has been removed successfully.",
    })
  },
  
  failed: (action = "Operation", description = "Please try again.") => {
    toastFn({
      variant: "error",
      title: `${action} failed`,
      description,
    })
  },
}
