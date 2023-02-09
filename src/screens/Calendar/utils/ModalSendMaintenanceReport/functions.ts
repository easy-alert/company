import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { catchHandler, unMaskBRL } from '../../../../utils/functions';
import { IRequestSendReport } from './types';

export const requestSendReport = async ({
  maintenanceReport,
  setModal,
  maintenanceHistoryId,
  files,
  images,
}: IRequestSendReport) => {
  await Api.post('/maintenances/create/report', {
    maintenanceHistoryId,
    cost: Number(unMaskBRL(maintenanceReport.cost)),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  })
    .then((res) => {
      toast.success(res.data.ServerMessage.message);
      setModal(false);
    })
    .catch((err) => {
      catchHandler(err);
    });
};
