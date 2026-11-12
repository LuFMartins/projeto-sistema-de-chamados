import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "./header.css"
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'

export default function HeaderBar() {

   const { nameUser } = useAuth()

   return (
      <header>
         <img src="src\assets\logo-branca-500.png" alt="Logo" width={200}/>

         <p>Olá, <strong>{nameUser}!</strong></p>

         <nav>
            
            <Link to="/dashboard">
               <FiHome color="white" size={20} />
               Home
            </Link>
            <Link to="/customers">
               <FiUser color="white" size={20} />
               Clientes
            </Link>
            <Link to="/profile">
               <FiSettings color="white" size={20} />
               Perfil
            </Link>
         </nav>
      </header>
   )
}