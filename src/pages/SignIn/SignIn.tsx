
import "./singin.css"
import logo from "../../assets/logo.png"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from '../../contexts/AuthContext'

export default function SignIn() {

  // Armazena o e-mail e a senha digitados pelo usuário
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Recupera a função de login do contexto de autenticação
  const { signIn } = useAuth()

  // Executa o login ao enviar o formulário
  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    // Impede o recarregamento da página
    e.preventDefault();

    // Envia o e-mail e a senha para a função de autenticação
    signIn(email, password)
  }

  return (
    <div className="container-center">
      <div className="login">

        {/* Área que exibe a logo do sistema */}
        <div className="login-area">
          <img src={logo} alt="Logo Chamados" width={150} height={150} />
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleLogin} className="signForm">
          <h1>Entrar</h1>

          {/* Campo de e-mail controlado pelo estado */}
          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />

          {/* Campo de senha controlado pelo estado */}
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />

          {/* Botão para enviar os dados de login */}
          <button type="submit">Acessar</button>
        </form>

        {/* Link para a página de cadastro */}
        <Link to="/signup">Não tem uma conta? Cadastre-se</Link>
      </div>
    </div>
  )
}
