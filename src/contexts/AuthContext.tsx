
import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../services/firebaseConnection"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { doc, getDoc, setDoc } from "firebase/firestore"

// Define os dados e funções disponíveis no contexto de autenticação
interface AuthContextType {
   user: User | null,
   nameUser: string,
   setNameUser: Dispatch<SetStateAction<string>>,
   signed: boolean,
   signUp: (name: string, email: string, password: string) => Promise<void>,
   signIn: (email: string, password: string) => Promise<void>,
   signOutUser: () => Promise<void>,
   loading: boolean,
}

// Define o tipo dos componentes filhos do AuthProvider
type AuthProviderProps = {
   children: ReactNode
}

// Cria o contexto que será compartilhado entre os componentes
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider responsável por disponibilizar os dados de autenticação
export function AuthProvider({ children }: AuthProviderProps) {

   const navigate = useNavigate()

   // Armazena o usuário autenticado
   const [user, setUser] = useState<User | null>(null)

   // Verifica se existe um usuário autenticado
   const signed = !!user

   // Controla o carregamento da autenticação
   const [loading, setLoading] = useState(true)

   // Armazena o nome do usuário
   const [nameUser, setNameUser] = useState('')

   // Monitora as alterações no estado de autenticação do Firebase
   useEffect(() => {

      // Registra um observador que é chamado quando a autenticação muda
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

         // Atualiza o usuário autenticado
         setUser(firebaseUser)
         try {

            if (firebaseUser) {

               // Cria a referência do usuário no Firestore
               const userRef = doc(db, '@users', firebaseUser.uid)

               // Busca os dados do usuário cadastrado
               const userSnapshot = await getDoc(userRef)

               // Atualiza o nome utilizando os dados do Firestore
               setNameUser(userSnapshot.data()?.name ?? '')

            } else {
               // Limpa o nome quando não existe usuário autenticado
               setNameUser('')
            }
         } catch (error) {
            // Limpa o nome quando não existe usuário autenticado
            setNameUser('')
         } finally {
            // Finaliza o carregamento da autenticação
            setLoading(false)
         }

      })

      // Remove o observador quando o efeito é encerrado
      return unsubscribe;
   }, [])


   // Cadastrar Novo Usuario
   async function signUp(name: string, email: string, password: string) {

      // Verifica se os campos foram preenchidos
      if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
         toast.error("Preencha todos os campos!");
         return;
      }

      try {

         // Cria uma conta no Firebase Authentication
         const reg = await createUserWithEmailAndPassword(auth, email, password)

         // Recupera o ID do usuário recém-cadastrado
         const uid = reg.user.uid

         // Salva as informações do usuário no Firestore
         await setDoc(doc(db, '@users', uid), {
            name: name,
            email: email,
            data: new Date()
         })

         // Atualiza o nome no contexto
         setNameUser(name)

         // Exibe uma mensagem de sucesso
         toast.success('Cadastro realizado com sucesso!')

         // Redireciona para a página inicial
         navigate('/', { replace: true })

      } catch (error: any) {

         // Exibe a mensagem caso ocorra um erro no cadastro
         if (error instanceof Error)
            toast.error(error.message)
      }
   }

   // Fazer Login Do Usuario
   async function signIn(email: string, password: string) {

      try {

         // Realiza a autenticação com e-mail e senha
         const userCredential = await signInWithEmailAndPassword(auth, email, password)

         // Verifica se o Firebase retornou um usuário
         if (userCredential.user) {

            // Atualiza o carregamento e redireciona o usuário
            setLoading(false)
            navigate('/dashboard', { replace: true })

            // Exibe uma mensagem de boas-vindas
            toast.success('Seja Bem-vindo(a)!')
         }

      } catch (error) {

         // Recupera o código do erro retornado pelo Firebase
         const firebaseError = error as any

         // Trata os erros de autenticação conforme seus códigos
         switch (firebaseError.code) {

            // E-mail ou senha incorretos
            case 'auth/invalid-credential':
               toast.error('Email ou Senha Incorretos')
               break

            // Bloqueio temporário por excesso de tentativas
            case 'auth/too-many-requests':
               toast.error('O acesso foi temporariamente bloqueado devido a muitas tentativas consecutivas')
               break

            // Senha não informada
            case 'auth/missing-password':
               toast.error('Esperando a senha')
               break

            // E-mail inválido
            case 'auth/invalid-email':
               toast.error('Campo de email vazio ou email invalido!')
               break

            // Falha de conexão com o Firebase
            case 'auth/network-request-failed':
               toast.error('Erro de Conexão')
               break

            // Trata erros não previstos nos casos anteriores
            default:
               toast.error('Não foi possivel realizar o login')
         }
      }

   }

   // Encerrar Sessão Do Usuario
   async function signOutUser() {

      try {

         // Solicita a confirmação antes de encerrar a sessão
         const confirmacao = confirm('Deseja fazer o logOut?')

         if (confirmacao) {

            // Encerra a autenticação do usuário no Firebase
            await signOut(auth)
         }

      } catch (error) {

         // Exibe uma mensagem caso ocorra um erro ao sair
         toast.error('Não foi possivel realizer o logOut!')
      }
   }

   return (

      // Disponibiliza os estados e funções para os componentes filhos
      <AuthContext.Provider value={{ user, signed, signUp, signIn, signOutUser, loading, nameUser, setNameUser }}>
         {children}
      </AuthContext.Provider>
   )
}

// Hook personalizado para acessar o contexto de autenticação
export function useAuth() {

   // Recupera os dados disponibilizados pelo AuthContext
   const context = useContext(AuthContext)

   // Impede o uso do hook fora do AuthProvider
   if (context === undefined) {
      throw new Error("useAuth deve ser usado dentro de um AuthProvider")
   }

   // Retorna os dados e funções de autenticação
   return context
}
