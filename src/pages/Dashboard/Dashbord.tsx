import HeaderBar from '../../components/HeaderBar/HeaderBar'
import TitleBar from '../../components/TitleBar/TitleBar'
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import "./dashboard.css"

export default function Dashbord() {

   return (
      <div className='appLayout'>
         <HeaderBar />
         <div className='content'>
            <TitleBar
               icon={FiMessageSquare}
               title="Tickets"
            />


            <div>
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
                        <th scope='col'>#</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td data-label="Cliente">Mercado Livre</td>
                        <td data-label="Assunto">Suporte</td>
                        <td data-label="Status"
                           className='badge'
                           style={{ backgroundColor: "#999" }}>
                           <span>
                              Em Aberto
                           </span>
                        </td>
                        <td data-label="Cadastrado em">12/05/2026</td>
                        <td data-label="#">
                           <button className='action' style={{ backgroundColor: "#3583f6" }}>
                              <FiSearch color='white' size={15} />
                           </button>
                           <button className='action' style={{ backgroundColor: "#f6a935" }}>
                              <FiEdit2 color='white' size={15} />
                           </button>
                        </td>
                     </tr>

                     <tr>
                        <td data-label="Cliente">Mercado Livre</td>
                        <td data-label="Assunto">Suporte</td>
                        <td data-label="Status"
                           className='badge'
                           style={{ backgroundColor: "#999" }}>
                           <span>
                              Em Aberto
                           </span>
                        </td>
                        <td data-label="Cadastrado em">12/05/2026</td>
                        <td data-label="#">
                           <button className='action' style={{ backgroundColor: "#3583f6" }}>
                              <FiSearch color='white' size={15} />
                           </button>
                           <button className='action' style={{ backgroundColor: "#f6a935" }}>
                              <FiEdit2 color='white' size={15} />
                           </button>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>


         </div >

      </div >
   )
}