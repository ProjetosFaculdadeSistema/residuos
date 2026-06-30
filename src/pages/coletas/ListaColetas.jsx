import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ColetaService from '../../services/ColetaService'

function ListaColetas() {
  const [coletas, setColetas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    ColetaService.listarTodos()
      .then(setColetas)
      .catch(() => alert('Erro ao carregar coletas.'))
      .finally(() => setCarregando(false))
  }, [])

  const handleDeletar = async (codigo) => {
    if (!confirm('Tem certeza que deseja remover esta coleta?')) return
    try {
      await ColetaService.deletar(codigo)
      setColetas(coletas.filter((c) => c.codigo !== codigo))
    } catch (error) {
      alert('Erro ao remover coleta.')
    }
  }

  const formatarData = (dataStr) => {
    if (!dataStr) return '-'
    return new Date(dataStr).toLocaleDateString('pt-BR')
  }

  if (carregando) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coletas</h1>
        <Link to="/coletas/nova" className="btn btn-primary btn-sm">+ Nova Coleta</Link>
      </div>

      {coletas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base-content/70">Nenhuma coleta cadastrada.</p>
          <Link to="/coletas/nova" className="btn btn-primary mt-4">Registrar primeira coleta</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr><th>Data</th><th>Resíduo</th><th>Motorista</th><th>Veículo</th><th>Rota</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {coletas.map((c) => (
                <tr key={c.codigo}>
                  <td>{formatarData(c.dataColeta)}</td>
                  <td>{c.residuoNome || '-'}</td>
                  <td>{c.motoristaNome || '-'}</td>
                  <td>{c.veiculoPlaca || '-'}</td>
                  <td>{c.rotaNome || '-'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/coletas/${c.codigo}/editar`)} className="btn btn-ghost btn-xs">Editar</button>
                      <button onClick={() => handleDeletar(c.codigo)} className="btn btn-ghost btn-xs text-error">Remover</button>
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

export default ListaColetas
