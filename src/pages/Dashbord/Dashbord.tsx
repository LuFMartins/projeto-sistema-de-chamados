import { useAuth } from '../../contexts/AuthContext'
import HeaderBar from '../../components/HeaderBar/HeaderBar'
import TitleBar from '../../components/TitleBar/TitleBar'
import { FiHome } from 'react-icons/fi'

export default function Dashbord() {

   const { signOutUser, user, nameUser } = useAuth()

   async function handleLogout() {
      await signOutUser()
   }

   return (
      <div>
         <HeaderBar />
         
         <TitleBar
            icon={FiHome}
            title="HOME"
         />

         <h1>Dashbord</h1>
         <h3>{nameUser}</h3>
         <p>{user?.email}</p>
         <button onClick={handleLogout}>Sair</button>
      </div>
   )
}