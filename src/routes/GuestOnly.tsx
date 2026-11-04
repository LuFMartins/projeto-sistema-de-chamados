import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import {onAuthStateChanged} from "firebase/auth"
import { auth } from "../services/firebaseConnection"

export default function GuestOnly({ children }: { children: React.ReactNode }) {

   const [loading, setLoading] = useState(true)
   const [signed, setSigned] = useState(false)

   async function checkLogin() {
      console.log("Verificando login do usuário...")
      
      const unsubscribe = onAuthStateChanged(auth, (user: any) => {
         if(user){
            const userData = {
               uid: user.uid,
               email: user.email,
            }
            localStorage.setItem('user', JSON.stringify(userData))

            setLoading(false)
            setSigned(true)
         } else {

            localStorage.removeItem('user')
            setLoading(false)
            setSigned(false)
         }
      })

      return unsubscribe;
   }
   
   useEffect(() => {
      checkLogin()
   }, [])

   
   if(loading) {
      return(<div>Carregando...</div>)
   }

   if(signed) {
      return <Navigate to="/dashboard" />
   }

    return (
        <div>
            {children}
        </div>
    )

}