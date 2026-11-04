import { Route, Routes } from 'react-router-dom'

import SignIn from '../pages/SignIn/SignIn' 
import SignUp from '../pages/SignUp/SignUp'
import Dashbord from '../pages/Dashbord/Dashbord'

export default function RoutesApp() {
   return (
      <Routes>
         <Route path="/" element={<SignIn />} />
         <Route path="/signup" element={<SignUp />} />
         <Route path="/dashboard" element={<Dashbord />} />
      </Routes>
   )
}