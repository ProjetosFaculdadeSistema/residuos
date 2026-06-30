import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { ResiduoService } from '../../services'
import { useApiRequest } from '../../hooks/useApiRequest'
import { ErrorMessage, useToast } from '../../components'

const TIPOS = ['ORGANICO', 'RECICLAVEL', 'PERIGOSO', 'REJEITO', 'ELETRONICO']
const UNIDADES = ['kg', 'g', 'litros', 'm³', 'unidades']
const PERICULOSIDADES = ['NAO_PERIGOSO', 'PERIGOSO']

function FormResiduo() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { codigo } = useParams()
  const editando = !!codigo
  const { loading, error, execute } = useApiRequest()
  const toast = useToast()

  const [imagem, setImagem]   = useState(null)
  const [preview, setPreview] = useState(null)
  const [carregando, setCarregando] = useState(editando)

  useEffect(() => {
    if (!editando) return
    execute(async () => {
      const dados = await ResiduoService.buscarPorCodigo(codigo)
      reset(dados)
      if (dados.imagem) setPreview(dados.imagem)
    }).catch(() => navigate('/residuos'))
      .finally(() => setCarregando(false))
  }, [codigo])

  const handleImagem = (e) => {
    const arquivo = e.target.files[0]
    if (arquivo) {
      setImagem(arquivo)
      setPreview(URL.createObjectURL(arquivo))
    }
  }

  const onSubmit = async (dados) => {
    let sucesso = false
    await execute(async () => {
      if (editando) {
        await ResiduoService.atualizar(codigo, dados, imagem)
      } else {
        await ResiduoService.cadastrar(dados, imagem)
      }
      sucesso = true
    })
    if (sucesso) {
      toast(editando ? 'Resíduo atualizado com sucesso' : 'Resíduo cadastrado com sucesso')
      navigate('/residuos')
    }
  }

  if (carregando) {
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => navigate('/residuos')} className="btn btn-ghost btn-sm">← Voltar</button>
        <h1 className="text-2xl font-bold">{editando ? 'Editar Resíduo' : 'Novo Resíduo'}</h1>
      </div>

      <ErrorMessage mensagem={error} />

      <div className="card bg-base-200 max-w-2xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Imagem do resíduo</span></label>
              <div className="flex items-center gap-4">
                {preview && <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-lg" />}
                <label className="btn btn-outline btn-sm cursor-pointer">
                  {preview ? 'Trocar imagem' : 'Escolher imagem'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImagem} />
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Nome *</span></label>
              <input type="text" placeholder="Ex: Papel e papelão"
                className={`input input-bordered ${errors.nome ? 'input-error' : ''}`}
                {...register('nome', { required: 'Nome é obrigatório' })} />
              {errors.nome && <span className="text-error text-xs mt-1">{errors.nome.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Tipo *</span></label>
              <select className={`select select-bordered ${errors.tipo ? 'select-error' : ''}`}
                {...register('tipo', { required: 'Tipo é obrigatório' })}>
                <option value="">Selecione o tipo</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.tipo && <span className="text-error text-xs mt-1">{errors.tipo.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Periculosidade</span></label>
              <select className="select select-bordered" {...register('periculosidade')}>
                <option value="">Selecione</option>
                {PERICULOSIDADES.map(p => (
                  <option key={p} value={p}>{p === 'PERIGOSO' ? 'Perigoso' : 'Não perigoso'}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Quantidade *</span></label>
                <input type="number" step="0.01" placeholder="0.00"
                  className={`input input-bordered ${errors.quantidade ? 'input-error' : ''}`}
                  {...register('quantidade', { required: 'Quantidade é obrigatória', min: { value: 0, message: 'Deve ser positivo' } })} />
                {errors.quantidade && <span className="text-error text-xs mt-1">{errors.quantidade.message}</span>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Unidade *</span></label>
                <select className={`select select-bordered ${errors.unidadeMedida ? 'select-error' : ''}`}
                  {...register('unidadeMedida', { required: 'Unidade é obrigatória' })}>
                  <option value="">Selecione</option>
                  {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                {errors.unidadeMedida && <span className="text-error text-xs mt-1">{errors.unidadeMedida.message}</span>}
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Descrição</span></label>
              <textarea placeholder="Descrição opcional..." className="textarea textarea-bordered" rows={3}
                {...register('descricao')} />
            </div>

            <div className="card-actions justify-end mt-2">
              <button type="button" onClick={() => navigate('/residuos')} className="btn btn-ghost">Cancelar</button>
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

export default FormResiduo
