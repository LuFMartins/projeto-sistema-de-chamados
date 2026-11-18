import { FiLoader } from "react-icons/fi";
import './loadingPage.css'

export default function LoadingPage() {
   return (
      <div className="loadingPage">
         <FiLoader className="iconLoading" size={60} color="white" />
      </div>
   )
}