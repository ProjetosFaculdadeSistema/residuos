import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ResiduoService } from '../../services'
import { useApiRequest } from '../../hooks/useApiRequest'
import { ErrorMessage, useConfirm, useToast, Paginacao } from '../../components'

function ListaResiduos() {
  const [residuos, setResiduos] = useState([])
  const [busca, setBusca]       = useState('')
  const [pagina, setPagina]     = useState(1)
  const POR_PAGINA = 10
  const { loading, error, execute } = useApiRequest()
  const navigate = useNavigate()
  const confirm  = useConfirm()
  const toast    = useToast()

  useEffect(() => { carregar() }, [])

  const carregar = () => execute(async () => setResiduos(await ResiduoService.listarTodos()))

  const handleDeletar = async (codigo, nome) => {
    const ok = await confirm(`Remover "${nome}"?`, 'Esta ação não pode ser desfeita.')
    if (!ok) return
    await execute(async () => {
      await ResiduoService.deletar(codigo)
      setResiduos(prev => prev.filter(r => r.codigo !== codigo))
      toast('Resíduo removido com sucesso')
    })
  }

  const filtrados = residuos.filter(r =>
    !busca || [r.nome, r.tipo, r.periculosidade].some(v => v?.toLowerCase().includes(busca.toLowerCase()))
  )
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  if (loading && residuos.length === 0)
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resíduos</h1>
        <Link to="/residuos/novo" className="btn btn-primary btn-sm">+ Novo Resíduo</Link>
      </div>

      <ErrorMessage mensagem={error} onTentar={carregar} />

      {residuos.length > 0 && (
        <div className="mb-4">
          <input type="text" placeholder="Buscar por nome, tipo..."
            className="input input-bordered input-sm w-full max-w-xs"
            value={busca} onChange={e => { setBusca(e.target.value); setPagina(1) }} />
        </div>
      )}

      {filtrados.length === 0 && !error ? (
        <div className="text-center py-12">
          <p className="text-base-content/60">{busca ? 'Nenhum resultado para a busca.' : 'Nenhum resíduo cadastrado ainda.'}</p>
          {!busca && <Link to="/residuos/novo" className="btn btn-primary mt-4">Cadastrar primeiro resíduo</Link>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr><th>Resíduo</th><th>Tipo</th><th>Periculosidade</th><th>Quantidade</th><th>Unidade</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {paginados.map(r => (
                <tr key={r.codigo}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-base-300 flex items-center justify-center text-base">
                        {r.imagem
                          ? <img src={r.imagem} alt={r.nome} className="w-full h-full object-cover" />
                          : '♻️'
                        }
                      </div>
                      <span className="font-medium">{r.nome}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-outline">{r.tipo}</span></td>
                  <td>
                    {r.periculosidade && (
                      <span className={`badge ${r.periculosidade === 'PERIGOSO' ? 'badge-error' : 'badge-ghost'}`}>
                        {r.periculosidade === 'PERIGOSO' ? 'Perigoso' : 'Não perigoso'}
                      </span>
                    )}
                  </td>
                  <td>{r.quantidade}</td>
                  <td>{r.unidadeMedida}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/residuos/${r.codigo}`)} className="btn btn-ghost btn-xs">Ver</button>
                      <button onClick={() => navigate(`/residuos/${r.codigo}/editar`)} className="btn btn-ghost btn-xs">Editar</button>
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

export default ListaResiduos
