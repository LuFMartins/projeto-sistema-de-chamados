import "./singin.css"
import logo from "../../assets/logo-sistema-de-chamados.png"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from '../../contexts/AuthContext'


export default function SignIn() {

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const { signIn } = useAuth()

   async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault();
      signIn(email, password)
   }

   return (
      <div className="container-center">
         <div className="login">
            <div className="login-area">
               <img src={logo} alt="Logo Chamados" width={150} height={150} />
            </div>

            <form onSubmit={handleLogin} className="signForm">
               <h1>Entrar</h1>

               <input
                  type="text"
                  placeholder="email@email.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
               />

               <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
               />

               <button type="submit">Acessar</button>
            </form>

            <Link to="/signup">Não tem uma conta? Cadastre-se</Link>
         </div>
      </div>
   )
}