import { NavLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "./header.css"
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'

export default function HeaderBar() {

   const { nameUser } = useAuth()

   return (
      <header>
         <div className="topHeader">
            <img src="src\assets\logo-branca-500.png" alt="Logo" width={200}/>
            <nav>
            
               <NavLink to="/dashboard" >
                  <FiHome color="white" size={20} />
                  Home
               </NavLink>
               <NavLink to="/customers">
                  <FiUser color="white" size={20} />
                  Clientes
               </NavLink>
               <NavLink to="/profile">
                  <FiSettings color="white" size={20} />
                  Perfil
               </NavLink>
            </nav>
         </div>


         <p>Olá, <strong>{nameUser}!</strong></p>
      </header>
   )
}