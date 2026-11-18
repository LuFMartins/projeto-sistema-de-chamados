import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import LoadingPage from "../pages/LoadingPage/LoadingPage"

export default function GuestOnly({ children }: { children: React.ReactNode }) {

   const { loading, signed } = useAuth()

   if (loading) {
      return (
         <LoadingPage />
      )
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