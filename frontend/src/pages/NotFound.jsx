import { Link, useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-8">
      {/* Ilustração SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160"
        className="w-64 h-auto mb-6 text-primary" fill="none">
        {/* Lixeira tombada */}
        <rect x="60" y="80" width="80" height="60" rx="6"
          stroke="currentColor" strokeWidth="4" strokeOpacity=".3" fill="currentColor" fillOpacity=".05" />
        <rect x="55" y="74" width="90" height="14" rx="4"
          stroke="currentColor" strokeWidth="3" strokeOpacity=".4" fill="currentColor" fillOpacity=".08" />
        {/* Tampa caída */}
        <rect x="48" y="56" width="90" height="14" rx="4"
          transform="rotate(-20 48 56)"
          stroke="currentColor" strokeWidth="3" strokeOpacity=".5" fill="currentColor" fillOpacity=".08" />
        {/* Linhas de cheiro / ponto de interrogação */}
        <text x="170" y="70" fontSize="52" fontWeight="800" fill="currentColor" fillOpacity=".12"
          fontFamily="monospace">?</text>
        {/* Recicle icon pequeno */}
        <g transform="translate(86,95)" stroke="currentColor" strokeWidth="2.5" strokeOpacity=".4"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9H1.5A2.5 2.5 0 0 1-.5 6.5v-2A5 5 0 0 1 4 0h.3" />
          <path d="M10 9h1.5A2.5 2.5 0 0 0 14 6.5v-2A5 5 0 0 0 9 0h-.3" />
          <path d="M6.5 0V-2M5-2h3M5 10h3M6.5 10V8" />
          <path d="M3.5 4.5a4 4 0 0 0 8 0" />
        </g>
      </svg>

      {/* Texto */}
      <p className="text-8xl font-black text-primary/15 select-none leading-none">404</p>
      <h1 className="text-2xl font-bold mt-3 text-base-content">Página não encontrada</h1>
      <p className="text-base-content/50 mt-2 max-w-xs text-center text-sm">
        O endereço que você acessou não existe ou foi movido.
      </p>

      {/* Ações */}
      <div className="flex gap-3 mt-8">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
          ← Voltar
        </button>
        <Link to="/" className="btn btn-primary btn-sm">
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound
