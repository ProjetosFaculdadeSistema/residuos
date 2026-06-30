import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-base-content/20">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Página não encontrada</h2>
        <p className="text-base-content/70 mt-2">A página que você buscou não existe.</p>
        <Link to="/" className="btn btn-primary mt-6">Voltar ao início</Link>
      </div>
    </div>
  )
}

export default NotFound
