import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { usuario } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="navbar bg-base-200 shadow-lg px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          ♻️ Resíduos Sólidos
        </Link>
      </div>

      <div className="flex-none hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li><Link to="/residuos">Resíduos</Link></li>
          <li><Link to="/motoristas">Motoristas</Link></li>
          <li><Link to="/veiculos">Veículos</Link></li>
          <li><Link to="/rotas">Rotas</Link></li>
          <li><Link to="/coletas">Coletas</Link></li>
        </ul>
      </div>

      <div className="flex-none ml-4">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10">
              {usuario?.foto ? (
                <img src={usuario.foto} alt="perfil" className="rounded-full" />
              ) : (
                <span className="text-lg">
                  {usuario?.nome ? usuario.nome[0].toUpperCase() : 'U'}
                </span>
              )}
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
            <li className="menu-title">
              <span>{usuario?.nome || 'Usuário'}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="text-error">
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-none md:hidden ml-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
            <li><Link to="/residuos">Resíduos</Link></li>
            <li><Link to="/motoristas">Motoristas</Link></li>
            <li><Link to="/veiculos">Veículos</Link></li>
            <li><Link to="/rotas">Rotas</Link></li>
            <li><Link to="/coletas">Coletas</Link></li>
            <li><button onClick={handleLogout} className="text-error">Sair</button></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
