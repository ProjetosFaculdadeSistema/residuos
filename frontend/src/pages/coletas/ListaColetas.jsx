import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ColetaService } from '../../services'
import { useApiRequest } from '../../hooks/useApiRequest'
import { ErrorMessage, useConfirm, useToast } from '../../components'

/* ── Exportação ──────────────────────────────────────── */
function exportarCSV(coletas) {
  const BOM = '﻿' // garante UTF-8 com BOM para Excel
  const cabecalho = ['Data', 'Resíduo', 'Tipo', 'Motorista', 'Veículo', 'Rota', 'Observação']
  const linhas = coletas.map(c => [
    c.dataColeta ? new Date(c.dataColeta).toLocaleDateString('pt-BR') : '',
    c.residuoNome  ?? '',
    c.residuoTipo  ?? '',
    c.motoristaNome ?? '',
    c.veiculoPlaca  ?? '',
    c.rotaNome      ?? '',
    (c.observacao   ?? '').replace(/"/g, '""'),
  ].map(v => `"${v}"`).join(';'))

  const csv    = BOM + [cabecalho.join(';'), ...linhas].join('\r\n')
  const blob   = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url    = URL.createObjectURL(blob)
  const link   = document.createElement('a')
  link.href    = url
  link.download = `coletas_${new Date().toISOString().slice(0,10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

/* ── Ícones pequenos ─────────────────────────────────── */
const IcoCalendario = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="w-3.5 h-3.5 shrink-0">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IcoUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="w-3.5 h-3.5 shrink-0">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)
const IcoTruck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="w-3.5 h-3.5 shrink-0">
    <path d="M1 3h15l3 5h3a1 1 0 0 1 1 1v5H1V3z" />
    <path d="M1 14v4a1 1 0 0 0 1 1h1.5" />
    <path d="M20.5 19H22a1 1 0 0 0 1-1v-1" />
    <circle cx="5.5" cy="19" r="2" /><circle cx="17.5" cy="19" r="2" />
  </svg>
)
const IcoRota = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="w-3.5 h-3.5 shrink-0">
    <circle cx="5" cy="6" r="2" /><circle cx="19" cy="18" r="2" />
    <path d="M5 8c0 5 4 5 8 8s7 3 7 3" />
  </svg>
)
const IcoRecycle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className="w-3.5 h-3.5 shrink-0">
    <path d="M7 19H4.5A2.5 2.5 0 0 1 2 16.5v-4A6 6 0 0 1 8 7h.5" />
    <path d="M17 19h2.5A2.5 2.5 0 0 0 22 16.5v-4A6 6 0 0 0 16 7h-.5" />
    <path d="M12 7V3M9 3h6M9 21h6M12 21v-4" />
    <path d="M7 12a5 5 0 0 0 10 0" />
  </svg>
)

/* ── Utilitários ─────────────────────────────────────── */
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function chavesMes(coletas) {
  const chaves = [...new Set(
    coletas.map(c => {
      if (!c.dataColeta) return 'Sem data'
      const d = new Date(c.dataColeta)
      return `${d.getFullYear()}-${String(d.getMonth()).padStart(2,'0')}`
    })
  )].sort((a, b) => b.localeCompare(a))
  return chaves
}

function labelMes(chave) {
  if (chave === 'Sem data') return 'Sem data'
  const [ano, mes] = chave.split('-')
  return `${MESES[Number(mes)]} ${ano}`
}

function pertenceAoMes(c, chave) {
  if (chave === 'Sem data') return !c.dataColeta
  const d = new Date(c.dataColeta)
  const k = `${d.getFullYear()}-${String(d.getMonth()).padStart(2,'0')}`
  return k === chave
}

function formataData(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

/* ── Cores por tipo de resíduo ───────────────────────── */
const badgeCorTipo = (tipo) => {
  if (!tipo) return 'badge-ghost'
  const t = tipo.toUpperCase()
  if (t.includes('ORGANICO'))  return 'badge-success'
  if (t.includes('RECICL'))    return 'badge-info'
  if (t.includes('PERIGOSO'))  return 'badge-error'
  if (t.includes('ELETR'))     return 'badge-warning'
  return 'badge-ghost'
}

/* ── Card individual da coleta ───────────────────────── */
function ColetaCard({ c, onEditar, onDeletar }) {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow transition-shadow">
      <div className="card-body p-4 gap-3">
        {/* Cabeçalho: data + badge tipo */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-base-content/60">
            <IcoCalendario />
            <span className="font-medium text-base-content">{formataData(c.dataColeta)}</span>
          </div>
          {c.residuoTipo && (
            <span className={`badge badge-sm ${badgeCorTipo(c.residuoTipo)}`}>
              {c.residuoTipo}
            </span>
          )}
        </div>

        {/* Nome do resíduo */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-success/10 rounded-lg shrink-0">
            <IcoRecycle />
          </div>
          <span className="font-semibold text-base-content truncate">
            {c.residuoNome || 'Resíduo não informado'}
          </span>
        </div>

        {/* Detalhes em grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-base-content/60 mt-1">
          <div className="flex items-center gap-1.5">
            <IcoUser />
            <span className="truncate">{c.motoristaNome || '-'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IcoTruck />
            <span className="font-mono">{c.veiculoPlaca || '-'}</span>
          </div>
          {c.rotaNome && (
            <div className="flex items-center gap-1.5 col-span-2">
              <IcoRota />
              <span className="truncate">{c.rotaNome}</span>
            </div>
          )}
        </div>

        {/* Observação */}
        {c.observacao && (
          <p className="text-xs text-base-content/50 italic border-l-2 border-base-300 pl-2 mt-1">
            {c.observacao}
          </p>
        )}

        {/* Ações */}
        <div className="flex gap-1 justify-end pt-1 border-t border-base-200 mt-1">
          <button onClick={() => onEditar(c.codigo)} className="btn btn-ghost btn-xs">Editar</button>
          <button onClick={() => onDeletar(c.codigo)} className="btn btn-ghost btn-xs text-error">Remover</button>
        </div>
      </div>
    </div>
  )
}

/* ── Página principal ────────────────────────────────── */
function ListaColetas() {
  const [coletas, setColetas] = useState([])
  const [busca, setBusca]     = useState('')
  const { loading, error, execute } = useApiRequest()
  const navigate = useNavigate()
  const confirm  = useConfirm()
  const toast    = useToast()

  useEffect(() => { carregar() }, [])

  const carregar = () => execute(async () => setColetas(await ColetaService.listarTodos()))

  const handleDeletar = async (codigo) => {
    const ok = await confirm('Remover esta coleta?', 'Esta ação não pode ser desfeita.')
    if (!ok) return
    await execute(async () => {
      await ColetaService.deletar(codigo)
      setColetas(prev => prev.filter(c => c.codigo !== codigo))
      toast('Coleta removida com sucesso')
    })
  }

  const filtradas = useMemo(() =>
    coletas.filter(c => !busca || [c.residuoNome, c.motoristaNome, c.veiculoPlaca, c.rotaNome]
      .some(v => v?.toLowerCase().includes(busca.toLowerCase()))),
    [coletas, busca]
  )

  const chaves = useMemo(() => chavesMes(filtradas), [filtradas])

  /* Resumo rápido */
  const totalMes = useMemo(() => {
    const agora = new Date()
    const chaveAtual = `${agora.getFullYear()}-${String(agora.getMonth()).padStart(2,'0')}`
    return coletas.filter(c => {
      if (!c.dataColeta) return false
      const d = new Date(c.dataColeta)
      return `${d.getFullYear()}-${String(d.getMonth()).padStart(2,'0')}` === chaveAtual
    }).length
  }, [coletas])

  if (loading && coletas.length === 0)
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Coletas</h1>
          {!loading && coletas.length > 0 && (
            <p className="text-sm text-base-content/50 mt-0.5">
              {coletas.length} coleta{coletas.length !== 1 ? 's' : ''} no total
              {totalMes > 0 && ` · ${totalMes} este mês`}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {coletas.length > 0 && (
            <>
              <button onClick={() => exportarCSV(filtradas)}
                className="btn btn-outline btn-sm gap-1.5" title="Exportar para Excel/CSV">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  className="w-3.5 h-3.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                CSV
              </button>
              <button onClick={() => window.print()}
                className="btn btn-outline btn-sm gap-1.5" title="Imprimir / salvar como PDF">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  className="w-3.5 h-3.5">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Imprimir
              </button>
            </>
          )}
          <Link to="/coletas/nova" className="btn btn-primary btn-sm">+ Nova Coleta</Link>
        </div>
      </div>

      <ErrorMessage mensagem={error} onTentar={carregar} />

      {/* Busca */}
      {coletas.length > 0 && (
        <div className="mb-6">
          <input type="text" placeholder="Buscar por resíduo, motorista, placa..."
            className="input input-bordered input-sm w-full max-w-sm"
            value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
      )}

      {/* Estado vazio */}
      {filtradas.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-base-content/60">{busca ? 'Nenhum resultado para a busca.' : 'Nenhuma coleta registrada.'}</p>
          {!busca && <Link to="/coletas/nova" className="btn btn-primary mt-4">Registrar primeira coleta</Link>}
        </div>
      )}

      {/* Timeline agrupada por mês */}
      <div className="space-y-8">
        {chaves.map(chave => {
          const grupo = filtradas.filter(c => pertenceAoMes(c, chave))
          return (
            <section key={chave}>
              {/* Cabeçalho do mês */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-semibold text-base-content">{labelMes(chave)}</h2>
                <span className="badge badge-ghost badge-sm">{grupo.length}</span>
                <div className="flex-1 border-t border-base-200" />
              </div>

              {/* Grid de cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {grupo.map(c => (
                  <ColetaCard key={c.codigo} c={c}
                    onEditar={(id) => navigate(`/coletas/${id}/editar`)}
                    onDeletar={handleDeletar} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default ListaColetas
