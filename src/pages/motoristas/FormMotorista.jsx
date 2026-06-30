import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import MotoristaService from '../../services/MotoristaService'

const CATEGORIAS = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE']

function FormMotorista() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { codigo } = useParams()
  const editando = !!codigo

  useEffect(() => {
    if (editando) {
      MotoristaService.buscarPorCodigo(codigo)
        .then(reset)
        .catch(() => { alert('Motorista não encontrado.'); navigate('/motoristas') })
    }
  }, [codigo])

  const onSubmit = async (dados) => {
    try {
      if (editando) {
        await MotoristaService.atualizar(codigo, dados)
      } else {
        await MotoristaService.cadastrar(dados)
      }
      navigate('/motoristas')
    } catch (error) {
      alert('Erro ao salvar motorista.')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/motoristas')} className="btn btn-ghost btn-sm">← Voltar</button>
        <h1 className="text-2xl font-bold">{editando ? 'Editar Motorista' : 'Novo Motorista'}</h1>
      </div>

      <div className="card bg-base-200 max-w-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Nome completo *</span></label>
              <input type="text" placeholder="João da Silva"
                className={`input input-bordered ${errors.nome ? 'input-error' : ''}`}
                {...register('nome', { required: 'Nome é obrigatório' })} />
              {errors.nome && <label className="label"><span className="label-text-alt text-error">{errors.nome.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">CNH *</span></label>
              <input type="text" placeholder="00000000000"
                className={`input input-bordered ${errors.cnh ? 'input-error' : ''}`}
                {...register('cnh', { required: 'CNH é obrigatória' })} />
              {errors.cnh && <label className="label"><span className="label-text-alt text-error">{errors.cnh.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Categoria CNH *</span></label>
              <select className={`select select-bordered ${errors.categoriaCnh ? 'select-error' : ''}`}
                {...register('categoriaCnh', { required: 'Categoria é obrigatória' })}>
                <option value="">Selecione</option>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.categoriaCnh && <label className="label"><span className="label-text-alt text-error">{errors.categoriaCnh.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Telefone</span></label>
              <input type="text" placeholder="(44) 99999-9999" className="input input-bordered" {...register('telefone')} />
            </div>

            <div className="card-actions justify-end mt-2">
              <button type="button" onClick={() => navigate('/motoristas')} className="btn btn-ghost">Cancelar</button>
              <button type="submit" className="btn btn-primary">{editando ? 'Salvar alterações' : 'Cadastrar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormMotorista
