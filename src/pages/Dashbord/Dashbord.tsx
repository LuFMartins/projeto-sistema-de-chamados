import HeaderBar from '../../components/HeaderBar/HeaderBar'
import TitleBar from '../../components/TitleBar/TitleBar'
import { FiHome } from 'react-icons/fi'

export default function Dashbord() {

   return (
      <div className='appLayout'>
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