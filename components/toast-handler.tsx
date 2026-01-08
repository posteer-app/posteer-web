'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ToastHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    // Handle success toasts
    const successMessage = searchParams.get('toast')
    if (successMessage) {
      toast.success(successMessage)
      
      // Remove the toast parameter from URL without triggering a page reload
      const url = new URL(window.location.href)
      url.searchParams.delete('toast')
      router.replace(url.pathname + url.search, { scroll: false })
    }

    // Handle error toasts
    const errorMessage = searchParams.get('error_toast')
    if (errorMessage) {
      toast.error(errorMessage)
      
      // Remove the error_toast parameter from URL without triggering a page reload
      const url = new URL(window.location.href)
      url.searchParams.delete('error_toast')
      router.replace(url.pathname + url.search, { scroll: false })
    }

    // Handle info toasts
    const infoMessage = searchParams.get('info_toast')
    if (infoMessage) {
      toast.info(infoMessage)
      
      // Remove the info_toast parameter from URL without triggering a page reload
      const url = new URL(window.location.href)
      url.searchParams.delete('info_toast')
      router.replace(url.pathname + url.search, { scroll: false })
    }

    // Handle warning toasts
    const warningMessage = searchParams.get('warning_toast')
    if (warningMessage) {
      toast.warning(warningMessage)
      
      // Remove the warning_toast parameter from URL without triggering a page reload
      const url = new URL(window.location.href)
      url.searchParams.delete('warning_toast')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [searchParams, router])

  return null
}