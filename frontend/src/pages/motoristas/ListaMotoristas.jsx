import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MotoristaService } from '../../services'
import { useApiRequest } from '../../hooks/useApiRequest'
import { ErrorMessage, useConfirm, useToast, Paginacao } from '../../components'

const statusClasse = { ATIVO: 'badge-success', INATIVO: 'badge-ghost', AFASTADO: 'badge-warning' }

function ListaMotoristas() {
  const [motoristas, setMotoristas] = useState([])
  const [busca, setBusca]           = useState('')
  const [pagina, setPagina]         = useState(1)
  const POR_PAGINA = 10
  const { loading, error, execute } = useApiRequest()
  const navigate = useNavigate()
  const confirm  = useConfirm()
  const toast    = useToast()

  useEffect(() => { carregar() }, [])

  const carregar = () => execute(async () => setMotoristas(await MotoristaService.listarTodos()))

  const handleDeletar = async (codigo, nome) => {
    const ok = await confirm(`Remover "${nome}"?`, 'Esta ação não pode ser desfeita.')
    if (!ok) return
    await execute(async () => {
      await MotoristaService.deletar(codigo)
      setMotoristas(prev => prev.filter(m => m.codigo !== codigo))
      toast('Motorista removido com sucesso')
    })
  }

  const filtrados = motoristas.filter(m =>
    !busca || [m.nome, m.cnh, m.categoriaCnh, m.telefone].some(v => v?.toLowerCase().includes(busca.toLowerCase()))
  )
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  if (loading && motoristas.length === 0)
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Motoristas</h1>
        <Link to="/motoristas/novo" className="btn btn-primary btn-sm">+ Novo Motorista</Link>
      </div>

      <ErrorMessage mensagem={error} onTentar={carregar} />

      {motoristas.length > 0 && (
        <div className="mb-4">
          <input type="text" placeholder="Buscar por nome, CNH..."
            className="input input-bordered input-sm w-full max-w-xs"
            value={busca} onChange={e => { setBusca(e.target.value); setPagina(1) }} />
        </div>
      )}

      {filtrados.length === 0 && !error ? (
        <div className="text-center py-12">
          <p className="text-base-content/60">{busca ? 'Nenhum resultado para a busca.' : 'Nenhum motorista cadastrado.'}</p>
          {!busca && <Link to="/motoristas/novo" className="btn btn-primary mt-4">Cadastrar primeiro motorista</Link>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr><th>Motorista</th><th>CNH</th><th>Categoria</th><th>Telefone</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {paginados.map(m => (
                <tr key={m.codigo}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-base-300 flex items-center justify-center text-sm font-bold">
                        {m.foto
                          ? <img src={m.foto} alt={m.nome} className="w-full h-full object-cover" />
                          : (m.nome?.[0]?.toUpperCase() ?? '?')
                        }
                      </div>
                      <span className="font-medium">{m.nome}</span>
                    </div>
                  </td>
                  <td>{m.cnh}</td>
                  <td><span className="badge badge-outline">{m.categoriaCnh}</span></td>
                  <td>{m.telefone || '-'}</td>
                  <td>
                    {m.status && (
                      <span className={`badge ${statusClasse[m.status] ?? 'badge-ghost'}`}>
                        {m.status.charAt(0) + m.status.slice(1).toLowerCase()}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/motoristas/${m.codigo}/editar`)} className="btn btn-ghost btn-xs">Editar</button>
                      <button onClick={() => handleDeletar(m.codigo, m.nome)} className="btn btn-ghost btn-xs text-error">Remover</button>
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

export default ListaMotoristas
