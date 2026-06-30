import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import VeiculoService from '../../services/VeiculoService'

const TIPOS = ['CAMINHAO_COLETOR', 'CAMINHAO_BASCULA', 'VAN', 'CAMINHONETE', 'OUTRO']

function FormVeiculo() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { codigo } = useParams()
  const editando = !!codigo

  useEffect(() => {
    if (editando) {
      VeiculoService.buscarPorCodigo(codigo)
        .then(reset)
        .catch(() => { alert('Veículo não encontrado.'); navigate('/veiculos') })
    }
  }, [codigo])

  const onSubmit = async (dados) => {
    try {
      if (editando) {
        await VeiculoService.atualizar(codigo, dados)
      } else {
        await VeiculoService.cadastrar(dados)
      }
      navigate('/veiculos')
    } catch (error) {
      alert('Erro ao salvar veículo.')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/veiculos')} className="btn btn-ghost btn-sm">← Voltar</button>
        <h1 className="text-2xl font-bold">{editando ? 'Editar Veículo' : 'Novo Veículo'}</h1>
      </div>

      <div className="card bg-base-200 max-w-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Placa *</span></label>
              <input type="text" placeholder="ABC-1234"
                className={`input input-bordered font-mono ${errors.placa ? 'input-error' : ''}`}
                {...register('placa', { required: 'Placa é obrigatória' })} />
              {errors.placa && <label className="label"><span className="label-text-alt text-error">{errors.placa.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Modelo *</span></label>
              <input type="text" placeholder="Ex: Volkswagen Constellation"
                className={`input input-bordered ${errors.modelo ? 'input-error' : ''}`}
                {...register('modelo', { required: 'Modelo é obrigatório' })} />
              {errors.modelo && <label className="label"><span className="label-text-alt text-error">{errors.modelo.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Tipo *</span></label>
              <select className={`select select-bordered ${errors.tipo ? 'select-error' : ''}`}
                {...register('tipo', { required: 'Tipo é obrigatório' })}>
                <option value="">Selecione o tipo</option>
                {TIPOS.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
              {errors.tipo && <label className="label"><span className="label-text-alt text-error">{errors.tipo.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Capacidade (kg)</span></label>
              <input type="number" step="0.01" placeholder="5000" className="input input-bordered" {...register('capacidade')} />
            </div>

            <div className="card-actions justify-end mt-2">
              <button type="button" onClick={() => navigate('/veiculos')} className="btn btn-ghost">Cancelar</button>
              <button type="submit" className="btn btn-primary">{editando ? 'Salvar alterações' : 'Cadastrar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormVeiculo
