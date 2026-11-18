import { FiPlusCircle } from "react-icons/fi";
import HeaderBar from "../../components/HeaderBar/HeaderBar";
import TitleBar from "../../components/TitleBar/TitleBar";
import "./new.css"
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

interface customers {
   id: string,
   nomeFantasia: string
}

export default function New() {

   const { user } = useAuth()
   const navigate = useNavigate()
   const { id } = useParams<{ id: string }>()
   const isEditing = !!id // mesma coisa que Boolean(id) - convertem o valor em 'true' ou 'false'

   const [customers, setCustomers] = useState<customers[]>([])
   const [status, setStatus] = useState<'Aberto' | 'Progresso' | 'Concluido' | 'Cancelado'>('Aberto')
   const [assunto, setAssunto] = useState<'Suporte' | 'Visita Tecnica' | 'Financeiro'>('Suporte')
   const [description, setDescription] = useState('')
   const [selectCustomersId, setSelectCustomersId] = useState('')
   const [loadingCustomers, setLoadingCustomers] = useState(true)

   useEffect(() => {
      async function loadCall() {
         if (!id) {
            return;
         }

         const dadosRef = doc(db, "@calls", id)
         const snapshot = await getDoc(dadosRef)

         if (!snapshot.exists()) {
            navigate('/dashboard')
            toast.dark('Chamado não encontrado!')
            return;
         }

         const data = snapshot.data()

         setSelectCustomersId(data.clienteId)
         setAssunto(data.assunto)
         setStatus(data.status)
         setDescription(data.complemento)         
         
      }

      
      loadCall()
      
   }, [id])

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
      setStatus(e.target.value as 'Aberto' | 'Progresso' | 'Concluido' | 'Cancelado')
   }

   function handleChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
      setAssunto(e.target.value as 'Suporte' | 'Visita Tecnica' | 'Financeiro')
   }

   function handleSelectCustomers(e: React.ChangeEvent<HTMLSelectElement>) {
      setSelectCustomersId(e.target.value)
   }

   async function handleNewCall(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault()

      const selectedCustomer = customers.find(
         (customer) => customer.id === selectCustomersId
      )

      if (!selectedCustomer) {
         toast.error("Selecione um cliente válido!");
         return;
      }

      const callData = {
         clienteId: selectedCustomer.id,
         clienteName: selectedCustomer.nomeFantasia,
         assunto,
         status,
         complemento: description.trim() || null
      }

      try {

         if (isEditing && id) {
            // Atualizar chamado existente
            await updateDoc(doc(db, "@calls", id), callData)

            toast.success('Chamado atualizado com sucesso!')
         } else {
            // Criar novo chamado
            await addDoc(collection(db, '@calls'), {
               ...callData,
               userId: user?.uid,
               created: new Date()
            })

            toast.success("Chamado registrado com sucesso!")
            setSelectCustomersId('')
            setDescription('')
            setStatus('Aberto')
            setAssunto('Suporte')
            navigate('/dashboard')
         }

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

            <form onSubmit={handleNewCall} className="formContainerNew">
               <label>Cliente</label>

               {loadingCustomers ?
                  <input type="text" disabled={true} placeholder="CARREGANDO..." style={{ width: "fit-content", padding: '10px' }} /> :
                  <select value={selectCustomersId} onChange={handleSelectCustomers}>
                     <option value="">Selecione um cliente</option>
                     {customers.map((item) => (
                        <option key={item.id} value={item.id}>{item.nomeFantasia}</option>
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
                     <input type="radio" name="radio" value="Concluido" onChange={handleOptionChange} checked={status === 'Concluido'} />
                     Concluido
                  </label>
                  <label>
                     <input type="radio" name="radio" value="Cancelado" onChange={handleOptionChange} checked={status === 'Cancelado'} />
                     Cancelado
                  </label>
               </div>

               <label>Complemento</label>
               <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva seu problema (opcional)." />

               <button type="submit" className="btNewChamado">{id ? 'Editar Chamado' : 'Criar Chamado'}</button>
            </form>
         </div>

      </div>
   )
}