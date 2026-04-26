import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const LeadModalContext = createContext(null)

export function LeadModalProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [presetService, setPresetService] = useState('')

  const openModal = useCallback((serviceTitle = '') => {
    setPresetService(serviceTitle || '')
    setOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setOpen(false)
    setPresetService('')
  }, [])

  const value = useMemo(
    () => ({ open, openModal, closeModal, presetService }),
    [open, openModal, closeModal, presetService],
  )

  return <LeadModalContext.Provider value={value}>{children}</LeadModalContext.Provider>
}

export function useLeadModal() {
  const ctx = useContext(LeadModalContext)
  if (!ctx) throw new Error('useLeadModal outside LeadModalProvider')
  return ctx
}
