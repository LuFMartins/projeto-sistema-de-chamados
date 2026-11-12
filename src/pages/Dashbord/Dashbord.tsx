import { useAuth } from '../../contexts/AuthContext'
import HeaderBar from '../../components/Header/HeaderBar'

export default function Dashbord() {

   const { signOutUser, user, nameUser } = useAuth()

   async function handleLogout() {
      signOutUser()
   }

   return (
      <div>
         <HeaderBar/>
         <h1>Dashbord</h1>
         <h3>{nameUser}</h3>
         <p>{user?.email}</p>
         <button onClick={handleLogout}>Sair</button>
      </div>
   )
}