import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ResiduoService, ColetaService, MotoristaService, VeiculoService, RotaService } from '../services'
import { useApiRequest } from '../hooks/useApiRequest'
import { ErrorMessage } from '../components'

/* ── Ícones SVG ──────────────────────────────────────────────────── */
const Svg = ({ children, cls = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
    className={`w-7 h-7 ${cls}`}>
    {children}
  </svg>
)

const IcoResiduos = ({ cls }) => (
  <Svg cls={cls}>
    <path d="M7 19H4.5A2.5 2.5 0 0 1 2 16.5v-4A6 6 0 0 1 8 7h.5" />
    <path d="M17 19h2.5A2.5 2.5 0 0 0 22 16.5v-4A6 6 0 0 0 16 7h-.5" />
    <path d="M12 7V3M9 3h6M9 21h6M12 21v-4" />
    <path d="M7 12a5 5 0 0 0 10 0" />
  </Svg>
)

const IcoColetas = ({ cls }) => (
  <Svg cls={cls}>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
)

const IcoMotoristas = ({ cls }) => (
  <Svg cls={cls}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </Svg>
)

const IcoVeiculos = ({ cls }) => (
  <Svg cls={cls}>
    <path d="M1 3h15l3 5h3a1 1 0 0 1 1 1v5H1V3z" />
    <path d="M1 14v4a1 1 0 0 0 1 1h1.5" />
    <path d="M20.5 19H22a1 1 0 0 0 1-1v-1" />
    <circle cx="5.5" cy="19" r="2" />
    <circle cx="17.5" cy="19" r="2" />
  </Svg>
)

const IcoRotas = ({ cls }) => (
  <Svg cls={cls}>
    <circle cx="5" cy="6" r="2" />
    <circle cx="19" cy="18" r="2" />
    <path d="M5 8c0 5 4 5 8 8s7 3 7 3" />
    <path d="M5 6h6l5-3h3" />
  </Svg>
)

const IcoMapa = ({ cls }) => (
  <Svg cls={cls}>
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </Svg>
)

/* ── Gráfico de barras ────────────────────────────────────────────── */
const MESES_ABREV = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function GraficoColetas({ coletas }) {
  // Últimos 6 meses
  const meses = []
  const agora = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
    meses.push({ ano: d.getFullYear(), mes: d.getMonth(), label: MESES_ABREV[d.getMonth()] })
  }

  const dados = meses.map(({ ano, mes, label }) => ({
    label,
    count: coletas.filter(c => {
      if (!c.dataColeta) return false
      const d = new Date(c.dataColeta)
      return d.getFullYear() === ano && d.getMonth() === mes
    }).length
  }))

  const max = Math.max(...dados.map(d => d.count), 1)

  const W = 520, H = 160, PAD = { top: 16, bottom: 28, left: 32, right: 16 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom
  const barW   = Math.floor(chartW / dados.length * 0.55)
  const gap    = chartW / dados.length

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm mt-6">
      <div className="card-body p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Coletas por mês</h2>
          <span className="text-xs text-base-content/40">Últimos 6 meses</span>
        </div>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 180 }}>
            {/* Linhas guia */}
            {[0.25, 0.5, 0.75, 1].map(frac => {
              const y = PAD.top + chartH * (1 - frac)
              return (
                <g key={frac}>
                  <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                    stroke="currentColor" strokeOpacity={0.07} strokeWidth={1} />
                  <text x={PAD.left - 4} y={y + 4} textAnchor="end"
                    fontSize={10} fill="currentColor" fillOpacity={0.35}>
                    {Math.round(max * frac)}
                  </text>
                </g>
              )
            })}

            {/* Barras */}
            {dados.map((d, i) => {
              const barH   = d.count === 0 ? 2 : Math.max(4, chartH * (d.count / max))
              const x      = PAD.left + gap * i + (gap - barW) / 2
              const y      = PAD.top + chartH - barH
              const active = i === dados.length - 1
              return (
                <g key={i}>
                  <rect x={x} y={y} width={barW} height={barH} rx={4}
                    fill={active ? '#2E7D32' : '#2E7D32'} fillOpacity={active ? 1 : 0.35} />
                  {d.count > 0 && (
                    <text x={x + barW / 2} y={y - 4} textAnchor="middle"
                      fontSize={10} fill="currentColor" fillOpacity={0.6}>
                      {d.count}
                    </text>
                  )}
                  <text x={x + barW / 2} y={H - 4} textAnchor="middle"
                    fontSize={11} fill="currentColor" fillOpacity={active ? 0.9 : 0.45}
                    fontWeight={active ? '600' : '400'}>
                    {d.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        {coletas.length === 0 && (
          <p className="text-xs text-center text-base-content/40 mt-2">Nenhuma coleta registrada ainda</p>
        )}
      </div>
    </div>
  )
}

/* ── Card ─────────────────────────────────────────────────────────── */
function StatCard({ icone, valor, label, sub, link, cor, iconCls }) {
  const content = (
    <div className={`card bg-base-100 shadow hover:shadow-md transition-all border-l-4 ${cor} group`}>
      <div className="card-body p-5">
        <div className="flex items-start justify-between">
          <div className={`p-2.5 rounded-xl ${iconCls} transition-colors`}>
            {icone}
          </div>
          <span className="text-4xl font-bold text-base-content tabular-nums">{valor}</span>
        </div>
        <p className="font-semibold text-base-content mt-3">{label}</p>
        {sub && <p className="text-xs text-base-content/50">{sub}</p>}
      </div>
    </div>
  )
  return link ? <Link to={link}>{content}</Link> : content
}

/* ── Home ─────────────────────────────────────────────────────────── */
function Home() {
  const { loading, error, execute } = useApiRequest()
  const [dados, setDados] = useState({
    residuos: [], coletas: [], motoristas: [], veiculos: [], rotas: []
  })

  useEffect(() => {
    execute(async () => {
      const [residuos, coletas, motoristas, veiculos, rotas] = await Promise.all([
        ResiduoService.listarTodos(),
        ColetaService.listarTodos(),
        MotoristaService.listarTodos(),
        VeiculoService.listarTodos(),
        RotaService.listarTodos()
      ])
      setDados({ residuos, coletas, motoristas, veiculos, rotas })
    })
  }, [])

  const totalKg         = dados.residuos.reduce((acc, r) => acc + (r.quantidade || 0), 0)
  const motoristasAtivos = dados.motoristas.filter(m => m.status === 'ATIVO').length
  const rotasComPontos  = dados.rotas.filter(r => r.pontos?.length > 0).length

  const cards = [
    {
      icone: <IcoResiduos cls="text-success" />,
      iconCls: 'bg-success/10',
      valor: dados.residuos.length,
      label: 'Resíduos cadastrados',
      sub: `${totalKg.toLocaleString('pt-BR')} kg no total`,
      link: '/residuos', cor: 'border-success',
    },
    {
      icone: <IcoColetas cls="text-info" />,
      iconCls: 'bg-info/10',
      valor: dados.coletas.length,
      label: 'Coletas registradas',
      sub: 'Histórico de operações',
      link: '/coletas', cor: 'border-info',
    },
    {
      icone: <IcoMotoristas cls="text-primary" />,
      iconCls: 'bg-primary/10',
      valor: dados.motoristas.length,
      label: 'Motoristas',
      sub: `${motoristasAtivos} ativo${motoristasAtivos !== 1 ? 's' : ''}`,
      link: '/motoristas', cor: 'border-primary',
    },
    {
      icone: <IcoVeiculos cls="text-warning" />,
      iconCls: 'bg-warning/10',
      valor: dados.veiculos.length,
      label: 'Veículos',
      sub: 'Frota cadastrada',
      link: '/veiculos', cor: 'border-warning',
    },
    {
      icone: <IcoRotas cls="text-secondary" />,
      iconCls: 'bg-secondary/10',
      valor: dados.rotas.length,
      label: 'Rotas',
      sub: `${rotasComPontos} com pontos mapeados`,
      link: '/rotas', cor: 'border-secondary',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
        <p className="text-base-content/60 mt-1">Visão geral do sistema de gerenciamento de resíduos</p>
      </div>

      <ErrorMessage mensagem={error} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card bg-base-100 shadow">
              <div className="card-body p-5 animate-pulse">
                <div className="h-10 w-10 bg-base-300 rounded-xl mb-3" />
                <div className="h-8 w-16 bg-base-300 rounded mb-2" />
                <div className="h-4 w-24 bg-base-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {cards.map((card) => <StatCard key={card.label} {...card} />)}
        </div>
      )}

      {/* Gráfico de coletas */}
      {!loading && <GraficoColetas coletas={dados.coletas} />}

      {/* Destaque — mapa */}
      {!loading && rotasComPontos > 0 && (
        <div className="mt-8 alert bg-base-100 border border-base-300 shadow">
          <div className="p-2 bg-primary/10 rounded-xl">
            <IcoMapa cls="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold">{rotasComPontos} rota{rotasComPontos !== 1 ? 's' : ''} com pontos mapeados</p>
            <p className="text-sm text-base-content/60">Visualize as rotas no mapa interativo</p>
          </div>
          <Link to="/mapa" className="btn btn-primary btn-sm">Ver mapa</Link>
        </div>
      )}

      {/* Acesso rápido */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-base-content">Acesso rápido</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/residuos/novo"   className="btn btn-outline btn-sm">+ Novo Resíduo</Link>
          <Link to="/coletas/nova"    className="btn btn-outline btn-sm">+ Nova Coleta</Link>
          <Link to="/motoristas/novo" className="btn btn-outline btn-sm">+ Novo Motorista</Link>
          <Link to="/veiculos/novo"   className="btn btn-outline btn-sm">+ Novo Veículo</Link>
          <Link to="/rotas/novo"      className="btn btn-outline btn-sm">+ Nova Rota</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
