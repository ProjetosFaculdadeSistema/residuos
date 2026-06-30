import { useState, useCallback } from 'react'

/**
 * Hook para centralizar loading e tratamento de erro em chamadas à API.
 *
 * Uso:
 *   const { loading, error, execute } = useApiRequest()
 *   await execute(() => MinhaService.listarTodos())
 */
export function useApiRequest() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const execute = useCallback(async (fn) => {
    setLoading(true)
    setError(null)
    try {
      return await fn()
    } catch (err) {
      const raw = err.response?.data
      const mensagem = (typeof raw === 'string' && raw)
        || raw?.message
        || 'Erro ao comunicar com o servidor.'
      setError(mensagem)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, setError, execute }
}
