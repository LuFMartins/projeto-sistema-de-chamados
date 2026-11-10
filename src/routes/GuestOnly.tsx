import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function GuestOnly({ children }: { children: React.ReactNode }) {

   const { loading, signed } = useAuth()

   if (loading) {
      return (<div>Carregando...</div>)
   }

   if (signed) {
      return <Navigate to="/dashboard" />
   }

   return (
      <div>
         {children}
      </div>
   )

}