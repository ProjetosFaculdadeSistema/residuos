import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import ColetaService from '../../services/ColetaService'
import ResiduoService from '../../services/ResiduoService'
import MotoristaService from '../../services/MotoristaService'
import VeiculoService from '../../services/VeiculoService'
import RotaService from '../../services/RotaService'

function FormColeta() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { codigo } = useParams()
  const editando = !!codigo

  const [residuos, setResiduos] = useState([])
  const [motoristas, setMotoristas] = useState([])
  const [veiculos, setVeiculos] = useState([])
  const [rotas, setRotas] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      try {
        const [r, m, v, ro] = await Promise.all([
          ResiduoService.listarTodos(),
          MotoristaService.listarTodos(),
          VeiculoService.listarTodos(),
          RotaService.listarTodos()
        ])
        setResiduos(r)
        setMotoristas(m)
        setVeiculos(v)
        setRotas(ro)

        if (editando) {
          const coleta = await ColetaService.buscarPorCodigo(codigo)
          reset({
            ...coleta,
            dataColeta: coleta.dataColeta ? coleta.dataColeta.split('T')[0] : '',
            residuoId: coleta.residuoId,
            motoristaId: coleta.motoristaId,
            veiculoId: coleta.veiculoId,
            rotaId: coleta.rotaId,
          })
        }
      } catch (error) {
        alert('Erro ao carregar dados.')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [codigo])

  const onSubmit = async (dados) => {
    const payload = {
      dataColeta: dados.dataColeta,
      observacao: dados.observacao,
      residuoId: parseInt(dados.residuoId),
      motoristaId: parseInt(dados.motoristaId),
      veiculoId: parseInt(dados.veiculoId),
      rotaId: parseInt(dados.rotaId),
    }
    try {
      if (editando) {
        await ColetaService.atualizar(codigo, payload)
      } else {
        await ColetaService.cadastrar(payload)
      }
      navigate('/coletas')
    } catch (error) {
      alert('Erro ao salvar coleta.')
    }
  }

  if (carregando) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/coletas')} className="btn btn-ghost btn-sm">← Voltar</button>
        <h1 className="text-2xl font-bold">{editando ? 'Editar Coleta' : 'Nova Coleta'}</h1>
      </div>

      <div className="card bg-base-200 max-w-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Data da coleta *</span></label>
              <input type="date"
                className={`input input-bordered ${errors.dataColeta ? 'input-error' : ''}`}
                {...register('dataColeta', { required: 'Data é obrigatória' })} />
              {errors.dataColeta && <label className="label"><span className="label-text-alt text-error">{errors.dataColeta.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Resíduo *</span></label>
              <select className={`select select-bordered ${errors.residuoId ? 'select-error' : ''}`}
                {...register('residuoId', { required: 'Resíduo é obrigatório' })}>
                <option value="">Selecione o resíduo</option>
                {residuos.map((r) => <option key={r.codigo} value={r.codigo}>{r.nome}</option>)}
              </select>
              {errors.residuoId && <label className="label"><span className="label-text-alt text-error">{errors.residuoId.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Motorista *</span></label>
              <select className={`select select-bordered ${errors.motoristaId ? 'select-error' : ''}`}
                {...register('motoristaId', { required: 'Motorista é obrigatório' })}>
                <option value="">Selecione o motorista</option>
                {motoristas.map((m) => <option key={m.codigo} value={m.codigo}>{m.nome}</option>)}
              </select>
              {errors.motoristaId && <label className="label"><span className="label-text-alt text-error">{errors.motoristaId.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Veículo *</span></label>
              <select className={`select select-bordered ${errors.veiculoId ? 'select-error' : ''}`}
                {...register('veiculoId', { required: 'Veículo é obrigatório' })}>
                <option value="">Selecione o veículo</option>
                {veiculos.map((v) => <option key={v.codigo} value={v.codigo}>{v.placa} - {v.modelo}</option>)}
              </select>
              {errors.veiculoId && <label className="label"><span className="label-text-alt text-error">{errors.veiculoId.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Rota *</span></label>
              <select className={`select select-bordered ${errors.rotaId ? 'select-error' : ''}`}
                {...register('rotaId', { required: 'Rota é obrigatória' })}>
                <option value="">Selecione a rota</option>
                {rotas.map((r) => <option key={r.codigo} value={r.codigo}>{r.nome}</option>)}
              </select>
              {errors.rotaId && <label className="label"><span className="label-text-alt text-error">{errors.rotaId.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Observação</span></label>
              <textarea placeholder="Observações sobre a coleta..." className="textarea textarea-bordered" rows={3}
                {...register('observacao')} />
            </div>

            <div className="card-actions justify-end mt-2">
              <button type="button" onClick={() => navigate('/coletas')} className="btn btn-ghost">Cancelar</button>
              <button type="submit" className="btn btn-primary">{editando ? 'Salvar alterações' : 'Registrar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormColeta
