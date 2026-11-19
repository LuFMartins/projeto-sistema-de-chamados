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

interface CallsProps {
   cliente: string,
   assunto: string,
   status: string,
   created: Timestamp,
   complemento: string | null,
   id: string
}

const PAGE_SIZE = 10

async function fetchCalls(lastDoc: QueryDocumentSnapshot<DocumentData> | null = null) {
   const ref = collection(db, '@calls')

   const q = lastDoc ? query(ref, orderBy('created', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE + 1)) : query(ref, orderBy('created', 'desc'), limit(PAGE_SIZE + 1))

   const querySnap = await getDocs(q)

   const docs = querySnap.docs.slice(0, PAGE_SIZE)

   const lista: CallsProps[] = docs.map((documento) => {
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

   return {
      lista,
      lastDoc: docs[docs.length - 1] ?? null,
      hasMore: querySnap.docs.length > PAGE_SIZE
   }
}

export default function Dashboard() {

   const [calls, setCalls] = useState<CallsProps[]>([])
   const [loading, setLoading] = useState(true)

   //indica que estamos carregando mais chamados
   const [loadingMore, setLoadingMore] = useState(false)

   //Armazena o último documento carregado
   const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)

   //Indica se existem mais chamados
   const [hasMore, setHasMore] = useState(false)

   const [isEmpty, setIsEmpty] = useState(false)

   useEffect(() => {
      async function handleCalls() {
         try {

            const result = await fetchCalls()
            console.log(result.lastDoc.data())

            setCalls(result.lista)
            setLastDoc(result.lastDoc)
            setHasMore(result.hasMore)
            setIsEmpty(result.lista.length === 0)
            setLoading(false)

         } catch (error) {
            if (error instanceof Error) {
               console.log(error.message)
            }
            setCalls([])
            setIsEmpty(true)
         } finally {
            setLoading(false)
         }
      }

      handleCalls()
   }, [])

   async function handleLoadMore() {
      if (!lastDoc || !hasMore || loadingMore) return;

      setLoadingMore(true)

      try {
         const result = await fetchCalls(lastDoc)
         console.log(result.lastDoc.data())

         setCalls((prev) => [...prev, ...result.lista])

         setLastDoc(result.lastDoc)
         setHasMore(result.hasMore)
      } catch (error) {
         console.error("Erro ao carregar mais chamados:", error);
      } finally {
         setLoadingMore(false)
      }
   }


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

                     <NavLink to="/new" className='btNovoChamado'>
                        <FiPlus color='white' size={25} />
                        novo chamado
                     </NavLink>

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

                           {calls?.map((item) => (
                              <tr key={item.id}>
                                 <td data-label="Cliente">{item.cliente}</td>
                                 <td data-label="Assunto">{item.assunto}</td>
                                 <td data-label={item.status}>
                                    <span className='status'>
                                       {item.status}
                                    </span>
                                 </td>
                                 <td data-label="Cadastrado em">{item.created.toDate().toLocaleString('pt-BR')}</td>

                                 <td>
                                    <button className='action' style={{ backgroundColor: "#3583f6" }}>
                                       <FiSearch color='white' size={15} />
                                    </button>
                                    <Link to={`/new/${item.id}`} className='action' style={{ backgroundColor: "#f6a935" }}>
                                       <FiEdit2 color='white' size={15} />
                                    </Link >
                                 </td>
                              </tr>
                           ))}

                        </tbody>
                     </table>
                     {hasMore && (
                        <button
                           type='button'
                           className='btLoadMore'
                           onClick={handleLoadMore}
                           disabled={loadingMore}
                        >
                           {loadingMore ? 'Carregando...' : 'Carregar mais chamados'}
                        </button>
                     )}
                  </>
               )
               }
            </div>


         </div >

      </div >
   )
}