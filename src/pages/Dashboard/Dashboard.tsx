
import HeaderBar from '../../components/HeaderBar/HeaderBar'
import TitleBar from '../../components/TitleBar/TitleBar'
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'
import "./dashboard.css"
import { useEffect, useState } from 'react'
import {
   getDocs,
   collection,
   query,
   orderBy,
   limit,
   startAfter,
   type QueryDocumentSnapshot,
   type DocumentData
} from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { Timestamp } from 'firebase/firestore'
import Modal from '../../components/Modal/Modal'

// Define a estrutura dos dados de cada chamado
export interface CallsProps {
   cliente: string,
   assunto: string,
   status: string,
   created: Timestamp,
   complemento: string | null,
   id: string
}

// Quantidade de chamados exibidos por consulta
const PAGE_SIZE = 10

// Busca uma página de chamados no Firestore
// lastDoc indica a partir de qual documento a busca deve continuar
async function fetchCalls(lastDoc: QueryDocumentSnapshot<DocumentData> | null = null) {
   const ref = collection(db, '@calls')

   // Se existir lastDoc, busca os próximos chamados
   // Caso contrário, começa pelo primeiro documento
   // Busca um documento extra para verificar se existe outra página
   const q = lastDoc ? query(ref, orderBy('created', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE + 1)) : query(ref, orderBy('created', 'desc'), limit(PAGE_SIZE + 1))

   // Executa a consulta no Firestore
   const querySnap = await getDocs(q)

   // Seleciona somente os 10 primeiros documentos
   const docs = querySnap.docs.slice(0, PAGE_SIZE)

   // Converte os documentos do Firestore em objetos CallsProps
   const lista: CallsProps[] = docs.map((documento) => {
      // Recupera os campos armazenados no documento
      const dado = documento.data()

      return {
         id: documento.id,
         cliente: dado.clienteName,
         assunto: dado.assunto,
         complemento: dado.complemento ?? null,
         status: dado.status,
         created: dado.created
      }
   })

   // Retorna os chamados, o último documento e se existem mais registros
   return {
      lista,
      lastDoc: docs[docs.length - 1] ?? null,
      hasMore: querySnap.docs.length > PAGE_SIZE
   }
}

