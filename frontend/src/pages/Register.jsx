import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services'

function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [foto, setFoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const handleFoto = (e) => {
    const arquivo = e.target.files[0]
    if (arquivo) {
      setFoto(arquivo)
      // createObjectURL gera uma URL temporária local para mostrar o preview sem fazer upload ainda
      setPreview(URL.createObjectURL(arquivo))
    }
  }

  const onSubmit = async (dados) => {
    // confirmarSenha é só validação no front — não precisa ir para o backend
    const { confirmarSenha, ...dadosEnvio } = dados

    setCarregando(true)
    try {
      await authService.registrar(dadosEnvio, foto)
      alert('Cadastro realizado! Faça login.')
      navigate('/login')
    } catch (error) {
      alert('Erro ao cadastrar. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  // watch('senha') permite comparar com confirmarSenha na validação do react-hook-form
  const senha = watch('senha')

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center py-8">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-2">
            Criar conta
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* foto de perfil */}
            <div className="flex flex-col items-center gap-2">
              <div className="avatar">
                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {preview ? (
                    <img src={preview} alt="preview" />
                  ) : (
                    <div className="bg-base-300 w-20 h-20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">👤</span>
                    </div>
                  )}
                </div>
              </div>
              <label className="btn btn-outline btn-sm cursor-pointer">
                Escolher foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFoto}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nome completo</span>
              </label>
              <input
                type="text"
                placeholder="João da Silva"
                className={`input input-bordered ${errors.nome ? 'input-error' : ''}`}
                {...register('nome', { required: 'Nome é obrigatório' })}
              />
              {errors.nome && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.nome.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...register('email', { required: 'Email é obrigatório' })}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Senha</span>
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                className={`input input-bordered ${errors.senha ? 'input-error' : ''}`}
                {...register('senha', {
                  required: 'Senha é obrigatória',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                })}
              />
              {errors.senha && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.senha.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirmar senha</span>
              </label>
              <input
                type="password"
                placeholder="Repita a senha"
                className={`input input-bordered ${errors.confirmarSenha ? 'input-error' : ''}`}
                {...register('confirmarSenha', {
                  required: 'Confirme a senha',
                  validate: (valor) => valor === senha || 'As senhas não coincidem'
                })}
              />
              {errors.confirmarSenha && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.confirmarSenha.message}</span>
                </label>
              )}
            </div>

            <button type="submit" className="btn btn-primary mt-2" disabled={carregando}>
              {carregando ? <span className="loading loading-spinner loading-sm"></span> : 'Cadastrar'}
            </button>
          </form>

          <div className="divider">ou</div>

          <p className="text-center text-sm">
            Já tem conta?{' '}
            <Link to="/login" className="link link-primary">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
