import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { MotoristaService } from '../../services'
import { useApiRequest } from '../../hooks/useApiRequest'
import { ErrorMessage, useToast } from '../../components'

const CATEGORIAS = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE']

const formatarTelefone = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2)  return `(${d}`
  if (d.length <= 6)  return `(${d.slice(0,2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}

function FormMotorista() {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()
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
      const dados = await MotoristaService.buscarPorCodigo(codigo)
      reset(dados)
      if (dados.foto) setPreview(dados.foto)
    }).catch(() => navigate('/motoristas'))
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
    const payload = { ...dados, telefone: dados.telefone?.replace(/\D/g, '') || null }
    let sucesso = false
    await execute(async () => {
      if (editando) {
        await MotoristaService.atualizar(codigo, payload, foto)
      } else {
        await MotoristaService.cadastrar(payload, foto)
      }
      sucesso = true
    })
    if (sucesso) {
      toast(editando ? 'Motorista atualizado com sucesso' : 'Motorista cadastrado com sucesso')
      navigate('/motoristas')
    }
  }

  if (carregando) {
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => navigate('/motoristas')} className="btn btn-ghost btn-sm">← Voltar</button>
        <h1 className="text-2xl font-bold">{editando ? 'Editar Motorista' : 'Novo Motorista'}</h1>
      </div>

      <ErrorMessage mensagem={error} />

      <div className="card bg-base-200 max-w-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Foto do motorista</span></label>
              <div className="flex items-center gap-4">
                {preview
                  ? <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-full border-2 border-base-300" />
                  : <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center text-2xl text-base-content/40">👤</div>
                }
                <label className="btn btn-outline btn-sm cursor-pointer">
                  {preview ? 'Trocar foto' : 'Escolher foto'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Nome completo *</span></label>
              <input type="text" placeholder="João da Silva"
                className={`input input-bordered ${errors.nome ? 'input-error' : ''}`}
                {...register('nome', { required: 'Nome é obrigatório' })} />
              {errors.nome && <span className="text-error text-xs mt-1">{errors.nome.message}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">CNH *</span>
                <span className="label-text-alt text-base-content/50">11 dígitos</span>
              </label>
              <input type="text" placeholder="00000000000" inputMode="numeric"
                className={`input input-bordered font-mono tracking-widest ${errors.cnh ? 'input-error' : ''}`}
                {...register('cnh', {
                  required: 'CNH é obrigatória',
                  minLength: { value: 11, message: 'CNH deve ter 11 dígitos' },
                  maxLength: { value: 11, message: 'CNH deve ter 11 dígitos' }
                })}
                onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11) }}
              />
              {errors.cnh && <span className="text-error text-xs mt-1">{errors.cnh.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Categoria CNH *</span></label>
                <select className={`select select-bordered ${errors.categoriaCnh ? 'select-error' : ''}`}
                  {...register('categoriaCnh', { required: 'Categoria é obrigatória' })}>
                  <option value="">Selecione</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.categoriaCnh && <span className="text-error text-xs mt-1">{errors.categoriaCnh.message}</span>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Status</span></label>
                <select className="select select-bordered" {...register('status')}>
                  <option value="">Selecione</option>
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                  <option value="AFASTADO">Afastado</option>
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Telefone</span></label>
              <input type="text" placeholder="(44) 99999-9999" inputMode="numeric"
                className="input input-bordered"
                {...register('telefone')}
                onInput={(e) => {
                  const v = formatarTelefone(e.target.value)
                  e.target.value = v
                  setValue('telefone', v)
                }}
              />
              <label className="label py-0">
                <span className="label-text-alt text-base-content/40">Formato: (DDD) XXXXX-XXXX</span>
              </label>
            </div>

            <div className="card-actions justify-end mt-2">
              <button type="button" onClick={() => navigate('/motoristas')} className="btn btn-ghost">Cancelar</button>
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

export default FormMotorista
