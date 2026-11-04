import {auth} from "../../services/firebaseConnection"
import { signOut } from "firebase/auth"

export default function Dashbord() {

   async function handleLogout(){
      await signOut(auth)
   }

   return(
      <div>
         <h1>Dashbord</h1>
         <button onClick={handleLogout}>Sair</button>
      </div>
   )
}