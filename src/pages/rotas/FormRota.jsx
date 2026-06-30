import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import RotaService from '../../services/RotaService'

const DIAS = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']

function FormRota() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { codigo } = useParams()
  const editando = !!codigo

  useEffect(() => {
    if (editando) {
      RotaService.buscarPorCodigo(codigo)
        .then(reset)
        .catch(() => { alert('Rota não encontrada.'); navigate('/rotas') })
    }
  }, [codigo])

  const onSubmit = async (dados) => {
    try {
      if (editando) {
        await RotaService.atualizar(codigo, dados)
      } else {
        await RotaService.cadastrar(dados)
      }
      navigate('/rotas')
    } catch (error) {
      alert('Erro ao salvar rota.')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/rotas')} className="btn btn-ghost btn-sm">← Voltar</button>
        <h1 className="text-2xl font-bold">{editando ? 'Editar Rota' : 'Nova Rota'}</h1>
      </div>

      <div className="card bg-base-200 max-w-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Nome da rota *</span></label>
              <input type="text" placeholder="Ex: Rota Centro"
                className={`input input-bordered ${errors.nome ? 'input-error' : ''}`}
                {...register('nome', { required: 'Nome é obrigatório' })} />
              {errors.nome && <label className="label"><span className="label-text-alt text-error">{errors.nome.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Bairro</span></label>
              <input type="text" placeholder="Centro" className="input input-bordered" {...register('bairro')} />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Cidade</span></label>
              <input type="text" placeholder="Paranavaí" className="input input-bordered" {...register('cidade')} />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Distância (km)</span></label>
              <input type="number" step="0.1" placeholder="12.5" className="input input-bordered" {...register('distanciaKm')} />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Dia da semana</span></label>
              <select className="select select-bordered" {...register('diaSemana')}>
                <option value="">Selecione</option>
                {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="card-actions justify-end mt-2">
              <button type="button" onClick={() => navigate('/rotas')} className="btn btn-ghost">Cancelar</button>
              <button type="submit" className="btn btn-primary">{editando ? 'Salvar alterações' : 'Cadastrar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormRota
