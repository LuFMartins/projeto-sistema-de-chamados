import { FiXCircle } from "react-icons/fi"
import "./modal.css"
import type { CallsProps } from "../../pages/Dashboard/Dashboard"

// Define as propriedades recebidas pelo componente Modal
interface ModalProps {
   modal: () => void
   callDetail: CallsProps | null
}

// Recebe a função de fechar o modal e os dados do chamado
export default function Modal({modal, callDetail} : ModalProps) {

   return (
      // Área externa do modal
      <div className="modal">

         {/* Container do conteúdo do modal */}
         <div className="containerModal">

            {/* Botão que executa a função de fechar o modal */}
            <button onClick={modal} className="btFechar">
               <FiXCircle className="btFechar" size={40} />
            </button>

            {/* Exibe as informações do chamado selecionado */}
            <main>
               <h2>Detalhes do chamado</h2>

               {/* Nome do cliente */}
               <div className="row">
                  <span>
                     <strong>Cliente:</strong> <i>{callDetail?.cliente}</i>
                  </span>
               </div>

               {/* Assunto do chamado */}
               <div className="row">
                  <span>
                     <strong>Assunto:</strong> <i>{callDetail?.assunto}</i>
                  </span>
               </div>

               {/* Converte o Timestamp para uma data legível */}
               <div className="row">
                  <span>
                     <strong>Cadastrado em:</strong> <i>{callDetail?.created.toDate().toLocaleString('pt-BR')}</i>
                  </span>
               </div>

               {/* Status atual do chamado */}
               <div className="row">
                  <span>
                     <strong>Status:</strong> <i>{callDetail?.status}</i>
                  </span>
               </div>

               {/* Exibe o complemento ou uma mensagem caso esteja vazio */}
               <>
                  <h3>Complemento</h3>
                  <p><i>{callDetail?.complemento ? callDetail.complemento : 'Sem complemento'}</i></p>
               </>

            </main>
         </div>
      </div>
   )
}
