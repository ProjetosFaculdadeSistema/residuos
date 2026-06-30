import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'

/* ── Ícones SVG (stroke-based, estilo Heroicons) ───────────────────── */
const Icon = ({ d, d2 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.6}
    strokeLinecap="round" strokeLinejoin="round"
    className="w-[18px] h-[18px] shrink-0">
    <path d={d} />
    {d2 && <path d={d2} />}
  </svg>
)

const icons = {
  dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
      className="w-[18px] h-[18px] shrink-0">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  residuos: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
      className="w-[18px] h-[18px] shrink-0">
      <path d="M7 19H4.5A2.5 2.5 0 0 1 2 16.5v-4A6 6 0 0 1 8 7h.5" />
      <path d="M17 19h2.5A2.5 2.5 0 0 0 22 16.5v-4A6 6 0 0 0 16 7h-.5" />
      <path d="M12 7V3" />
      <path d="M9 3h6" />
      <path d="M9 21h6" />
      <path d="M12 21v-4" />
      <path d="M7 12a5 5 0 0 0 10 0" />
    </svg>
  ),
  coletas: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
      className="w-[18px] h-[18px] shrink-0">
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  motoristas: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
      className="w-[18px] h-[18px] shrink-0">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  veiculos: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
      className="w-[18px] h-[18px] shrink-0">
      <path d="M1 3h15l3 5h3a1 1 0 0 1 1 1v5H1V3z" />
      <path d="M1 14v4a1 1 0 0 0 1 1h1.5" />
      <path d="M20.5 19H22a1 1 0 0 0 1-1v-1" />
      <circle cx="5.5" cy="19" r="2" />
      <circle cx="17.5" cy="19" r="2" />
    </svg>
  ),
  rotas: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
      className="w-[18px] h-[18px] shrink-0">
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M5 8c0 5 4 5 8 8s7 3 7 3" />
      <path d="M5 6h6l5-3h3" />
    </svg>
  ),
  mapa: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
      className="w-[18px] h-[18px] shrink-0">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
      className="w-[16px] h-[16px] shrink-0">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
}

const links = [
  { to: '/',           label: 'Dashboard',  icon: icons.dashboard  },
  { to: '/residuos',   label: 'Resíduos',   icon: icons.residuos   },
  { to: '/coletas',    label: 'Coletas',     icon: icons.coletas    },
  { to: '/motoristas', label: 'Motoristas',  icon: icons.motoristas },
  { to: '/veiculos',   label: 'Veículos',    icon: icons.veiculos   },
  { to: '/rotas',      label: 'Rotas',       icon: icons.rotas      },
  { to: '/mapa',       label: 'Mapa',        icon: icons.mapa       },
]

function Sidebar() {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { usuario } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-primary text-primary-content shadow-xl shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-primary-content/20">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
            className="w-6 h-6 shrink-0">
            <path d="M7 19H4.5A2.5 2.5 0 0 1 2 16.5v-4A6 6 0 0 1 8 7h.5" />
            <path d="M17 19h2.5A2.5 2.5 0 0 0 22 16.5v-4A6 6 0 0 0 16 7h-.5" />
            <path d="M12 7V3M9 3h6M9 21h6M12 21v-4" />
            <path d="M7 12a5 5 0 0 0 10 0" />
          </svg>
          <span className="text-lg font-bold tracking-tight">Resíduos Sólidos</span>
        </div>
        <p className="text-xs text-primary-content/60 mt-1 ml-8">Gestão de coleta urbana</p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
               ${isActive
                 ? 'bg-primary-content/20 text-primary-content'
                 : 'text-primary-content/70 hover:bg-primary-content/10 hover:text-primary-content'
               }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Usuário + logout */}
      <div className="px-4 py-4 border-t border-primary-content/20">
        <div className="flex items-center gap-3 mb-3">
          {/* mostra a foto de perfil se existir, senão usa a inicial do nome */}
          <div className="w-9 h-9 rounded-full bg-primary-content/20 flex items-center justify-center shrink-0 text-sm font-bold overflow-hidden">
            {usuario?.foto
              ? <img src={usuario.foto} alt="perfil" className="w-full h-full object-cover" />
              : (usuario?.nome?.[0]?.toUpperCase() ?? 'U')
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{usuario?.nome ?? 'Usuário'}</p>
            <p className="text-xs text-primary-content/60 truncate">{usuario?.email ?? ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-primary-content/70 hover:text-error hover:bg-primary-content/10 transition-colors"
        >
          {icons.logout}
          Sair
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
