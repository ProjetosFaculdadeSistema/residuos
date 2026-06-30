import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { VeiculoService } from '../../services'
import { useApiRequest } from '../../hooks/useApiRequest'
import { ErrorMessage, useConfirm, useToast, Paginacao } from '../../components'

function ListaVeiculos() {
  const [veiculos, setVeiculos] = useState([])
  const [busca, setBusca]       = useState('')
  const [pagina, setPagina]     = useState(1)
  const POR_PAGINA = 10
  const { loading, error, execute } = useApiRequest()
  const navigate = useNavigate()
  const confirm  = useConfirm()
  const toast    = useToast()

  useEffect(() => { carregar() }, [])

  const carregar = () => execute(async () => setVeiculos(await VeiculoService.listarTodos()))

  const handleDeletar = async (codigo, placa) => {
    const ok = await confirm(`Remover veículo "${placa}"?`, 'Esta ação não pode ser desfeita.')
    if (!ok) return
    await execute(async () => {
      await VeiculoService.deletar(codigo)
      setVeiculos(prev => prev.filter(v => v.codigo !== codigo))
      toast('Veículo removido com sucesso')
    })
  }

  const filtrados = veiculos.filter(v =>
    !busca || [v.placa, v.modelo, v.tipo].some(x => x?.toLowerCase().includes(busca.toLowerCase()))
  )
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  if (loading && veiculos.length === 0)
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Veículos</h1>
        <Link to="/veiculos/novo" className="btn btn-primary btn-sm">+ Novo Veículo</Link>
      </div>

      <ErrorMessage mensagem={error} onTentar={carregar} />

      {veiculos.length > 0 && (
        <div className="mb-4">
          <input type="text" placeholder="Buscar por placa, modelo..."
            className="input input-bordered input-sm w-full max-w-xs"
            value={busca} onChange={e => { setBusca(e.target.value); setPagina(1) }} />
        </div>
      )}

      {filtrados.length === 0 && !error ? (
        <div className="text-center py-12">
          <p className="text-base-content/60">{busca ? 'Nenhum resultado para a busca.' : 'Nenhum veículo cadastrado.'}</p>
          {!busca && <Link to="/veiculos/novo" className="btn btn-primary mt-4">Cadastrar primeiro veículo</Link>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr><th>Placa</th><th>Modelo</th><th>Tipo</th><th>Ano</th><th>Capacidade</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {paginados.map(v => (
                <tr key={v.codigo}>
                  <td className="font-medium font-mono">{v.placa}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      {v.foto && (
                        <div className="w-10 h-8 rounded overflow-hidden shrink-0">
                          <img src={v.foto} alt={v.modelo} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {v.modelo}
                    </div>
                  </td>
                  <td><span className="badge badge-outline">{v.tipo?.replace(/_/g, ' ')}</span></td>
                  <td>{v.ano || '-'}</td>
                  <td>{v.capacidade ? `${v.capacidade} kg` : '-'}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/veiculos/${v.codigo}/editar`)} className="btn btn-ghost btn-xs">Editar</button>
                      <button onClick={() => handleDeletar(v.codigo, v.placa)} className="btn btn-ghost btn-xs text-error">Remover</button>
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

export default ListaVeiculos
