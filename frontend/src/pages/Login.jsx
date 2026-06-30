import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services'
import { loginSuccess } from '../store/authSlice'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (dados) => {
    try {
      const resposta = await authService.login(dados)
      // o token vai para o localStorage (para sobreviver ao reload)
      // e o usuario vai para o Redux — o authSlice cuida de persistir o usuario também
      localStorage.setItem('token', resposta.token)
      dispatch(loginSuccess({ token: resposta.token, usuario: resposta.usuario }))
      navigate('/')
    } catch (error) {
      alert('Email ou senha incorretos!')
    }
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="card w-full max-w-sm bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-4">
            ♻️ Resíduos Sólidos
          </h2>
          <p className="text-center text-base-content/70 mb-6">Faça login para continuar</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                placeholder="••••••••"
                className={`input input-bordered ${errors.senha ? 'input-error' : ''}`}
                {...register('senha', { required: 'Senha é obrigatória' })}
              />
              {errors.senha && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.senha.message}</span>
                </label>
              )}
            </div>

            <button type="submit" className="btn btn-primary mt-2">
              Entrar
            </button>
          </form>

          <div className="divider">ou</div>

          <p className="text-center text-sm">
            Não tem conta?{' '}
            <Link to="/register" className="link link-primary">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
