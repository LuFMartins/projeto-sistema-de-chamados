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

   const { signOutUser, user, nameUser, setNameUser } = useAuth()
   const [upName, setUpName] = useState('')
   const [saving, setSaving] = useState(false)

   async function handleUpdateName(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault()
      // Tira os espaços no inicio e no final do nome
      const cleanName = upName.trim()
      
      if (cleanName === '' || cleanName === nameUser) {
         return;
      }
      
      setSaving(true)
      

      try {
         if (!user?.uid) return;
         await updateDoc(doc(db, "@users", user.uid), {
            name: cleanName,
         })

         setNameUser(cleanName)
         toast.success('Nome atualizado com sucesso!')
         setSaving(false)
      } catch (error) {
         console.log('Não foi possivel alterar o nome: ' + error)
         toast.error('Não foi possivel alterar o nome!')
      }

   }

   return (
      <div className='appLayout'>
         <HeaderBar />

         <div className='content'>

            <TitleBar
               icon={FiSettings}
               title="Perfil"
            />

            <div className='profileContainer'>
               <form className='formUser' onSubmit={handleUpdateName}>
                  <label>Nome</label>
                  <input type="text" placeholder={nameUser} value={upName} onChange={(e) => setUpName(e.target.value)} />

                  <label>E-mail</label>
                  <input type="email" placeholder={user?.email ?? undefined} disabled={true} style={{ cursor: "not-allowed" }} />
                  <button
                     type='submit'
                     className='btSaveInfo'
                     disabled={saving ? true : false}
                  >
                     {saving ? 'Salvando...' : 'Salvar'}
                  </button>
               </form>
            </div>

            <button onClick={signOutUser} className='btLogOut'>SAIR</button>

         </div>

      </div>
   )
}