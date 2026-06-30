import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ResiduoService from '../services/ResiduoService'
import ColetaService from '../services/ColetaService'
import MotoristaService from '../services/MotoristaService'
import VeiculoService from '../services/VeiculoService'
import RotaService from '../services/RotaService'

function Home() {
  const [totais, setTotais] = useState({ residuos: 0, coletas: 0, motoristas: 0, veiculos: 0, rotas: 0 })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      try {
        const [residuos, coletas, motoristas, veiculos, rotas] = await Promise.all([
          ResiduoService.listarTodos(),
          ColetaService.listarTodos(),
          MotoristaService.listarTodos(),
          VeiculoService.listarTodos(),
          RotaService.listarTodos()
        ])
        setTotais({
          residuos: residuos.length,
          coletas: coletas.length,
          motoristas: motoristas.length,
          veiculos: veiculos.length,
          rotas: rotas.length
        })
      } catch (error) {
        console.error('Erro ao carregar totais:', error)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  const cards = [
    { titulo: 'Resíduos', icone: '🗑️', total: totais.residuos, link: '/residuos' },
    { titulo: 'Coletas', icone: '📋', total: totais.coletas, link: '/coletas' },
    { titulo: 'Motoristas', icone: '🚗', total: totais.motoristas, link: '/motoristas' },
    { titulo: 'Veículos', icone: '🚛', total: totais.veiculos, link: '/veiculos' },
    { titulo: 'Rotas', icone: '🗺️', total: totais.rotas, link: '/rotas' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-base-content/70 mt-1">Visão geral do sistema de gerenciamento de resíduos</p>
      </div>

      {carregando ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <Link key={card.titulo} to={card.link} className="card bg-base-200 shadow hover:shadow-lg transition-shadow">
              <div className="card-body items-center text-center p-6">
                <span className="text-4xl">{card.icone}</span>
                <h2 className="text-4xl font-bold mt-2">{card.total}</h2>
                <p className="text-base-content/70">{card.titulo}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Acesso rápido</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/residuos/novo" className="btn btn-outline btn-sm">+ Novo Resíduo</Link>
          <Link to="/coletas/nova" className="btn btn-outline btn-sm">+ Nova Coleta</Link>
          <Link to="/motoristas/novo" className="btn btn-outline btn-sm">+ Novo Motorista</Link>
          <Link to="/veiculos/novo" className="btn btn-outline btn-sm">+ Novo Veículo</Link>
          <Link to="/rotas/novo" className="btn btn-outline btn-sm">+ Nova Rota</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
