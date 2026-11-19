
import { NavLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "./header.css"
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'
import logoBranca from '../../assets/logoBranca.png'

export default function HeaderBar() {

  // Recupera o nome do usuário autenticado
  const { nameUser } = useAuth()

  return (
    // Cabeçalho lateral do sistema
    <header>
      <div className="topHeader">

        {/* Exibe a logo do sistema */}
        <img src={logoBranca} alt="Logo" width={200}/>

        {/* Menu de navegação entre as páginas */}
        <nav>

          {/* Link para a página de chamados */}
          <NavLink to="/dashboard" >
            <FiHome color="white" size={20} />
            Chamados
          </NavLink>

          {/* Link para a página de clientes */}
          <NavLink to="/customers">
            <FiUser color="white" size={20} />
            Clientes
          </NavLink>

          {/* Link para a página de perfil */}
          <NavLink to="/profile">
            <FiSettings color="white" size={20} />
            Perfil
          </NavLink>
        </nav>
      </div>

      {/* Exibe uma saudação com o nome do usuário */}
      <p>Olá, <strong>{nameUser}!</strong></p>
    </header>
  )
}
