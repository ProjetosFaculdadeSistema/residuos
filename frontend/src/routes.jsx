import { createBrowserRouter } from 'react-router-dom'
import { Login, Register, Home, NotFound } from './pages'
import { ListaResiduos, FormResiduo, DetalhesResiduo } from './pages/residuos'
import { ListaMotoristas, FormMotorista } from './pages/motoristas'
import { ListaVeiculos, FormVeiculo } from './pages/veiculos'
import { ListaRotas, FormRota, MapaRotas } from './pages/rotas'
import { ListaColetas, FormColeta } from './pages/coletas'
import { ProtectedRoute } from './components'

export const router = createBrowserRouter([
  { path: '/login',    element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <NotFound />,
    children: [
      { path: '/',                        element: <Home /> },
      { path: '/residuos',                element: <ListaResiduos /> },
      { path: '/residuos/novo',           element: <FormResiduo /> },
      { path: '/residuos/:codigo',        element: <DetalhesResiduo /> },
      { path: '/residuos/:codigo/editar', element: <FormResiduo /> },
      { path: '/motoristas',              element: <ListaMotoristas /> },
      { path: '/motoristas/novo',         element: <FormMotorista /> },
      { path: '/motoristas/:codigo/editar', element: <FormMotorista /> },
      { path: '/veiculos',                element: <ListaVeiculos /> },
      { path: '/veiculos/novo',           element: <FormVeiculo /> },
      { path: '/veiculos/:codigo/editar', element: <FormVeiculo /> },
      { path: '/rotas',                   element: <ListaRotas /> },
      { path: '/rotas/novo',              element: <FormRota /> },
      { path: '/rotas/:codigo/editar',    element: <FormRota /> },
      { path: '/mapa',                    element: <MapaRotas /> },
      { path: '/coletas',                 element: <ListaColetas /> },
      { path: '/coletas/nova',            element: <FormColeta /> },
      { path: '/coletas/:codigo/editar',  element: <FormColeta /> },
    ]
  }
])
