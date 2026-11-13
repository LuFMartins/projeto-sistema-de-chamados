import { Route, Routes } from 'react-router-dom'

import SignIn from '../pages/SignIn/SignIn'
import SignUp from '../pages/SignUp/SignUp'
import Dashbord from '../pages/Dashbord/Dashbord'
import Private from './Private'
import GuestOnly from './GuestOnly'
import Profile from '../pages/Profile/Profile'

export default function RoutesApp() {
   return (
      <Routes>
         <Route path="/" element={
            <GuestOnly>
               <SignIn />
            </GuestOnly>
         } />

         <Route path="/signup" element={
            <GuestOnly>
               <SignUp />
            </GuestOnly>
         } />

         <Route path="/dashboard" element={
            <Private>
               <Dashbord />
            </Private>
         } />

         <Route path="/profile" element={
            <Private>
               <Profile />
            </Private>
         } />

         <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
   )
}