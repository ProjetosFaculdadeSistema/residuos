import { createContext, useContext, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

const ConfirmCtx = createContext(null)

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, message: '', submessage: '' })
  const resolveRef = useRef(null)

  const confirm = useCallback((message, submessage = '') =>
    new Promise(resolve => {
      resolveRef.current = resolve
      setState({ open: true, message, submessage })
    }), [])

  const responder = (ok) => {
    setState(s => ({ ...s, open: false }))
    resolveRef.current?.(ok)
  }

  const modal = state.open ? createPortal(
    <>
      {/* Overlay */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.35)' }}
        onClick={() => responder(false)}
      />
      {/* Caixa */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div className="bg-base-100 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
          style={{ pointerEvents: 'auto' }}>
          <div className="flex gap-3 items-start mb-4">
            <div className="p-2 bg-error/10 rounded-xl shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                className="w-5 h-5 text-error">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base">{state.message}</h3>
              {state.submessage && (
                <p className="text-sm text-base-content/60 mt-1">{state.submessage}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button className="btn btn-ghost btn-sm" onClick={() => responder(false)}>
              Cancelar
            </button>
            <button className="btn btn-error btn-sm" onClick={() => responder(true)}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  ) : null

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {modal}
    </ConfirmCtx.Provider>
  )
}

export const useConfirm = () => useContext(ConfirmCtx)