export default function Dashboard() {

   // Armazena os chamados que serão exibidos na tabela
   const [calls, setCalls] = useState<CallsProps[]>([])

   // Controla o carregamento inicial da página
   const [loading, setLoading] = useState(true)

   //indica que estamos carregando mais chamados
   const [loadingMore, setLoadingMore] = useState(false)

   //Armazena o último documento carregado
   const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)

   //Indica se existem mais chamados
   const [hasMore, setHasMore] = useState(false)

   // Indica se a consulta inicial retornou uma lista vazia
   const [isEmpty, setIsEmpty] = useState(false)

   // Serve para abrir e fechar o modal
   const [modal, setModal] = useState(false)
   //Pega os detalhes do item especifico
   const [detail, setDetail] = useState<CallsProps | null>(null)

   // Busca os primeiros chamados ao carregar o componente
   useEffect(() => {
      async function handleCalls() {
         try {

            // Busca a primeira página, sem informar um documento anterior
            const result = await fetchCalls()

            // Armazena os chamados encontrados
            setCalls(result.lista)

            // Guarda o último documento para a próxima consulta
            setLastDoc(result.lastDoc)

            // Verifica se existem mais chamados
            setHasMore(result.hasMore)

            // Verifica se a lista retornada está vazia
            setIsEmpty(result.lista.length === 0)
            setLoading(false)

         } catch (error) {
            // Exibe a mensagem do erro no console
            if (error instanceof Error) {
               console.log(error.message)
            }

            // Limpa a lista e indica que ela está vazia
            setCalls([])
            setIsEmpty(true)
         } finally {
            // Finaliza o carregamento, mesmo se ocorrer um erro
            setLoading(false)
         }
      }

      handleCalls()
   }, [])

   // Busca mais chamados quando o usuário clica no botão
   async function handleLoadMore() {

      // Impede a busca se não houver cursor, mais chamados
      // ou se outra consulta já estiver em andamento
      if (!lastDoc || !hasMore || loadingMore) return;

      // Ativa o estado de carregamento do botão
      setLoadingMore(true)

      try {
         // Busca a próxima página a partir do último documento
         const result = await fetchCalls(lastDoc)

         // Adiciona os novos chamados aos que já estão na tabela
         setCalls((prev) => [...prev, ...result.lista])

         // Atualiza o cursor e a informação sobre novas páginas
         setLastDoc(result.lastDoc)
         setHasMore(result.hasMore)
      } catch (error) {
         // Exibe possíveis erros durante a consulta
         console.error("Erro ao carregar mais chamados:", error);
      } finally {
         // Libera o botão após finalizar a consulta
         setLoadingMore(false)
      }
   }

   function getItemDetail(item: CallsProps){
      setDetail(item)
      setModal(true)
   }

   function fecharModal(){
      setModal(false)
   }

   // Exibe uma mensagem enquanto os primeiros chamados são buscados
   if (loading) {
      return (
         <div className='appLayout'>
            <HeaderBar />
            <div className='content'>
               <TitleBar
                  icon={FiMessageSquare}
                  title='Tickets'
               />

               <div className='noCalls'>
                  <span>Buscando Chamados...</span>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className='appLayout'>
         <HeaderBar />
         <div className='content'>
            <TitleBar
               icon={FiMessageSquare}
               title="Tickets"
            />

            <div>

               {/* Exibe uma mensagem se não houver chamados */}
               {isEmpty ? (
                  <div className='noCalls'>
                     <span>Nenhum chamado encontrado!</span>
                     <NavLink to="/new" className='btNovoChamado'>
                        <FiPlus color='white' size={25} />
                        novo chamado
                     </NavLink>
                  </div>
               ) : (

                  <>
                     {/* Botão para cadastrar um novo chamado */}
                     <NavLink to="/new" className='btNovoChamado'>
                        <FiPlus color='white' size={25} />
                        novo chamado
                     </NavLink>

                     {/* Tabela com os chamados encontrados */}
                     <table>
                        <thead>
                           <tr>
                              <th scope='col'>Cliente</th>
                              <th scope='col'>Assunto</th>
                              <th scope='col'>Status</th>
                              <th scope='col'>Cadastrado em</th>
                              <th scope='col'></th>
                           </tr>
                        </thead>
                        <tbody>

                           {/* Percorre a lista e cria uma linha para cada chamado */}
                           {calls?.map((item) => (
                              <tr key={item.id}>
                                 <td data-label="Cliente">{item.cliente}</td>
                                 <td data-label="Assunto">{item.assunto}</td>
                                 <td data-label={item.status}>
                                    <span className='status'>
                                       {item.status}
                                    </span>
                                 </td>

                                 {/* Converte o Timestamp para uma data legível */}
                                 <td data-label="Cadastrado em">{item.created.toDate().toLocaleString('pt-BR')}</td>

                                 <td>
                                    {/* Botão reservado para visualizar o chamado */}
                                    <button onClick={() => getItemDetail(item)} className='action' style={{ backgroundColor: "#3583f6" }}>
                                       <FiSearch color='white' size={15} />
                                    </button>

                                    {/* Abre a página de edição usando o ID do chamado */}
                                    <Link to={`/new/${item.id}`} className='action' style={{ backgroundColor: "#f6a935" }}>
                                       <FiEdit2 color='white' size={15} />
                                    </Link >
                                 </td>
                              </tr>
                           ))}

                        </tbody>
                     </table>

                     {/* Exibe o botão somente se existirem mais chamados */}
                     {hasMore && (
                        <button
                           type='button'
                           className='btLoadMore'
                           onClick={handleLoadMore}
                           disabled={loadingMore}
                        >
                           {/* Altera o texto enquanto os próximos chamados são buscados */}
                           {loadingMore ? 'Carregando...' : 'Carregar mais chamados'}
                        </button>
                     )}
                  </>
               )
               }
            </div>

         </div >
               
         {modal && (
            <Modal modal={fecharModal} callDetail={detail}/>
         )}

      </div >
   )
}
