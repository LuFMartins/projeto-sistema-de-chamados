import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Private({ children }: { children: React.ReactNode }) {

   const {loading, signed} = useAuth() 

   if(loading) {
      return(<div>Carregando...</div>)
   }

   if(!signed) {
      return <Navigate to="/" />
   }

    return (
        <div>
            {children}
        </div>
    )

}