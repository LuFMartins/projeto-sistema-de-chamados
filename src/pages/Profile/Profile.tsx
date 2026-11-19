import HeaderBar from '../../components/HeaderBar/HeaderBar'
import TitleBar from '../../components/TitleBar/TitleBar'
import { FiSettings } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import './profile.css'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

export default function Profile() {

   // Recupera os dados do usuário e a função de logout do contexto
   const { signOutUser, user, nameUser, setNameUser } = useAuth()

   // Armazena o novo nome digitado pelo usuário
   const [upName, setUpName] = useState('')

   // Controla o estado de salvamento das alterações
   const [saving, setSaving] = useState(false)

   // Executa a atualização do nome do usuário
   async function handleUpdateName(e: React.SubmitEvent<HTMLFormElement>) {

      // Impede o recarregamento da página
      e.preventDefault()

      // Tira os espaços no inicio e no final do nome
      const cleanName = upName.trim()

      // Impede a atualização se o nome estiver vazio ou não tiver mudado
      if (cleanName === '' || cleanName === nameUser) {
         return;
      }

      // Indica que a atualização está sendo realizada
      setSaving(true)

      try {

         // Verifica se existe um usuário autenticado
         if (!user?.uid) return;

         // Atualiza o nome do usuário no Firestore
         await updateDoc(doc(db, "@users", user.uid), {
            name: cleanName,
         })

         // Atualiza o nome armazenado no contexto de autenticação
         setNameUser(cleanName)

         // Exibe uma mensagem de sucesso
         toast.success('Nome atualizado com sucesso!')

         // Finaliza o estado de salvamento
         setSaving(false)

      } catch (error) {
         // Exibe uma mensagem caso ocorra um erro na atualização
         console.log('Não foi possivel alterar o nome: ' + error)
         toast.error('Não foi possivel alterar o nome!')
      } finally {
         // Finaliza o estado de salvamento
         setSaving(false)
      }

   }

   return (
      <div className='appLayout'>

         {/* Menu de navegação do sistema */}
         <HeaderBar />

         <div className='content'>

            {/* Título da página */}
            <TitleBar
               icon={FiSettings}
               title="Perfil"
            />

            {/* Área do formulário de edição do perfil */}
            <div className='formContainer'>

               {/* Formulário para atualizar o nome do usuário */}
               <form className='formUser' onSubmit={handleUpdateName}>

                  {/* Campo para informar o novo nome */}
                  <label>Nome</label>
                  <input type="text" placeholder={nameUser} value={upName} onChange={(e) => setUpName(e.target.value)} />

                  {/* Exibe o e-mail do usuário sem permitir alterações */}
                  <label>E-mail</label>
                  <input type="email" placeholder={user?.email ?? undefined} disabled={true} style={{ cursor: "not-allowed" }} />

                  {/* Botão para salvar as alterações */}
                  <button
                     type='submit'
                     className='btSaveInfo'
                     disabled={saving ? true : false}
                  >
                     {/* Altera o texto durante o salvamento */}
                     {saving ? 'Salvando...' : 'Salvar'}
                  </button>

               </form>
            </div>

            {/* Botão para encerrar a sessão do usuário */}
            <button onClick={signOutUser} className='btLogOut'>SAIR</button>

         </div>

      </div>
   )
}
