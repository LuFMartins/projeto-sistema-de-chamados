import RoutesApp from './routes/RoutesApp'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "./App.css"
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <BrowserRouter>
      {/* Adicionado ToastContainer para exibir notificações */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
      />
      <AuthProvider>
        <RoutesApp />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;