import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MotoristaService from '../../services/MotoristaService'

function ListaMotoristas() {
  const [motoristas, setMotoristas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    MotoristaService.listarTodos()
      .then(setMotoristas)
      .catch(() => alert('Erro ao carregar motoristas.'))
      .finally(() => setCarregando(false))
  }, [])

  const handleDeletar = async (codigo) => {
    if (!confirm('Tem certeza que deseja remover este motorista?')) return
    try {
      await MotoristaService.deletar(codigo)
      setMotoristas(motoristas.filter((m) => m.codigo !== codigo))
    } catch (error) {
      alert('Erro ao remover motorista.')
    }
  }

  if (carregando) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Motoristas</h1>
        <Link to="/motoristas/novo" className="btn btn-primary btn-sm">+ Novo Motorista</Link>
      </div>

      {motoristas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base-content/70">Nenhum motorista cadastrado.</p>
          <Link to="/motoristas/novo" className="btn btn-primary mt-4">Cadastrar primeiro motorista</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr><th>Nome</th><th>CNH</th><th>Categoria</th><th>Telefone</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {motoristas.map((m) => (
                <tr key={m.codigo}>
                  <td className="font-medium">{m.nome}</td>
                  <td>{m.cnh}</td>
                  <td><span className="badge badge-outline">{m.categoriaCnh}</span></td>
                  <td>{m.telefone}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/motoristas/${m.codigo}/editar`)} className="btn btn-ghost btn-xs">Editar</button>
                      <button onClick={() => handleDeletar(m.codigo)} className="btn btn-ghost btn-xs text-error">Remover</button>
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

export default ListaMotoristas
