'use client'

import { useEffect, useCallback, useRef } from 'react'

interface TabLockOptions {
  onTabSwitch?: () => void
  onWindowBlur?: () => void
  onWindowFocus?: () => void
  maxTabSwitches?: number
  warningThreshold?: number
}

export function useTabLock(options: TabLockOptions = {}) {
  const {
    onTabSwitch,
    onWindowBlur,
    onWindowFocus,
    maxTabSwitches = 3,
    warningThreshold = 1
  } = options

  const tabSwitchCount = useRef(0)
  const isLocked = useRef(false)
  const warningShown = useRef(false)

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // Tab or window is hidden
      tabSwitchCount.current += 1
      onTabSwitch?.()
      onWindowBlur?.()

      if (tabSwitchCount.current >= maxTabSwitches) {
        isLocked.current = true
        // You can implement auto-submit or warning here
        console.warn('Maximum tab switches exceeded')
      } else if (tabSwitchCount.current >= warningThreshold && !warningShown.current) {
        warningShown.current = true
        alert(`Warning: You have switched tabs ${tabSwitchCount.current} times. Maximum allowed: ${maxTabSwitches}`)
      }
    } else {
      // Tab or window is visible
      onWindowFocus?.()
    }
  }, [onTabSwitch, onWindowBlur, onWindowFocus, maxTabSwitches, warningThreshold])

  const handleWindowBlur = useCallback(() => {
    onWindowBlur?.()
  }, [onWindowBlur])

  const handleWindowFocus = useCallback(() => {
    onWindowFocus?.()
  }, [onWindowFocus])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent common shortcuts
    const forbiddenKeys = [
      'F11', // Fullscreen toggle
      'F12', // Developer tools
      'Ctrl+Shift+I', // Developer tools
      'Ctrl+Shift+J', // Console
      'Ctrl+U', // View source
      'Ctrl+S', // Save
      'Ctrl+P', // Print
      'Ctrl+Shift+P', // Command palette
      'Alt+Tab', // Switch applications
      'Ctrl+Tab', // Switch tabs
      'Ctrl+W', // Close tab
      'Ctrl+T', // New tab
      'Ctrl+N', // New window
      'Ctrl+Shift+N', // Incognito window
    ]

    const keyCombo = event.ctrlKey 
      ? `Ctrl+${event.key}` 
      : event.shiftKey 
      ? `Shift+${event.key}` 
      : event.altKey 
      ? `Alt+${event.key}` 
      : event.key

    if (forbiddenKeys.includes(keyCombo) || forbiddenKeys.includes(event.key)) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }, [])

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault()
    return false
  }, [])

  const handleSelectStart = useCallback((event: Event) => {
    event.preventDefault()
    return false
  }, [])

  const handleDragStart = useCallback((event: Event) => {
    event.preventDefault()
    return false
  }, [])

  useEffect(() => {
    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)

    // Disable text selection
    document.body.style.userSelect = 'none'
    ;(document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = 'none'
    ;(document.body.style as CSSStyleDeclaration & { mozUserSelect?: string }).mozUserSelect = 'none'
    ;(document.body.style as CSSStyleDeclaration & { msUserSelect?: string }).msUserSelect = 'none'

    // Disable drag and drop
    ;(document.body.style as CSSStyleDeclaration & { webkitUserDrag?: string }).webkitUserDrag = 'none'
    ;(document.body.style as CSSStyleDeclaration & { khtmlUserDrag?: string }).khtmlUserDrag = 'none'
    ;(document.body.style as CSSStyleDeclaration & { mozUserDrag?: string }).mozUserDrag = 'none'
    ;(document.body.style as CSSStyleDeclaration & { oUserDrag?: string }).oUserDrag = 'none'
    ;(document.body.style as CSSStyleDeclaration & { userDrag?: string }).userDrag = 'none'

    return () => {
      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('focus', handleWindowFocus)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)

      // Re-enable text selection
      document.body.style.userSelect = ''
      ;(document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string }).webkitUserSelect = ''
      ;(document.body.style as CSSStyleDeclaration & { mozUserSelect?: string }).mozUserSelect = ''
      ;(document.body.style as CSSStyleDeclaration & { msUserSelect?: string }).msUserSelect = ''

      // Re-enable drag and drop
      ;(document.body.style as CSSStyleDeclaration & { webkitUserDrag?: string }).webkitUserDrag = ''
      ;(document.body.style as CSSStyleDeclaration & { khtmlUserDrag?: string }).khtmlUserDrag = ''
      ;(document.body.style as CSSStyleDeclaration & { mozUserDrag?: string }).mozUserDrag = ''
      ;(document.body.style as CSSStyleDeclaration & { oUserDrag?: string }).oUserDrag = ''
      ;(document.body.style as CSSStyleDeclaration & { userDrag?: string }).userDrag = ''
    }
  }, [
    handleVisibilityChange,
    handleWindowBlur,
    handleWindowFocus,
    handleKeyDown,
    handleContextMenu,
    handleSelectStart,
    handleDragStart
  ])

  const resetTabSwitchCount = useCallback(() => {
    tabSwitchCount.current = 0
    warningShown.current = false
    isLocked.current = false
  }, [])

  return {
    tabSwitchCount: tabSwitchCount.current,
    isLocked: isLocked.current,
    resetTabSwitchCount
  }
}
