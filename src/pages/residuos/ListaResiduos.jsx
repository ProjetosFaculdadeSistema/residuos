import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ResiduoService from '../../services/ResiduoService'

function ListaResiduos() {
  const [residuos, setResiduos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    carregarResiduos()
  }, [])

  const carregarResiduos = async () => {
    try {
      const dados = await ResiduoService.listarTodos()
      setResiduos(dados)
    } catch (error) {
      alert('Erro ao carregar resíduos.')
    } finally {
      setCarregando(false)
    }
  }

  const handleDeletar = async (codigo) => {
    if (!confirm('Tem certeza que deseja remover este resíduo?')) return
    try {
      await ResiduoService.deletar(codigo)
      setResiduos(residuos.filter((r) => r.codigo !== codigo))
    } catch (error) {
      alert('Erro ao remover resíduo.')
    }
  }

  if (carregando) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resíduos</h1>
        <Link to="/residuos/novo" className="btn btn-primary btn-sm">+ Novo Resíduo</Link>
      </div>

      {residuos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base-content/70">Nenhum resíduo cadastrado.</p>
          <Link to="/residuos/novo" className="btn btn-primary mt-4">Cadastrar primeiro resíduo</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {residuos.map((r) => (
                <tr key={r.codigo}>
                  <td>
                    {r.imagem
                      ? <div className="avatar"><div className="w-10 rounded"><img src={r.imagem} alt={r.nome} /></div></div>
                      : <span className="text-2xl">🗑️</span>
                    }
                  </td>
                  <td className="font-medium">{r.nome}</td>
                  <td><span className="badge badge-outline">{r.tipo}</span></td>
                  <td>{r.quantidade} {r.unidadeMedida}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/residuos/${r.codigo}`)} className="btn btn-ghost btn-xs">Ver</button>
                      <button onClick={() => navigate(`/residuos/${r.codigo}/editar`)} className="btn btn-ghost btn-xs">Editar</button>
                      <button onClick={() => handleDeletar(r.codigo)} className="btn btn-ghost btn-xs text-error">Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ListaResiduos
