import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../services/firebaseConnection"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

interface AuthContextType {
   user: User | null,
   signed: boolean,
   signIn: (email: string, password: string) => Promise<void>,
   signOutUser: () => Promise<void>,
   loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: any) {

   const navigate = useNavigate()
   const [user, setUser] = useState<User | null>(null)
   const signed = !!user
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
      })

      return unsubscribe;
   }, [])

   async function signIn(email: string, password: string) {

      try {
         const userCredential = await signInWithEmailAndPassword(auth, email, password)
         if (userCredential.user) {
            setUser(userCredential.user)
            setLoading(false)
            navigate('/dashbord')
            toast.success('Seja Bem-vindo(a)!')
         }
      } catch (error) {
         const firebaseError = error as any

         if (firebaseError.code === 'auth/invalid-credential') {
            toast.error('Email ou Senha Incorretos')
         }
         if (firebaseError.code === 'auth/too-many-requests') {
            toast.error('O acesso foi temporariamente bloqueado devido a muitas tentativas consecutivas')
         }
         if (firebaseError.code === 'auth/missing-password') {
            toast.error('Esperando a senha')
         }
         if (firebaseError.code === 'auth/invalid-email') {
            toast.error('Campo de email vazio ou email invalido!')
         }
         if (firebaseError.code === 'auth/network-request-failed') {
            toast.error('Erro de Conexão')
         }
      }

   }

   async function signOutUser() {
      await signOut(auth)
   }

   return (
      <AuthContext.Provider value={{ user, signed, signIn, signOutUser, loading }}>
         {children}
      </AuthContext.Provider>
   )
}

export function useAuth() {
   const context = useContext(AuthContext)

   if (context === undefined) {
      throw new Error("useAuth deve ser usado dentro de um AuthProvider")
   }
   return context
}