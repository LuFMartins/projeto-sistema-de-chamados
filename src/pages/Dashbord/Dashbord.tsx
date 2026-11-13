import HeaderBar from '../../components/HeaderBar/HeaderBar'
import TitleBar from '../../components/TitleBar/TitleBar'
import { FiHome } from 'react-icons/fi'
import './dashboard.css'

export default function Dashbord() {

   return (
      <div>
         <HeaderBar />
         <div className='content'>
            <TitleBar
               icon={FiHome}
               title="HOME"
            />
         </div>
      </div>
   )
}