import { useEffect, useState } from 'react';

// SERVICES
import { getTicketById } from '@services/apis/getTicketById';
import { putTicketById } from '@services/apis/putTicketById';
import { getAllTicketDismissReasons } from '@services/apis/getAllTicketDismissReasons';
import { postTicketSignature } from '@services/apis/postTicketSignature';
import { deleteTicketById } from '@services/apis/deleteTicket';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

// GLOBAL UTILS
import { handleToastify, handleToastifyMessage } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { ITicket } from '@customTypes/ITicket';
import type { ITicketDismissReason } from '@customTypes/ITicketDismissReason';

// COMPONENTS
import TicketDismiss from './components/TicketDismiss';
import TicketDetails from './components/TicketDetails';

interface IModalTicketDetails {
  ticketId: string;
  userId?: string;
  showButtons?: boolean;
  handleTicketDetailsModal: (modalState: boolean) => void;
  handleRefresh?: () => void;
}

type IViewState = 'details' | 'dismiss';

export const ModalTicketDetails = ({
  ticketId,
  userId,
  showButtons = true,
  handleTicketDetailsModal,
  handleRefresh,
}: IModalTicketDetails) => {
  const [ticket, setTicket] = useState<ITicket>();
  const [dismissReasons, setDismissReasons] = useState<ITicketDismissReason[]>([]);

  const [view, setView] = useState<IViewState>('details');

  const [loading, setLoading] = useState<boolean>(true);
  const [signatureLoading, setSignatureLoading] = useState<boolean>(false);

  const handleSetView = (viewState: IViewState) => {
    setView(viewState);
  };

  const handleGetTicketById = async () => {
    setLoading(true);

    try {
      const ticketData = await getTicketById(ticketId);

      setTicket(ticketData);
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOneTicket = async (
    updatedTicket: ITicket,
    refresh = true,
    closeModal = true,
  ): Promise<ITicket> => {
    setLoading(true);

    try {
      const responseTicket = await putTicketById(updatedTicket);

      if (!responseTicket) throw new Error('Erro ao atualizar o ticket');
      setTicket(responseTicket);

      if (refresh && handleRefresh) {
        handleRefresh();
      }

      if (closeModal && handleTicketDetailsModal) {
        handleTicketDetailsModal(false);
      }

      return responseTicket;
    } catch (error: any) {
      handleToastify(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetTicketDismissReasons = async () => {
    try {
      const ticketDismissReasons = await getAllTicketDismissReasons();

      setDismissReasons(ticketDismissReasons);
    } catch (error: any) {
      handleToastify(error);
    }
  };

  const handleUploadSignature = async (signature: string) => {
    setSignatureLoading(true);

    const file = {
      fieldname: 'files',
      originalname: `assinatura/${userId}8${new Date().toISOString()}.png`,
      encoding: '7bit',
      mimetype: 'image/png',
      file: signature,
    };

    try {
      const responseData = await postTicketSignature(file);

      if (responseData.location) {
        handleUpdateOneTicket({ id: ticketId, signature: responseData.location }, false, false);
      }
    } catch (error) {
      handleToastifyMessage({
        type: 'error',
        message: 'Erro ao efetuar upload da assinatura.',
      });
    } finally {
      setSignatureLoading(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    setLoading(true);
    try {
      await deleteTicketById({ ticketId: id });
      if (handleRefresh) handleRefresh();
      handleTicketDetailsModal(false);
    } catch (error: any) {
      handleToastify(error?.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTicketById();
    handleGetTicketDismissReasons();
  }, [ticketId]);

  if (!ticket) return null;

  return (
    <Modal
      title={
        view === 'details'
          ? `Detalhes do chamado #${ticket?.ticketNumber}`
          : `Indeferir chamado #${ticket?.ticketNumber}`
      }
      bodyWidth="475px"
      setModal={handleTicketDetailsModal}
      closeOutside={false}
    >
      {loading ? (
        <DotSpinLoading />
      ) : (
        <>
          {view === 'details' && (
            <TicketDetails
              ticket={ticket}
              userId={userId}
              showButtons={showButtons}
              signatureLoading={signatureLoading}
              handleSetView={handleSetView}
              handleUpdateOneTicket={handleUpdateOneTicket}
              handleUploadSignature={handleUploadSignature}
              handleDeleteTicket={handleDeleteTicket}
            />
          )}

          {view === 'dismiss' && (
            <TicketDismiss
              ticketId={ticketId}
              userId={userId}
              dismissReasons={dismissReasons}
              handleSetView={handleSetView}
              handleUpdateOneTicket={handleUpdateOneTicket}
            />
          )}
        </>
      )}
    </Modal>
  );
};
