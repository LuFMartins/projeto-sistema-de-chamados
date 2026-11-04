import "./singin.css"
import logo from "../../assets/logo-sistema-de-chamados.png"
import { useState } from "react"
import { Link, useNavigate} from "react-router-dom"
import { auth } from "../../services/firebaseConnection"
import { signInWithEmailAndPassword } from "firebase/auth"
import {toast} from 'react-toastify'

export default function SignIn() {

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const navigate = useNavigate()

   async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault();

      try {
         const userCredential = await signInWithEmailAndPassword(auth, email, password)

         if (userCredential.user) {
            toast.success("Usuário logado com sucesso!")
            navigate('/dashboard')
         } else {
            throw new Error("Erro ao fazer login!")
         }
      } catch (error) {
         console.log(error)
         if(error instanceof Error) {
            toast.error(error.message)
         }
      }
   }

   return (
      <div className="container-center">
         <div className="login">
            <div className="login-area">
               <img src={logo} alt="Logo Chamados" width={150} height={150} />
            </div>

            <form onSubmit={handleLogin}>
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