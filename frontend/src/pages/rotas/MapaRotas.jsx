import { useState, useEffect } from 'react'
import { RotaService } from '../../services'
import { useApiRequest } from '../../hooks/useApiRequest'
import { ErrorMessage } from '../../components'

const CENTRO_PADRAO = [-23.0789, -52.4647]

function MapaRotas() {
  const { loading, error, execute } = useApiRequest()
  const [rotas, setRotas]          = useState([])
  const [rotaSelecionada, setRota] = useState(null)

  useEffect(() => {
    execute(async () => {
      const dados = await RotaService.listarTodos()
      const comPontos = dados.filter(r => r.pontos?.length >= 2)
      setRotas(comPontos)
      if (comPontos.length > 0) setRota(comPontos[0])
    })
  }, [])

  const pontos   = rotaSelecionada?.pontos ?? []
  const posicoes = pontos.map(p => [Number(p.latitude), Number(p.longitude)])

  const pontosComNome = pontos.map((p, i) => ({
    lat:  Number(p.latitude),
    lng:  Number(p.longitude),
    nome: p.nome || `Ponto ${i + 1}`,
  }))

  const iframeSrc = `/mapa.html?pontos=${encodeURIComponent(JSON.stringify(
    pontosComNome.length > 0 ? pontosComNome : [{ lat: CENTRO_PADRAO[0], lng: CENTRO_PADRAO[1], nome: 'Centro' }]
  ))}`

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mapa de Rotas</h1>
        <p className="text-base-content/60 mt-1">Visualize os pontos e trajetos das rotas cadastradas</p>
      </div>

      <ErrorMessage mensagem={error} />

      {loading && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      )}

      {!loading && rotas.length === 0 && !error && (
        <div className="alert bg-base-200 border border-base-300">
          <span className="text-2xl">📍</span>
          <div>
            <p className="font-semibold">Nenhuma rota com pontos mapeados</p>
            <p className="text-sm text-base-content/60">
              Cadastre uma rota com pelo menos 2 pontos de coleta para visualizá-la aqui.
            </p>
          </div>
        </div>
      )}

      {rotas.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Seletor — dropdown customizado pra mostrar o nome completo sem cortar */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="font-medium text-sm">Rota:</label>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-sm btn-outline font-normal min-w-[180px] justify-between gap-2">
                <span className="truncate">{rotaSelecionada?.nome || 'Selecione'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 9l6 6 6-6"/></svg>
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow border border-base-200 z-10 min-w-[180px] max-h-60 overflow-y-auto flex-nowrap p-1">
                {rotas.map(r => (
                  <li key={r.codigo}>
                    <button
                      className={rotaSelecionada?.codigo === r.codigo ? 'active' : ''}
                      onClick={() => { setRota(r); document.activeElement?.blur() }}
                    >
                      {r.nome || 'Sem nome'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {rotaSelecionada && (
              <span className="badge badge-primary">
                {pontos.length} ponto{pontos.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Mapa via iframe — totalmente isolado do React */}
          <div className="rounded-xl border border-base-300 overflow-hidden" style={{ height: '50vh' }}>
            <iframe
              key={rotaSelecionada?.codigo ?? 'default'}
              src={iframeSrc}
              title="Mapa de Rotas"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          </div>

          {/* Info da rota */}
          {rotaSelecionada && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-base-200 rounded-lg p-3">
                <p className="text-base-content/50">Nome</p>
                <p className="font-medium">{rotaSelecionada.nome}</p>
              </div>
              <div className="bg-base-200 rounded-lg p-3">
                <p className="text-base-content/50">Localização</p>
                <p className="font-medium">{rotaSelecionada.bairro}, {rotaSelecionada.cidade}</p>
              </div>
              {rotaSelecionada.distanciaKm && (
                <div className="bg-base-200 rounded-lg p-3">
                  <p className="text-base-content/50">Distância</p>
                  <p className="font-medium">{rotaSelecionada.distanciaKm} km</p>
                </div>
              )}
              {rotaSelecionada.diaSemana && (
                <div className="bg-base-200 rounded-lg p-3">
                  <p className="text-base-content/50">Dia</p>
                  <p className="font-medium capitalize">{rotaSelecionada.diaSemana.toLowerCase()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MapaRotas
