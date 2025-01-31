// REACT
import { useEffect, useState } from 'react';

// LIBS
// CONTEXTS
// HOOKS
// SERVICES
import { getTicketById } from '@services/apis/getTicketById';
import { putTicketById } from '@services/apis/putTicketById';
import { getAllTicketDismissReasons } from '@services/apis/getAllTicketDismissReasons';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL ASSETS
// GLOBAL TYPES
import type { ITicket } from '@customTypes/ITicket';
import type { ITicketDismissReason } from '@customTypes/ITicketDismissReason';

// COMPONENTS
import TicketDismiss from './components/TicketDismiss';
import TicketDetails from './components/TicketDetails';

// UTILS
// STYLES

interface IModalTicketDetails {
  ticketId: string;
  userId?: string;
  showButtons?: boolean;
  handleTicketDetailsModal: (modalState: boolean) => void;
  handleRefresh?: () => void;
}

type IViewState = 'details' | 'dismiss';

function ModalTicketDetails({
  ticketId,
  userId,
  showButtons = true,
  handleTicketDetailsModal,
  handleRefresh,
}: IModalTicketDetails) {
  const [ticket, setTicket] = useState<ITicket>();
  const [dismissReasons, setDismissReasons] = useState<ITicketDismissReason[]>([]);

  const [view, setView] = useState<IViewState>('details');

  const [loading, setLoading] = useState<boolean>(true);

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

  const handleUpdateOneTicket = async (updatedTicket: ITicket) => {
    setLoading(true);

    try {
      await putTicketById(updatedTicket);

      if (handleRefresh) {
        handleRefresh();
      }

      handleTicketDetailsModal(false);
    } catch (error: any) {
      handleToastify(error);
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
              handleSetView={handleSetView}
              handleUpdateOneTicket={handleUpdateOneTicket}
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
}

export default ModalTicketDetails;
