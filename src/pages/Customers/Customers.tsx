
import HeaderBar from '../../components/HeaderBar/HeaderBar'
import TitleBar from '../../components/TitleBar/TitleBar'
import { FiUser } from 'react-icons/fi'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

export default function Customers() {

  // Armazena as informações preenchidas no formulário
  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [endereco, setEndereco] = useState('')

  // Controla o estado de salvamento do cliente
  const [saving, setSaving] = useState(false)

  // Executa o cadastro de um novo cliente
  async function handleCreateCustomers(e: React.SubmitEvent<HTMLFormElement>) {
    // Impede o recarregamento da página ao enviar o formulário
    e.preventDefault()

    // Verifica se todos os campos foram preenchidos
    if (nomeEmpresa.trim() === "" || cnpj.trim() === "" || endereco.trim() === "") {
      toast.info('Preencha todos os campos!')
      return;
    }

    // Indica que o cadastro está sendo realizado
    setSaving(true)

    try {
      // Adiciona um novo cliente à coleção @customers no Firestore
      await addDoc(collection(db, '@customers'), {
        nomeFantasia: nomeEmpresa,
        cnpj: cnpj,
        endereco: endereco
      })

      // Exibe uma mensagem de sucesso
      toast.success('Registro realizado com sucesso!')

      // Limpa os campos após o cadastro
      setNomeEmpresa('')
      setCnpj('')
      setEndereco('')

      // Finaliza o estado de salvamento
      setSaving(false)

    } catch (error) {
      // Exibe uma mensagem caso ocorra um erro no cadastro
      toast.error('Não foi possivel cadastrar empresa!')
      console.log(`ERRO: ${error}`)
    }
  }

  return (
    <div className='appLayout'>
      {/* Menu de navegação */}
      <HeaderBar />

      <div className='content'>

        {/* Título da página */}
        <TitleBar
          icon={FiUser}
          title="Clientes"
        />

        <div className='formContainer'>

          {/* Formulário de cadastro de clientes */}
          <form className='formUser' onSubmit={handleCreateCustomers}>

            {/* Campo para o nome fantasia da empresa */}
            <label>Nome Fantasia</label>
            <input type="text" placeholder='Nome da empresa' value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} />

            {/* Campo para o CNPJ */}
            <label>CNPJ</label>
            <input type="text" placeholder='Digite o CNPJ' value={cnpj} onChange={(e) => setCnpj(e.target.value)} />

            {/* Campo para o endereço */}
            <label>Endereço</label>
            <input type="text" placeholder='Endereço da empresa' value={endereco} onChange={(e) => setEndereco(e.target.value)} />

            {/* Botão de cadastro, desabilitado durante o salvamento */}
            <button
              type='submit'
              className='btSaveInfo'
              disabled={saving ? true : false}
            >
              {/* Altera o texto conforme o estado de salvamento */}
              {saving ? 'Salvando...' : 'Salvar'}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}
