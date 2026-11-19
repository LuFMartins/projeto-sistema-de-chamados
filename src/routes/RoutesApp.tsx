import { Route, Routes } from 'react-router-dom'

import SignIn from '../pages/SignIn/SignIn'
import SignUp from '../pages/SignUp/SignUp'
import Dashboard from '../pages/Dashboard/Dashboard'
import Private from './Private'
import GuestOnly from './GuestOnly'
import Profile from '../pages/Profile/Profile'
import Customers from '../pages/Customers/Customers'
import New from '../pages/New/New'

// Componente responsável por definir as rotas da aplicação
export default function RoutesApp() {
   return (
      <Routes>

         {/* Rota de login, acessível apenas para visitantes */}
         <Route path="/" element={
            <GuestOnly>
               <SignIn />
            </GuestOnly>
         } />

         {/* Rota de cadastro de usuários */}
         <Route path="/signup" element={
            <GuestOnly>
               <SignUp />
            </GuestOnly>
         } />

         {/* Rota protegida para visualizar os chamados */}
         <Route path="/dashboard" element={
            <Private>
               <Dashboard />
            </Private>
         } />

         {/* Rota protegida para visualizar e editar o perfil */}
         <Route path="/profile" element={
            <Private>
               <Profile />
            </Private>
         } />

         {/* Rota protegida para cadastrar clientes */}
         <Route path="/customers" element={
            <Private>
               <Customers />
            </Private>
         } />

         {/* Rota protegida para criar um novo chamado */}
         <Route path="/new" element={
            <Private>
               <New />
            </Private>
         } />

         {/* Rota dinâmica para editar um chamado pelo ID */}
         <Route path="/new/:id" element={
            <Private>
               <New />
            </Private>
         } />

         {/* Exibe uma mensagem quando a rota não existe */}
         <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
   )
}
