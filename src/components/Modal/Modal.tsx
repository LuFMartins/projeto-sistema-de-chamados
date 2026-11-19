import { FiXCircle } from "react-icons/fi"
import "./modal.css"
import type { CallsProps } from "../../pages/Dashboard/Dashboard"

interface ModalProps {
   modal: () => void
   callDetail: CallsProps | null
}

export default function Modal({modal, callDetail} : ModalProps) {

   return (
      <div className="modal">
         <div className="containerModal">
            <button onClick={modal} className="btFechar">
               <FiXCircle className="asd" size={40} />
            </button>

            <main>
               <h2>Detalhes do chamado</h2>

               <div className="row">
                  <span>
                     <strong>Cliente:</strong> <i>{callDetail?.cliente}</i>
                  </span>
               </div>

               <div className="row">
                  <span>
                     <strong>Assunto:</strong> <i>{callDetail?.assunto}</i>
                  </span>
               </div>

               <div className="row">
                  <span>
                     <strong>Cadastrado em:</strong> <i>{callDetail?.created.toDate().toLocaleString('pt-BR')}</i>
                  </span>
               </div>

               <div className="row">
                  <span>
                     <strong>Status:</strong> <i>{callDetail?.status}</i>
                  </span>
               </div>

               <>
                  <h3>Complemento</h3>
                  <p><i>{callDetail?.complemento ? callDetail.complemento : 'Sem complemento'}</i></p>
               </>

            </main>
         </div>
      </div>
   )
}