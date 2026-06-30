import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RotaService from '../../services/RotaService'

function ListaRotas() {
  const [rotas, setRotas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    RotaService.listarTodos()
      .then(setRotas)
      .catch(() => alert('Erro ao carregar rotas.'))
      .finally(() => setCarregando(false))
  }, [])

  const handleDeletar = async (codigo) => {
    if (!confirm('Tem certeza que deseja remover esta rota?')) return
    try {
      await RotaService.deletar(codigo)
      setRotas(rotas.filter((r) => r.codigo !== codigo))
    } catch (error) {
      alert('Erro ao remover rota.')
    }
  }

  if (carregando) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Rotas</h1>
        <Link to="/rotas/novo" className="btn btn-primary btn-sm">+ Nova Rota</Link>
      </div>

      {rotas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base-content/70">Nenhuma rota cadastrada.</p>
          <Link to="/rotas/novo" className="btn btn-primary mt-4">Cadastrar primeira rota</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr><th>Nome</th><th>Cidade</th><th>Dia</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {rotas.map((r) => (
                <tr key={r.codigo}>
                  <td className="font-medium">{r.nome}</td>
                  <td>{r.cidade || '-'}</td>
                  <td>{r.diaSemana || '-'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/rotas/${r.codigo}/editar`)} className="btn btn-ghost btn-xs">Editar</button>
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

export default ListaRotas
