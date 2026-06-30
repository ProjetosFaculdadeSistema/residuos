import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import ListaResiduos from './pages/residuos/ListaResiduos'
import FormResiduo from './pages/residuos/FormResiduo'
import DetalhesResiduo from './pages/residuos/DetalhesResiduo'

import ListaMotoristas from './pages/motoristas/ListaMotoristas'
import FormMotorista from './pages/motoristas/FormMotorista'

import ListaVeiculos from './pages/veiculos/ListaVeiculos'
import FormVeiculo from './pages/veiculos/FormVeiculo'

import ListaRotas from './pages/rotas/ListaRotas'
import FormRota from './pages/rotas/FormRota'

import ListaColetas from './pages/coletas/ListaColetas'
import FormColeta from './pages/coletas/FormColeta'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/residuos', element: <ListaResiduos /> },
      { path: '/residuos/novo', element: <FormResiduo /> },
      { path: '/residuos/:codigo', element: <DetalhesResiduo /> },
      { path: '/residuos/:codigo/editar', element: <FormResiduo /> },
      { path: '/motoristas', element: <ListaMotoristas /> },
      { path: '/motoristas/novo', element: <FormMotorista /> },
      { path: '/motoristas/:codigo/editar', element: <FormMotorista /> },
      { path: '/veiculos', element: <ListaVeiculos /> },
      { path: '/veiculos/novo', element: <FormVeiculo /> },
      { path: '/veiculos/:codigo/editar', element: <FormVeiculo /> },
      { path: '/rotas', element: <ListaRotas /> },
      { path: '/rotas/novo', element: <FormRota /> },
      { path: '/rotas/:codigo/editar', element: <FormRota /> },
      { path: '/coletas', element: <ListaColetas /> },
      { path: '/coletas/nova', element: <FormColeta /> },
      { path: '/coletas/:codigo/editar', element: <FormColeta /> },
    ]
  }
])
