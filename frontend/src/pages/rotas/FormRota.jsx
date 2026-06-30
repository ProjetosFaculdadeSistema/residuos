import { useState, useEffect, useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { RotaService } from '../../services'
import { useApiRequest } from '../../hooks/useApiRequest'
import { ErrorMessage, useToast } from '../../components'

const DIAS_SEMANA = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO']

function FormRota() {
  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { pontos: [] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'pontos' })
  const navigate   = useNavigate()
  const { codigo } = useParams()
  const editando   = !!codigo
  const { loading, error, execute } = useApiRequest()
  const toast = useToast()
  const [carregando, setCarregando] = useState(editando)
  const [modoMapa, setModoMapa]     = useState(false)

  const iframeRef = useRef(null)
  const appendRef = useRef(append)
  const fieldsRef = useRef(fields)

  useEffect(() => { appendRef.current = append }, [append])
  useEffect(() => { fieldsRef.current = fields }, [fields])

  const pontos   = watch('pontos') ?? []
  const posicoes = pontos
    .filter(p => p.latitude && p.longitude)
    .map((p, i) => ({
      lat:  Number(p.latitude),
      lng:  Number(p.longitude),
      nome: p.nome || `Ponto ${i + 1}`,
    }))

  // Escuta mensagens vindas do iframe: cliques no mapa e distância calculada pelo OSRM
  useEffect(() => {
    const onMessage = (e) => {
      if (e.data?.type === 'mapaClick') {
        const idx = fieldsRef.current.length + 1
        appendRef.current({
          latitude:  parseFloat(e.data.lat.toFixed(6)),
          longitude: parseFloat(e.data.lng.toFixed(6)),
          ordem:     idx,
          nome:      `Ponto ${idx}`,
        })
      }
      if (e.data?.type === 'distanciaCalculada') {
        // Preenche automaticamente o campo de distância com o valor real da rota
        setValue('distanciaKm', e.data.km, { shouldDirty: true })
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Atualiza o mapa editor quando pontos mudam
  useEffect(() => {
    if (!modoMapa || !iframeRef.current) return
    iframeRef.current.contentWindow?.postMessage({
      type:   'atualizarPontos',
      pontos: posicoes,
    }, '*')
  }, [posicoes.length, modoMapa])

  const onIframeLoad = () => {
    iframeRef.current?.contentWindow?.postMessage({
      type:   'atualizarPontos',
      pontos: posicoes,
    }, '*')
  }

  useEffect(() => {
    if (!editando) return
    execute(async () => {
      reset(await RotaService.buscarPorCodigo(codigo))
    }).catch(() => navigate('/rotas'))
      .finally(() => setCarregando(false))
  }, [codigo])

  const onSubmit = async (dados) => {
    const payload = {
      ...dados,
      pontos: (dados.pontos ?? []).map((p, i) => ({
        latitude:  Number(p.latitude),
        longitude: Number(p.longitude),
        ordem:     p.ordem !== undefined ? Number(p.ordem) : i + 1,
        nome:      p.nome || `Ponto ${i + 1}`,
      }))
    }
    let sucesso = false
    await execute(async () => {
      if (editando) {
        await RotaService.atualizar(codigo, payload)
      } else {
        await RotaService.cadastrar(payload)
      }
      sucesso = true
    })
    if (sucesso) {
      toast(editando ? 'Rota atualizada com sucesso' : 'Rota cadastrada com sucesso')
      navigate('/rotas')
    }
  }

  if (carregando) {
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => navigate('/rotas')} className="btn btn-ghost btn-sm">← Voltar</button>
        <h1 className="text-2xl font-bold">{editando ? 'Editar Rota' : 'Nova Rota'}</h1>
      </div>

      <ErrorMessage mensagem={error} />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
        {/* Dados básicos */}
        <div className="card bg-base-200">
          <div className="card-body gap-4">
            <h2 className="card-title text-base">Dados da rota</h2>

            <div className="form-control">
              <label className="label"><span className="label-text">Nome da rota *</span></label>
              <input type="text" placeholder="Ex: Rota Centro - Sul"
                className={`input input-bordered ${errors.nome ? 'input-error' : ''}`}
                {...register('nome', { required: 'Nome é obrigatório' })} />
              {errors.nome && <span className="text-error text-xs mt-1">{errors.nome.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Bairro *</span></label>
                <input type="text" placeholder="Ex: Centro"
                  className={`input input-bordered ${errors.bairro ? 'input-error' : ''}`}
                  {...register('bairro', { required: 'Bairro é obrigatório' })} />
                {errors.bairro && <span className="text-error text-xs mt-1">{errors.bairro.message}</span>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Cidade *</span></label>
                <input type="text" placeholder="Ex: Paranavaí"
                  className={`input input-bordered ${errors.cidade ? 'input-error' : ''}`}
                  {...register('cidade', { required: 'Cidade é obrigatória' })} />
                {errors.cidade && <span className="text-error text-xs mt-1">{errors.cidade.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Distância (km)</span>
                  {modoMapa && <span className="label-text-alt text-success text-xs">calculado automaticamente ao adicionar pontos</span>}
                </label>
                <input type="number" step="0.1" placeholder="25.5"
                  className="input input-bordered"
                  {...register('distanciaKm')} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Dia da semana</span></label>
                <select className="select select-bordered" {...register('diaSemana')}>
                  <option value="">Selecione</option>
                  {DIAS_SEMANA.map(d => (
                    <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pontos de coleta */}
        <div className="card bg-base-200">
          <div className="card-body gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="card-title text-base">Pontos de coleta</h2>
                <p className="text-xs text-base-content/50">
                  {modoMapa ? 'Clique no mapa para adicionar pontos' : 'Digite as coordenadas manualmente'}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setModoMapa(true)}
                  className={`btn btn-sm ${modoMapa ? 'btn-primary' : 'btn-outline btn-primary'}`}>
                  🗺️ Selecionar no mapa
                </button>
                <button type="button" onClick={() => setModoMapa(false)}
                  className={`btn btn-sm ${!modoMapa ? 'btn-primary' : 'btn-outline btn-primary'}`}>
                  ✏️ Manual
                </button>
              </div>
            </div>

            {/* Mapa editor via iframe */}
            {modoMapa && (
              <>
                <div className="alert alert-info py-2 text-sm">
                  <span>Clique no mapa para adicionar pontos em sequência. A rota é desenhada em tempo real.</span>
                </div>
                <div className="rounded-xl border border-base-300 overflow-hidden" style={{ height: '350px' }}>
                  <iframe
                    ref={iframeRef}
                    src="/mapa-editor.html"
                    title="Editor de pontos"
                    onLoad={onIframeLoad}
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  />
                </div>
              </>
            )}

            {/* Lista de pontos */}
            {fields.length === 0 ? (
              <p className="text-sm text-base-content/50 text-center py-2">Nenhum ponto adicionado ainda.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-1 bg-base-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary badge-sm shrink-0">{index + 1}</span>
                      <input
                        type="text"
                        placeholder={`Ponto ${index + 1}`}
                        className="input input-bordered input-xs flex-1 font-semibold"
                        {...register(`pontos.${index}.nome`)}
                      />
                      <button type="button" onClick={() => remove(index)}
                        className="btn btn-ghost btn-xs text-error shrink-0">✕</button>
                    </div>
                    {!modoMapa && (
                      <div className="flex gap-2 pl-7">
                        <input type="number" step="any" placeholder="Latitude"
                          className="input input-bordered input-xs flex-1"
                          {...register(`pontos.${index}.latitude`, { required: true })} />
                        <input type="number" step="any" placeholder="Longitude"
                          className="input input-bordered input-xs flex-1"
                          {...register(`pontos.${index}.longitude`, { required: true })} />
                      </div>
                    )}
                    {modoMapa && (
                      <p className="font-mono text-xs text-base-content/50 pl-7">
                        {Number(field.latitude).toFixed(6)}, {Number(field.longitude).toFixed(6)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!modoMapa && (
              <button type="button"
                className="btn btn-outline btn-primary btn-sm self-start"
                onClick={() => append({ latitude: '', longitude: '', ordem: fields.length + 1, nome: `Ponto ${fields.length + 1}` })}>
                + Adicionar ponto
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/rotas')} className="btn btn-ghost">Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm" /> : editando ? 'Salvar alterações' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormRota
