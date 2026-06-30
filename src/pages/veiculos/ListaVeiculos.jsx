import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VeiculoService from '../../services/VeiculoService'

function ListaVeiculos() {
  const [veiculos, setVeiculos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    VeiculoService.listarTodos()
      .then(setVeiculos)
      .catch(() => alert('Erro ao carregar veículos.'))
      .finally(() => setCarregando(false))
  }, [])

  const handleDeletar = async (codigo) => {
    if (!confirm('Tem certeza que deseja remover este veículo?')) return
    try {
      await VeiculoService.deletar(codigo)
      setVeiculos(veiculos.filter((v) => v.codigo !== codigo))
    } catch (error) {
      alert('Erro ao remover veículo.')
    }
  }

  if (carregando) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Veículos</h1>
        <Link to="/veiculos/novo" className="btn btn-primary btn-sm">+ Novo Veículo</Link>
      </div>

      {veiculos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base-content/70">Nenhum veículo cadastrado.</p>
          <Link to="/veiculos/novo" className="btn btn-primary mt-4">Cadastrar primeiro veículo</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr><th>Placa</th><th>Modelo</th><th>Tipo</th><th>Capacidade</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {veiculos.map((v) => (
                <tr key={v.codigo}>
                  <td className="font-medium font-mono">{v.placa}</td>
                  <td>{v.modelo}</td>
                  <td><span className="badge badge-outline">{v.tipo}</span></td>
                  <td>{v.capacidade} kg</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/veiculos/${v.codigo}/editar`)} className="btn btn-ghost btn-xs">Editar</button>
                      <button onClick={() => handleDeletar(v.codigo)} className="btn btn-ghost btn-xs text-error">Remover</button>
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

export default ListaVeiculos
