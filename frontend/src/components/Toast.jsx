import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

const icons = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className="w-5 h-5 shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className="w-5 h-5 shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className="w-5 h-5 shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const typeClass = {
    success: 'alert-success',
    error:   'alert-error',
    info:    'alert-info',
  }

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {toasts.length > 0 && (
        <div className="toast toast-end toast-bottom z-[9999] gap-2 pb-4 pr-4">
          {toasts.map(t => (
            <div key={t.id}
              className={`alert ${typeClass[t.type] ?? 'alert-success'} shadow-lg text-sm max-w-sm
                animate-[fadeInUp_0.25s_ease]`}>
              {icons[t.type] ?? icons.success}
              <span>{t.msg}</span>
            </div>
          ))}
        </div>
      )}
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
