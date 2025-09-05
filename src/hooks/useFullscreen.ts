'use client'

import { useState, useEffect, useCallback } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if fullscreen is supported
    setIsSupported(
      !!(document.fullscreenEnabled || 
         (document as Document & { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled || 
         (document as Document & { mozFullScreenEnabled?: boolean }).mozFullScreenEnabled || 
         (document as Document & { msFullscreenEnabled?: boolean }).msFullscreenEnabled)
    )

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
          const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
      (document as Document & { mozFullScreenElement?: Element }).mozFullScreenElement ||
      (document as Document & { msFullscreenElement?: Element }).msFullscreenElement
    )
      setIsFullscreen(isCurrentlyFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const enterFullscreen = useCallback(async () => {
    if (!isSupported) return false

    try {
      const element = document.documentElement
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if ((element as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (element as HTMLElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen()
      } else if ((element as HTMLElement & { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
        await (element as HTMLElement & { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen()
      } else if ((element as HTMLElement & { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
        await (element as HTMLElement & { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen()
      }
      return true
    } catch (error) {
      console.error('Error entering fullscreen:', error)
      return false
    }
  }, [isSupported])

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen()
      } else if ((document as Document & { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen) {
        await (document as Document & { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen()
      } else if ((document as Document & { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
        await (document as Document & { msExitFullscreen: () => Promise<void> }).msExitFullscreen()
      }
      return true
    } catch (error) {
      console.error('Error exiting fullscreen:', error)
      return false
    }
  }, [])

  return {
    isFullscreen,
    isSupported,
    enterFullscreen,
    exitFullscreen
  }
}
