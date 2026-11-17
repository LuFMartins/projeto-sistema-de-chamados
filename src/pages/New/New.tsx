import { FiPlusCircle } from "react-icons/fi";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import TitleBar from "../../components/TitleBar/TitleBar";
import "./new.css"
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";

interface customers {
   id: string,
   nomeFantasia: string
}

export default function New() {


   const [status, setStatus] = useState<'Aberto' | 'Progresso' | 'Atendido'>('Aberto')
   const [assunto, setAssunto] = useState<'Suporte' | 'Visita Tecnica' | 'Financeiro'>('Suporte')
   const [customers, setCustomers] = useState<customers[]>([])
   const [loadingCustomers, setLoadingCustomers] = useState(true)
   const [selectCustomers, setSelectCustomers] = useState(0)
   const [description, setDescription] = useState('')

   const listRef = collection(db, "@customers")

   useEffect(() => {
      async function loadCustomers() {
         try {
            const querySnapshot = await getDocs(listRef)

            const lista: customers[] = querySnapshot.docs.map((documento) => {
               const dados = documento.data()

               return {
                  id: documento.id,
                  nomeFantasia: dados.nomeFantasia
               }
            })

            setCustomers(lista)
            setLoadingCustomers(false)


         } catch (error) {
            console.log('Erro ao buscar os Clientes')
            setLoadingCustomers(false)
            setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
         }
      }

      loadCustomers()
   }, [])


   function handleOptionChange(e: React.ChangeEvent<HTMLInputElement>) {
      setStatus(e.target.value as 'Aberto' | 'Progresso' | 'Atendido')
   }

   function handleChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
      setAssunto(e.target.value as 'Suporte' | 'Visita Tecnica' | 'Financeiro')
   }

   function handleSelectCustomers(e: React.ChangeEvent<HTMLSelectElement>) {
      setSelectCustomers(Number(e.target.value))
   }

   async function handleNewChamado(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault()

      try {

         await addDoc(collection(db, '@calls'), {
            cliente: customers[selectCustomers].nomeFantasia,
            assunto: assunto,
            status: status,
            complemento: description.trim() === '' ? null : description
         })

         toast.success("Chamado registrado com sucesso!")
         setSelectCustomers(0)
         setDescription('')
         setStatus('Aberto')
         setAssunto('Suporte')

      } catch (error) {
         console.log(`Não foi possivel registrar o chamado : ${error}`)
         toast.error('Não foi possivel registrar o chamado!')
      }
   }

   return (
      <div className="appLayout">
         <HeaderBar />

         <div className="content">
            <TitleBar icon={FiPlusCircle} title="Novo Chamado" />

            <form onSubmit={handleNewChamado} className="formContainerNew">
               <label>Cliente</label>

               {loadingCustomers ?
                  <input type="text" disabled={true} placeholder="CARREGANDO..." style={{width:"fit-content", padding:'10px'}}/> :
                  <select value={selectCustomers} onChange={handleSelectCustomers}>
                     {customers.map((item, index) => (
                        <option key={index} value={index}>{item.nomeFantasia}</option>
                     ))}
                  </select>
               }



               <label>Assunto</label>
               <select value={assunto} onChange={handleChangeSelect}>
                  <option value="Suporte">Suporte</option>
                  <option value="Visita Tecnica">Visita Tecnica</option>
                  <option value="Financeiro">Financeiro</option>
               </select>

               <label>Status</label>
               <div className="status">
                  <label>
                     <input type="radio" name="radio" value="Aberto" onChange={handleOptionChange} checked={status === 'Aberto'} />
                     Aberto
                  </label>
                  <label>
                     <input type="radio" name="radio" value="Progresso" onChange={handleOptionChange} checked={status === 'Progresso'} />
                     Progresso
                  </label>
                  <label>
                     <input type="radio" name="radio" value="Atendido" onChange={handleOptionChange} checked={status === 'Atendido'} />
                     Atendido
                  </label>
               </div>

               <label>Complemento</label>
               <textarea value={description} onChange={(e) => setDescription(e.target.value)}
               placeholder="Descreva seu problema (opcional)." />

               <button type="submit" className="btNewChamado">Criar novo chamado</button>
            </form>
         </div>

      </div>
   )
}