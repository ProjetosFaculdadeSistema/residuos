/**
 * Paginação reutilizável.
 * Props: total, pagina (começa em 1), porPagina, onChange(novaPagina)
 */
export function Paginacao({ total, pagina, porPagina, onChange }) {
  const totalPaginas = Math.ceil(total / porPagina)
  if (totalPaginas <= 1) return null

  const delta = 1
  const nums = []
  for (let i = 1; i <= totalPaginas; i++) {
    if (i === 1 || i === totalPaginas || (i >= pagina - delta && i <= pagina + delta)) {
      nums.push(i)
    }
  }

  const itens = []
  let prev = null
  for (const n of nums) {
    if (prev !== null && n - prev > 1) itens.push(null) // reticências
    itens.push(n)
    prev = n
  }

  const inicio = Math.min((pagina - 1) * porPagina + 1, total)
  const fim    = Math.min(pagina * porPagina, total)

  return (
    <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
      <p className="text-xs text-base-content/50">
        {inicio}–{fim} de {total} {total === 1 ? 'item' : 'itens'}
      </p>
      <div className="join">
        <button className="join-item btn btn-xs btn-ghost"
          disabled={pagina === 1} onClick={() => onChange(pagina - 1)}>«</button>

        {itens.map((p, i) =>
          p === null
            ? <button key={`e${i}`} className="join-item btn btn-xs btn-ghost" disabled>…</button>
            : <button key={p} onClick={() => onChange(p)}
                className={`join-item btn btn-xs ${p === pagina ? 'btn-primary' : 'btn-ghost'}`}>
                {p}
              </button>
        )}

        <button className="join-item btn btn-xs btn-ghost"
          disabled={pagina === totalPaginas} onClick={() => onChange(pagina + 1)}>»</button>
      </div>
    </div>
  )
}
