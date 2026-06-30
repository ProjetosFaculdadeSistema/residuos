import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import ResiduoService from '../../services/ResiduoService'

const TIPOS = ['ORGANICO', 'RECICLAVEL', 'PERIGOSO', 'REJEITO', 'ELETRONICO']
const UNIDADES = ['kg', 'g', 'litros', 'm³', 'unidades']

function FormResiduo() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { codigo } = useParams()
  const editando = !!codigo
  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (editando) {
      ResiduoService.buscarPorCodigo(codigo)
        .then((dados) => {
          reset(dados)
          if (dados.imagem) setPreview(dados.imagem)
        })
        .catch(() => { alert('Erro ao carregar resíduo.'); navigate('/residuos') })
    }
  }, [codigo])

  const onSubmit = async (dados) => {
    setCarregando(true)
    try {
      if (editando) {
        await ResiduoService.atualizar(codigo, dados, imagem)
      } else {
        await ResiduoService.cadastrar(dados, imagem)
      }
      navigate('/residuos')
    } catch (error) {
      alert('Erro ao salvar resíduo.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/residuos')} className="btn btn-ghost btn-sm">← Voltar</button>
        <h1 className="text-2xl font-bold">{editando ? 'Editar Resíduo' : 'Novo Resíduo'}</h1>
      </div>

      <div className="card bg-base-200 max-w-2xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Imagem do resíduo</span></label>
              <div className="flex items-center gap-4">
                {preview && <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-lg" />}
                <label className="btn btn-outline btn-sm cursor-pointer">
                  {preview ? 'Trocar imagem' : 'Escolher imagem'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files[0]
                    if (f) { setImagem(f); setPreview(URL.createObjectURL(f)) }
                  }} />
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Nome *</span></label>
              <input type="text" placeholder="Ex: Papel e papelão"
                className={`input input-bordered ${errors.nome ? 'input-error' : ''}`}
                {...register('nome', { required: 'Nome é obrigatório' })} />
              {errors.nome && <label className="label"><span className="label-text-alt text-error">{errors.nome.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Tipo *</span></label>
              <select className={`select select-bordered ${errors.tipo ? 'select-error' : ''}`}
                {...register('tipo', { required: 'Tipo é obrigatório' })}>
                <option value="">Selecione o tipo</option>
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.tipo && <label className="label"><span className="label-text-alt text-error">{errors.tipo.message}</span></label>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Quantidade *</span></label>
                <input type="number" step="0.01" placeholder="0.00"
                  className={`input input-bordered ${errors.quantidade ? 'input-error' : ''}`}
                  {...register('quantidade', { required: 'Obrigatório' })} />
                {errors.quantidade && <label className="label"><span className="label-text-alt text-error">{errors.quantidade.message}</span></label>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Unidade *</span></label>
                <select className={`select select-bordered ${errors.unidadeMedida ? 'select-error' : ''}`}
                  {...register('unidadeMedida', { required: 'Obrigatório' })}>
                  <option value="">Selecione</option>
                  {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                {errors.unidadeMedida && <label className="label"><span className="label-text-alt text-error">{errors.unidadeMedida.message}</span></label>}
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Descrição</span></label>
              <textarea placeholder="Descrição opcional..." className="textarea textarea-bordered" rows={3} {...register('descricao')} />
            </div>

            <div className="card-actions justify-end mt-2">
              <button type="button" onClick={() => navigate('/residuos')} className="btn btn-ghost">Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={carregando}>
                {carregando ? <span className="loading loading-spinner loading-sm"></span> : editando ? 'Salvar alterações' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormResiduo
