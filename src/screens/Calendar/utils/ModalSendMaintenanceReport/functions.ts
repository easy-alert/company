import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { catchHandler, unMaskBRL } from '../../../../utils/functions';
import { IRequestSendReport } from './types';
import { requestCalendarData } from '../../functions';

export const requestSendReport = async ({
  maintenanceReport,
  setModal,
  maintenanceHistoryId,
  files,
  images,
  setLoading,
  setMaintenancesWeekView,
  setMaintenancesMonthView,
  setMaintenancesDisplay,
  yearToRequest,
  setYearChangeLoading,
  setBuildingOptions,
  buildingId,
  calendarType,
  setOnQuery,
  origin,
}: IRequestSendReport) => {
  setOnQuery(true);

  await Api.post('/maintenances/create/report', {
    origin,
    maintenanceHistoryId,
    cost: Number(unMaskBRL(maintenanceReport.cost)),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  })
    .then((res) => {
      requestCalendarData({
        setLoading,
        setMaintenancesWeekView,
        setMaintenancesMonthView,
        setMaintenancesDisplay,
        yearToRequest,
        setYearChangeLoading,
        setBuildingOptions,
        buildingId,
        calendarType,
      });

      toast.success(res.data.ServerMessage.message);
      setModal(false);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnQuery(false);
    });
};
