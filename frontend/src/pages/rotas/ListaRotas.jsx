import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RotaService } from '../../services'
import { useApiRequest } from '../../hooks/useApiRequest'
import { ErrorMessage, useConfirm, useToast, Paginacao } from '../../components'

function ListaRotas() {
  const [rotas, setRotas] = useState([])
  const [busca, setBusca]   = useState('')
  const [pagina, setPagina] = useState(1)
  const POR_PAGINA = 10
  const { loading, error, execute } = useApiRequest()
  const navigate = useNavigate()
  const confirm  = useConfirm()
  const toast    = useToast()

  useEffect(() => { carregar() }, [])

  const carregar = () => execute(async () => setRotas(await RotaService.listarTodos()))

  const handleDeletar = async (codigo, nome) => {
    const ok = await confirm(`Remover rota "${nome}"?`, 'Esta ação não pode ser desfeita.')
    if (!ok) return
    await execute(async () => {
      await RotaService.deletar(codigo)
      setRotas(prev => prev.filter(r => r.codigo !== codigo))
      toast('Rota removida com sucesso')
    })
  }

  const filtrados = rotas.filter(r =>
    !busca || [r.nome, r.bairro, r.cidade].some(v => v?.toLowerCase().includes(busca.toLowerCase()))
  )
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  if (loading && rotas.length === 0)
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Rotas</h1>
        <div className="flex gap-2">
          <Link to="/mapa" className="btn btn-outline btn-sm">Ver mapa</Link>
          <Link to="/rotas/novo" className="btn btn-primary btn-sm">+ Nova Rota</Link>
        </div>
      </div>

      <ErrorMessage mensagem={error} onTentar={carregar} />

      {rotas.length > 0 && (
        <div className="mb-4">
          <input type="text" placeholder="Buscar por nome, bairro, cidade..."
            className="input input-bordered input-sm w-full max-w-xs"
            value={busca} onChange={e => { setBusca(e.target.value); setPagina(1) }} />
        </div>
      )}

      {filtrados.length === 0 && !error ? (
        <div className="text-center py-12">
          <p className="text-base-content/60">{busca ? 'Nenhum resultado para a busca.' : 'Nenhuma rota cadastrada.'}</p>
          {!busca && <Link to="/rotas/novo" className="btn btn-primary mt-4">Cadastrar primeira rota</Link>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr><th>Nome</th><th>Bairro</th><th>Cidade</th><th>Distância</th><th>Dia</th><th>Pontos</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {paginados.map(r => (
                <tr key={r.codigo}>
                  <td className="font-medium">{r.nome}</td>
                  <td>{r.bairro}</td>
                  <td>{r.cidade}</td>
                  <td>{r.distanciaKm ? `${r.distanciaKm} km` : '-'}</td>
                  <td>
                    {r.diaSemana
                      ? <span className="badge badge-outline capitalize">{r.diaSemana.toLowerCase()}</span>
                      : '-'}
                  </td>
                  <td>
                    <span className={`badge ${r.pontos?.length > 0 ? 'badge-success' : 'badge-ghost'}`}>
                      {r.pontos?.length ?? 0}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/rotas/${r.codigo}/editar`)} className="btn btn-ghost btn-xs">Editar</button>
                      <button onClick={() => handleDeletar(r.codigo, r.nome)} className="btn btn-ghost btn-xs text-error">Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Paginacao total={filtrados.length} pagina={pagina} porPagina={POR_PAGINA} onChange={setPagina} />
        </div>
      )}
    </div>
  )
}

export default ListaRotas
