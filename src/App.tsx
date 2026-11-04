import RoutesApp from './routes/RoutesApp'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "./App.css"

function App() {
  return (
    <BrowserRouter> 
    {/* Adicionado ToastContainer para exibir notificações */}
      <ToastContainer 
        position="top-center"
        autoClose={2000}
        theme="colored"
      />
      <RoutesApp />
    </BrowserRouter>
  )
}

export default App;