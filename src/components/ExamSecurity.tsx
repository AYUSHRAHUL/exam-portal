'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useTabLock } from '@/hooks/useTabLock'
import { AlertTriangle, Monitor, Lock, Eye } from 'lucide-react'

interface ExamSecurityProps {
  isActive: boolean
  onSecurityViolation?: () => void
  onAutoSubmit?: () => void
  maxTabSwitches?: number
}

export function ExamSecurity({ 
  isActive, 
  onSecurityViolation, 
  onAutoSubmit,
  maxTabSwitches = 3 
}: ExamSecurityProps) {
  const [showFullscreenModal, setShowFullscreenModal] = useState(false)
  const [showTabSwitchModal, setShowTabSwitchModal] = useState(false)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [violationCount, setViolationCount] = useState(0)
  
  const { isFullscreen, isSupported, enterFullscreen } = useFullscreen()
  
  const { isLocked } = useTabLock({
    onTabSwitch: () => {
      setTabSwitchCount(prev => prev + 1)
      setShowTabSwitchModal(true)
    },
    onWindowBlur: () => {
      setViolationCount(prev => prev + 1)
    },
    maxTabSwitches,
    warningThreshold: 1
  })

  useEffect(() => {
    if (isActive && !isFullscreen && isSupported) {
      setShowFullscreenModal(true)
    }
  }, [isActive, isFullscreen, isSupported])

  useEffect(() => {
    if (isActive) {
      document.body.classList.add('exam-security-active')
    } else {
      document.body.classList.remove('exam-security-active')
    }

    return () => {
      document.body.classList.remove('exam-security-active')
    }
  }, [isActive])

  useEffect(() => {
    if (isLocked && onAutoSubmit) {
      // Auto-submit exam after maximum violations
      setTimeout(() => {
        onAutoSubmit()
      }, 2000)
    }
  }, [isLocked, onAutoSubmit])

  const handleEnterFullscreen = async () => {
    const success = await enterFullscreen()
    if (success) {
      setShowFullscreenModal(false)
    } else {
      alert('Failed to enter fullscreen mode. Please allow fullscreen access.')
    }
  }

  const handleTabSwitchAcknowledge = () => {
    setShowTabSwitchModal(false)
    if (violationCount >= maxTabSwitches) {
      onSecurityViolation?.()
    }
  }


  if (!isActive) return null

  return (
    <>
      {/* Fullscreen Required Modal */}
      <Modal
        isOpen={showFullscreenModal}
        onClose={() => {}} // Prevent closing
        title="Fullscreen Mode Required"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-amber-600">
            <Monitor className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Fullscreen Mode Required</h3>
              <p className="text-sm text-gray-600">
                For security purposes, you must enter fullscreen mode to take this exam.
              </p>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">Security Notice:</p>
                <ul className="text-amber-700 space-y-1">
                  <li>• Switching tabs or windows is monitored</li>
                  <li>• Right-click and keyboard shortcuts are disabled</li>
                  <li>• Maximum {maxTabSwitches} tab switches allowed</li>
                  <li>• Exam will auto-submit if violations exceed limit</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleEnterFullscreen} size="lg">
              Enter Fullscreen Mode
            </Button>
          </div>
        </div>
      </Modal>

      {/* Tab Switch Warning Modal */}
      <Modal
        isOpen={showTabSwitchModal}
        onClose={() => {}} // Prevent closing
        title="Tab Switch Detected"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-red-600">
            <Eye className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Tab Switch Detected</h3>
              <p className="text-sm text-gray-600">
                You have switched tabs or windows during the exam.
              </p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800 mb-1">Violation Details:</p>
                <ul className="text-red-700 space-y-1">
                  <li>• Tab switches: {tabSwitchCount} / {maxTabSwitches}</li>
                  <li>• Remaining switches: {Math.max(0, maxTabSwitches - tabSwitchCount)}</li>
                  {tabSwitchCount >= maxTabSwitches && (
                    <li className="font-bold">• Exam will be auto-submitted!</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleTabSwitchAcknowledge}
              variant={tabSwitchCount >= maxTabSwitches ? "danger" : "primary"}
              size="lg"
            >
              {tabSwitchCount >= maxTabSwitches ? 'Acknowledge & Continue' : 'I Understand'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Security Status Bar */}
      {isActive && (
        <div className="security-banner">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Exam Security Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span className={`text-sm px-2 py-1 rounded ${
                  isFullscreen ? 'fullscreen-indicator' : 'bg-yellow-600'
                }`}>
                  {isFullscreen ? 'Fullscreen Mode' : 'Fullscreen Required'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                Tab Switches: <span className={`tab-counter ${
                  tabSwitchCount >= maxTabSwitches ? 'bg-red-600' : ''
                }`}>
                  {tabSwitchCount}/{maxTabSwitches}
                </span>
              </div>
              {violationCount > 0 && (
                <div className="text-sm">
                  Violations: <span className="font-bold text-yellow-300">{violationCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
