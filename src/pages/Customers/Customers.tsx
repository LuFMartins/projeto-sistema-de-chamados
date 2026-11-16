import HeaderBar from '../../components/HeaderBar/HeaderBar'
import TitleBar from '../../components/TitleBar/TitleBar'
import { FiUser } from 'react-icons/fi'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

export default function Customers() {

   const [nomeEmpresa, setNomeEmpresa] = useState('')
   const [cnpj, setCnpj] = useState('')
   const [endereco, setEndereco] = useState('')
   const [saving, setSaving] = useState(false)

   async function handleCreateCustomers(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault()

      if (nomeEmpresa.trim() === "" || cnpj.trim() === "" || endereco.trim() === "") {
         toast.info('Preencha todos os campos!')
         return;
      }

      setSaving(true)

      try {
         await addDoc(collection(db, '@customers'), {
            nomeFantasia: nomeEmpresa,
            cnpj: cnpj,
            endereco: endereco
         })

         toast.success('Registro realizado com sucesso!')

         setNomeEmpresa('')
         setCnpj('')
         setEndereco('')
         setSaving(false)

      } catch (error) {
         toast.error('Não foi possivel cadastrar empresa!')
         console.log(`ERRO: ${error}`)
      }
   }

   return (
      <div className='appLayout'>
         <HeaderBar />

         <div className='content'>

            <TitleBar
               icon={FiUser}
               title="Clientes"
            />

            <div className='formContainer'>

               <form className='formUser' onSubmit={handleCreateCustomers}>

                  <label>Nome Fantasia</label>
                  <input type="text" placeholder='Nome da empresa' value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} />

                  <label>CNPJ</label>
                  <input type="text" placeholder='Digite o CNPJ' value={cnpj} onChange={(e) => setCnpj(e.target.value)} />

                  <label>Endereço</label>
                  <input type="text" placeholder='Endereço da empresa' value={endereco} onChange={(e) => setEndereco(e.target.value)} />

                  <button
                     type='submit'
                     className='btSaveInfo'
                     disabled={saving ? true : false}
                  >
                     {saving ? 'Salvando...' : 'Salvar'}
                  </button>

               </form>

            </div>

         </div>

      </div>
   )
}