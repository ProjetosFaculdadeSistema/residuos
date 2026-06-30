import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ResiduoService } from '../../services'

function DetalhesResiduo() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const [residuo, setResiduo] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await ResiduoService.buscarPorCodigo(codigo)
        setResiduo(dados)
      } catch (error) {
        alert('Resíduo não encontrado.')
        navigate('/residuos')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [codigo])

  const handleDeletar = async () => {
    if (!confirm('Tem certeza que deseja remover este resíduo?')) return
    try {
      await ResiduoService.deletar(codigo)
      navigate('/residuos')
    } catch (error) {
      alert('Erro ao remover resíduo.')
    }
  }

  if (carregando) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!residuo) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/residuos')} className="btn btn-ghost btn-sm">
          ← Voltar
        </button>
        <h1 className="text-2xl font-bold">Detalhes do Resíduo</h1>
      </div>

      <div className="card bg-base-200 max-w-2xl">
        <div className="card-body">
          {residuo.imagem && (
            <figure className="mb-4">
              <img
                src={residuo.imagem}
                alt={residuo.nome}
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </figure>
          )}

          <h2 className="card-title text-2xl">{residuo.nome}</h2>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-base-content/70">Tipo</p>
              <span className="badge badge-outline mt-1">{residuo.tipo}</span>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Quantidade</p>
              <p className="font-medium">{residuo.quantidade} {residuo.unidade}</p>
            </div>
          </div>

          {residuo.descricao && (
            <div className="mt-4">
              <p className="text-sm text-base-content/70">Descrição</p>
              <p className="mt-1">{residuo.descricao}</p>
            </div>
          )}

          <div className="card-actions justify-end mt-6">
            <button onClick={handleDeletar} className="btn btn-error btn-outline btn-sm">
              Remover
            </button>
            <Link to={`/residuos/${codigo}/editar`} className="btn btn-primary btn-sm">
              Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalhesResiduo
