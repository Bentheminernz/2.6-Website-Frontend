import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      ...toast,
      duration: 5000,
    }

    toasts.value.push(newToast)

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
    console.log(`Toast added: ${newToast.message} (ID: ${id})`)

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  const showSuccess = (message: string, duration?: number) => {
    return addToast({ message, type: 'success', duration })
  }

  const showError = (message: string, duration?: number) => {
    return addToast({ message, type: 'error', duration })
  }

  const showInfo = (message: string, duration?: number) => {
    return addToast({ message, type: 'info', duration })
  }

  const showWarning = (message: string, duration?: number) => {
    return addToast({ message, type: 'warning', duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
})
