import {useAuth} from '../../contexts/AuthContext'

export default function Dashbord() {

   const {signOutUser, user} = useAuth()

   async function handleLogout(){
      signOutUser()
   }

   return(
      <div>
         <h1>Dashbord</h1>
         <p>{user?.email}</p>
         <button onClick={handleLogout}>Sair</button>
      </div>
   )
}