import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../services/firebaseConnection"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { doc, getDoc, setDoc } from "firebase/firestore"

interface AuthContextType {
   user: User | null,
   nameUser: string,
   signed: boolean,
   signUp: (name: string, email: string, password: string) => Promise<void>,
   signIn: (email: string, password: string) => Promise<void>,
   signOutUser: () => Promise<void>,
   loading: boolean
}

type AuthProviderProps = {
   children: ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps) {

   const navigate = useNavigate()
   const [user, setUser] = useState<User | null>(null)
   const signed = !!user
   const [loading, setLoading] = useState(true)
   const [nameUser, setNameUser] = useState('')

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
         setUser(firebaseUser)

         if (firebaseUser) {
            const userRef = doc(db, '@users', firebaseUser.uid)

            const userSnapshot = await getDoc(userRef)

            setNameUser(userSnapshot.data()?.name)
         } else {
            setNameUser('')
         }

         setLoading(false)
      })

      return unsubscribe;
   }, [])


   // Cadastrar Novo Usuario
   async function signUp(name: string, email: string, password: string) {
      if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
         toast.error("Preencha todos os campos!");
         return;
      }

      try {

         const reg = await createUserWithEmailAndPassword(auth, email, password)
         const uid = reg.user.uid

         await setDoc(doc(db, '@users', uid), {
            name: name,
            email: email,
            data: new Date()
         })

         setNameUser(name)

         toast.success('Cadastro realizado com sucesso!')
         navigate('/', { replace: true })

      } catch (error: any) {
         if (error instanceof Error)
            toast.error(error.message)
      }
   }

   // Fazer Login Do Usuario
   async function signIn(email: string, password: string) {

      try {
         const userCredential = await signInWithEmailAndPassword(auth, email, password)
         if (userCredential.user) {
            setLoading(false)
            navigate('/dashbord', { replace: true })
            toast.success('Seja Bem-vindo(a)!')
         }
      } catch (error) {
         const firebaseError = error as any

         switch (firebaseError.code) {
            case 'auth/invalid-credential':
               toast.error('Email ou Senha Incorretos')
               break
            case 'auth/too-many-requests':
               toast.error('O acesso foi temporariamente bloqueado devido a muitas tentativas consecutivas')
               break
            case 'auth/missing-password':
               toast.error('Esperando a senha')
               break
            case 'auth/invalid-email':
               toast.error('Campo de email vazio ou email invalido!')
               break
            case 'auth/network-request-failed':
               toast.error('Erro de Conexão')
               break
            default:
               toast.error('Não foi possivel realizar o login')
         }
      }

   }

   // Encerrar Sessão Do Usuario
   async function signOutUser() {
      try {

         const confirmacao = confirm('Deseja fazer o logOut?')

         if (confirmacao) {
            await signOut(auth)
         }

      } catch (error) {
         toast.error('Não foi possivel realizer o logOut!')
      }
   }

   return (
      <AuthContext.Provider value={{ user, signed, signUp, signIn, signOutUser, loading, nameUser }}>
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