import logo from "../../assets/logo-sistema-de-chamados.png"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from 'react-toastify'
import { useAuth } from "../../contexts/AuthContext"

export default function SignUp() {

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [name, setName] = useState('')
   const { signUp } = useAuth()

   async function handleSignUp(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault();

      await signUp(name, email, password)

      setName('');
      setEmail('');
      setPassword('');

   }

   return (
      <div className="container-center">
         <div className="login">
            <div className="login-area">
               <img src={logo} alt="Logo Chamados" width={150} height={150} />
            </div>

            <form onSubmit={handleSignUp}>
               <h1>Cadastrar</h1>

               <input type="text"
                  placeholder="Nome"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}

               />

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

               <button type="submit">Cadastrar</button>
            </form>

            <Link to="/">Já tenho uma conta? Acesse aqui</Link>
         </div>
      </div>
   )
}