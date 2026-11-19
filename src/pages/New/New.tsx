
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

// Define a estrutura dos dados de um cliente
interface customers {
   id: string,
   nomeFantasia: string
}

export default function New() {

   // Recupera o usuário autenticado
   const { user } = useAuth()

   // Permite navegar entre as páginas
   const navigate = useNavigate()

   // Recupera o ID do chamado pela URL
   const { id } = useParams<{ id: string }>()

   // Verifica se a página está no modo de edição
   const isEditing = !!id // mesma coisa que Boolean(id) - convertem o valor em 'true' ou 'false'

   // Armazena a lista de clientes cadastrados
   const [customers, setCustomers] = useState<customers[]>([])

   // Armazena os dados preenchidos no formulário
   const [status, setStatus] = useState<'Aberto' | 'Progresso' | 'Concluido' | 'Cancelado'>('Aberto')
   const [assunto, setAssunto] = useState<'Suporte' | 'Visita Tecnica' | 'Financeiro'>('Suporte')
   const [description, setDescription] = useState('')

   // Armazena o ID do cliente selecionado
   const [selectCustomersId, setSelectCustomersId] = useState('')

   // Controla o carregamento da lista de clientes
   const [loadingCustomers, setLoadingCustomers] = useState(true)

   // Busca os dados do chamado quando existe um ID na URL
   useEffect(() => {
      async function loadCall() {

         // Interrompe a busca se não existir um ID
         if (!id) {
            return;
         }

         // Cria a referência do chamado no Firestore
         const dadosRef = doc(db, "@calls", id)

         // Busca o documento correspondente ao ID
         const snapshot = await getDoc(dadosRef)

         // Verifica se o chamado existe
         if (!snapshot.exists()) {
            navigate('/dashboard')
            toast.dark('Chamado não encontrado!')
            return;
         }

         // Recupera os dados armazenados no documento
         const data = snapshot.data()

         // Preenche o formulário com os dados do chamado
         setSelectCustomersId(data.clienteId)
         setAssunto(data.assunto)
         setStatus(data.status)
         setDescription(data.complemento)

      }

      // Executa a busca do chamado
      loadCall()

   }, [id])

   // Cria a referência da coleção de clientes
   const listRef = collection(db, "@customers")

   // Busca os clientes quando o componente é carregado
   useEffect(() => {
      async function loadCustomers() {
         try {

            // Consulta todos os clientes cadastrados
            const querySnapshot = await getDocs(listRef)

            // Converte os documentos em uma lista de clientes
            const lista: customers[] = querySnapshot.docs.map((documento) => {

               // Recupera os campos de cada cliente
               const dados = documento.data()

               return {
                  id: documento.id,
                  nomeFantasia: dados.nomeFantasia
               }
            })

            // Armazena os clientes encontrados
            setCustomers(lista)

            // Finaliza o carregamento dos clientes
            setLoadingCustomers(false)

         } catch (error) {

            // Exibe uma mensagem caso a consulta falhe
            console.log('Erro ao buscar os Clientes')

            // Finaliza o carregamento e define um cliente alternativo
            setLoadingCustomers(false)
            setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
         }
      }

      // Executa a busca dos clientes
      loadCustomers()
   }, [])


   // Atualiza o status selecionado nos botões de rádio
   function handleOptionChange(e: React.ChangeEvent<HTMLInputElement>) {
      setStatus(e.target.value as 'Aberto' | 'Progresso' | 'Concluido' | 'Cancelado')
   }

   // Atualiza o assunto selecionado
   function handleChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
      setAssunto(e.target.value as 'Suporte' | 'Visita Tecnica' | 'Financeiro')
   }

   // Atualiza o ID do cliente selecionado
   function handleSelectCustomers(e: React.ChangeEvent<HTMLSelectElement>) {
      setSelectCustomersId(e.target.value)
   }

   // Executa a criação ou edição de um chamado
   async function handleNewCall(e: React.SubmitEvent<HTMLFormElement>) {

      // Impede o recarregamento da página
      e.preventDefault()

      // Procura o cliente pelo ID selecionado
      const selectedCustomer = customers.find(
         (customer) => customer.id === selectCustomersId
      )

      // Impede o envio se nenhum cliente válido for selecionado
      if (!selectedCustomer) {
         toast.error("Selecione um cliente válido!");
         return;
      }

      // Organiza os dados que serão salvos no Firestore
      const callData = {
         clienteId: selectedCustomer.id,
         clienteName: selectedCustomer.nomeFantasia,
         assunto,
         status,
         complemento: description.trim() || null
      }

      try {

         // Verifica se o chamado será editado ou criado
         if (isEditing && id) {

            // Atualizar chamado existente
            await updateDoc(doc(db, "@calls", id), callData)

            // Informa que a atualização foi realizada
            toast.success('Chamado atualizado com sucesso!')

         } else {

            // Criar novo chamado
            await addDoc(collection(db, '@calls'), {
               ...callData,
               userId: user?.uid,
               created: new Date()
            })

            // Informa que o chamado foi cadastrado
            toast.success("Chamado registrado com sucesso!")

            // Limpa os campos do formulário
            setSelectCustomersId('')
            setDescription('')
            setStatus('Aberto')
            setAssunto('Suporte')

            // Redireciona para o Dashboard
            navigate('/dashboard')
         }

      } catch (error) {

         // Exibe uma mensagem caso ocorra um erro ao salvar
         console.log(`Não foi possivel registrar o chamado : ${error}`)
         toast.error('Não foi possivel registrar o chamado!')
      }
   }

   return (
      <div className="appLayout">

         {/* Menu de navegação do sistema */}
         <HeaderBar />

         <div className="content">

            {/* Título da página */}
            <TitleBar icon={FiPlusCircle} title="Novo Chamado" />

            {/* Formulário de criação ou edição de chamados */}
            <form onSubmit={handleNewCall} className="formContainerNew">

               {/* Campo para selecionar um cliente */}
               <label>Cliente</label>

               {/* Exibe o carregamento ou a lista de clientes */}
               {loadingCustomers ?
                  <input type="text" disabled={true} placeholder="CARREGANDO..." style={{ width: "fit-content", padding: '10px' }} /> :
                  <select value={selectCustomersId} onChange={handleSelectCustomers}>
                     <option value="">Selecione um cliente</option>

                     {/* Cria uma opção para cada cliente cadastrado */}
                     {customers.map((item) => (
                        <option key={item.id} value={item.id}>{item.nomeFantasia}</option>
                     ))}
                  </select>
               }

               {/* Campo para selecionar o assunto do chamado */}
               <label>Assunto</label>
               <select value={assunto} onChange={handleChangeSelect}>
                  <option value="Suporte">Suporte</option>
                  <option value="Visita Tecnica">Visita Tecnica</option>
                  <option value="Financeiro">Financeiro</option>
               </select>

               {/* Opções de status do chamado */}
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

               {/* Campo opcional para descrever o chamado */}
               <label>Complemento</label>
               <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva seu problema (opcional)." />

               {/* Altera o texto do botão conforme o modo da página */}
               <button type="submit" className="btNewChamado">{id ? 'Editar Chamado' : 'Criar Chamado'}</button>
            </form>
         </div>

      </div>
   )
}
