import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { catchHandler, unMaskBRL } from '../../../../utils/functions';
import { IRequestSendReport } from './types';
import { requestReportsData } from '../functions';

export const requestSendReport = async ({
  maintenanceReport,
  setModal,
  maintenanceHistoryId,
  files,
  images,
  setOnModalQuery,
  origin,
  filters,
  setCounts,
  setLoading,
  setMaintenances,
  setOnQuery,
}: IRequestSendReport) => {
  setOnModalQuery(true);

  await Api.post('/maintenances/create/report', {
    origin,
    maintenanceHistoryId,
    cost: Number(unMaskBRL(maintenanceReport.cost)),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  })
    .then((res) => {
      requestReportsData({
        setOnQuery,
        setCounts,
        setMaintenances,
        setLoading,
        filters,
      });

      toast.success(res.data.ServerMessage.message);
      setModal(false);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnModalQuery(false);
    });
};
