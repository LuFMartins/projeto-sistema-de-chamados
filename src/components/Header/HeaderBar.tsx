import { useAuth } from "../../contexts/AuthContext"
import "./header.css"

export default function HeaderBar() {

   const { nameUser } = useAuth()

   return (
      <header>
         <h1>Sistema de Chamados</h1>
         <p>Olá, <strong>{nameUser}!</strong></p>
      </header>
   )
}