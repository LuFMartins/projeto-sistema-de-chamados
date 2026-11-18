import HeaderBar from '../../components/HeaderBar/HeaderBar'
import TitleBar from '../../components/TitleBar/TitleBar'
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'
import "./dashboard.css"
import { useEffect, useState } from 'react'
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore'
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

export default function Dashboard() {

   const [calls, setCalls] = useState<CallsProps[]>([])
   const [loading, setLoading] = useState(true)
   
   const [isEmpty, setIsEmpty] = useState(false)

   useEffect(() => {
      async function handleCalls() {

         const ref = collection(db, "@calls")
         const q = query(ref, orderBy('created', 'desc'), limit(10))

         try {
            const querySnap = await getDocs(q)
            console.log(querySnap.docs)

            if(querySnap.docs.length === 0){
               throw new Error('Nenhum chamado encontrado!')
            }

            const lista: CallsProps[] = querySnap.docs.map((documento) => {

               const dado = documento.data()
               return {
                  cliente: dado.clienteName,
                  assunto: dado.assunto,
                  complemento: dado.complemento,
                  status: dado.status,
                  created: dado.created,
                  id: documento.id
               }
            })
            setCalls(lista)
            setLoading(false)

         } catch (error) {
            if (error instanceof Error){
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
                  </>
               )
               }
            </div>


         </div >

      </div >
   )
}