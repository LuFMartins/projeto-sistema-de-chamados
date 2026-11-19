import logo from "../../assets/logo.png"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export default function SignUp() {

  // Armazena os dados preenchidos pelo usuário
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  // Recupera a função de cadastro do contexto de autenticação
  const { signUp } = useAuth()

  // Executa o cadastro ao enviar o formulário
  async function handleSignUp(e: React.SubmitEvent<HTMLFormElement>) {
    // Impede o recarregamento da página
    e.preventDefault();

    // Envia os dados para a função de cadastro e aguarda sua execução
    await signUp(name, email, password)

    // Limpa os campos após a execução da função
    setName('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="container-center">
      <div className="login">

        {/* Área que exibe a logo do sistema */}
        <div className="login-area">
          <img src={logo} alt="Logo Chamados" width={150} height={150} />
        </div>

        {/* Formulário de cadastro de usuários */}
        <form onSubmit={handleSignUp} className="signForm">
          <h1>Cadastrar</h1>

          {/* Campo para informar o nome do usuário */}
          <input type="text"
            placeholder="Nome"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}

          />

          {/* Campo para informar o e-mail */}
          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />

          {/* Campo para informar a senha */}
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />

          {/* Botão para enviar o formulário de cadastro */}
          <button type="submit">Cadastrar</button>
        </form>

        {/* Link para a página de login */}
        <Link to="/">Já tenho uma conta? Acesse aqui</Link>
      </div>
    </div>
  )
}
