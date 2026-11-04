import logo from "../../assets/logo-sistema-de-chamados.png"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../../services/firebaseConnection"
import { createUserWithEmailAndPassword } from "firebase/auth"
import {toast} from 'react-toastify'

export default function SignUp() {

   const navigate = useNavigate()
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [name, setName] = useState('')

   async function handleSignUp(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault();
      if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
         toast.error("Preencha todos os campos!");
         return;
      }

      try {
         const userCredential = await createUserWithEmailAndPassword(auth, email, password);

         if(userCredential.user) {
            toast.success("Usuário cadastrado com sucesso!");
            navigate('/');
         } else {
            throw new Error("Erro ao cadastrar usuário!");
         }
      } catch (error) {
         if(error instanceof Error) {
            toast.error(error.message);
         }
      } finally {
         setName('');
         setEmail('');
         setPassword('');
      }
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