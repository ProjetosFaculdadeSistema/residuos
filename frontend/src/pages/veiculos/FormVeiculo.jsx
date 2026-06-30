import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { VeiculoService } from '../../services'
import { useApiRequest } from '../../hooks/useApiRequest'
import { ErrorMessage, useToast } from '../../components'

const TIPOS_VEICULO = ['CAMINHAO_COLETOR', 'CAMINHAO_BASCULA', 'VAN', 'CAMINHONETE', 'OUTRO']

function FormVeiculo() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { codigo } = useParams()
  const editando = !!codigo
  const { loading, error, execute } = useApiRequest()
  const toast = useToast()
  const [carregando, setCarregando] = useState(editando)
  const [foto, setFoto]       = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!editando) return
    execute(async () => {
      const dados = await VeiculoService.buscarPorCodigo(codigo)
      reset(dados)
      if (dados.foto) setPreview(dados.foto)
    }).catch(() => navigate('/veiculos'))
      .finally(() => setCarregando(false))
  }, [codigo])

  const handleFoto = (e) => {
    const arquivo = e.target.files[0]
    if (arquivo) {
      setFoto(arquivo)
      setPreview(URL.createObjectURL(arquivo))
    }
  }

  const onSubmit = async (dados) => {
    let sucesso = false
    await execute(async () => {
      if (editando) {
        await VeiculoService.atualizar(codigo, dados, foto)
      } else {
        await VeiculoService.cadastrar(dados, foto)
      }
      sucesso = true
    })
    if (sucesso) {
      toast(editando ? 'Veículo atualizado com sucesso' : 'Veículo cadastrado com sucesso')
      navigate('/veiculos')
    }
  }

  if (carregando) {
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => navigate('/veiculos')} className="btn btn-ghost btn-sm">← Voltar</button>
        <h1 className="text-2xl font-bold">{editando ? 'Editar Veículo' : 'Novo Veículo'}</h1>
      </div>

      <ErrorMessage mensagem={error} />

      <div className="card bg-base-200 max-w-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Foto do veículo</span></label>
              <div className="flex items-center gap-4">
                {preview
                  ? <img src={preview} alt="preview" className="w-20 h-16 object-cover rounded-lg border-2 border-base-300" />
                  : <div className="w-20 h-16 rounded-lg bg-base-300 flex items-center justify-center text-2xl text-base-content/40">🚛</div>
                }
                <label className="btn btn-outline btn-sm cursor-pointer">
                  {preview ? 'Trocar foto' : 'Escolher foto'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Placa *</span></label>
              <input type="text" placeholder="ABC-1234 ou ABC1D23"
                className={`input input-bordered font-mono ${errors.placa ? 'input-error' : ''}`}
                {...register('placa', { required: 'Placa é obrigatória' })} />
              {errors.placa && <span className="text-error text-xs mt-1">{errors.placa.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Modelo *</span></label>
              <input type="text" placeholder="Ex: Volkswagen Constellation"
                className={`input input-bordered ${errors.modelo ? 'input-error' : ''}`}
                {...register('modelo', { required: 'Modelo é obrigatório' })} />
              {errors.modelo && <span className="text-error text-xs mt-1">{errors.modelo.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Tipo *</span></label>
              <select className={`select select-bordered ${errors.tipo ? 'select-error' : ''}`}
                {...register('tipo', { required: 'Tipo é obrigatório' })}>
                <option value="">Selecione o tipo</option>
                {TIPOS_VEICULO.map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                ))}
              </select>
              {errors.tipo && <span className="text-error text-xs mt-1">{errors.tipo.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Capacidade (kg)</span></label>
                <input type="number" step="0.01" placeholder="5000"
                  className="input input-bordered" {...register('capacidade')} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Ano</span></label>
                <input type="number" placeholder={new Date().getFullYear()}
                  className="input input-bordered" {...register('ano')} />
              </div>
            </div>

            <div className="card-actions justify-end mt-2">
              <button type="button" onClick={() => navigate('/veiculos')} className="btn btn-ghost">Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm" /> : editando ? 'Salvar alterações' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormVeiculo
