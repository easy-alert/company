import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { applyMask, catchHandler, unMaskBRL } from '../../../../utils/functions';
import {
  IRequestReportProgress,
  IRequestSaveReportProgress,
  IRequestSendReport,
  IRequestToggleInProgress,
} from './types';
import { requestCalendarData } from '../../functions';

export const requestSendReport = async ({
  maintenanceReport,
  handleModalSendMaintenanceReport,
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
    cost: Number(unMaskBRL(String(maintenanceReport.cost))),
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
      handleModalSendMaintenanceReport(false);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnQuery(false);
    });
};

export const requestSaveReportProgress = async ({
  maintenanceReport,
  handleModalSendMaintenanceReport,
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
}: IRequestSaveReportProgress) => {
  setOnQuery(true);

  await Api.post('/maintenances/create/report/progress', {
    maintenanceHistoryId,
    cost: Number(unMaskBRL(String(maintenanceReport.cost))),
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
      handleModalSendMaintenanceReport(false);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnQuery(false);
    });
};

export const requestToggleInProgress = async ({
  maintenanceHistoryId,
  inProgressChange,
  setOnQuery,
  handleModalSendMaintenanceReport,
  onThenActionRequest,
}: IRequestToggleInProgress) => {
  setOnQuery(true);

  await Api.post('/maintenances/set/in-progress', {
    maintenanceHistoryId,
    inProgressChange,
  })
    .then((res) => {
      toast.success(res.data.ServerMessage.message);
      onThenActionRequest();
      handleModalSendMaintenanceReport(false);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnQuery(false);
    });
};

export const requestReportProgress = async ({
  maintenanceHistoryId,
  setFiles,
  setImages,
  setMaintenanceReport,
}: IRequestReportProgress) => {
  await Api.get(`/maintenances/list/report/progress/${maintenanceHistoryId}`)
    .then((res) => {
      if (res.data.progress) {
        setMaintenanceReport({
          cost: applyMask({ mask: 'BRL', value: String(res.data.progress.cost) }).value,
          observation: res.data.progress.observation || '',
        });
        setFiles(res.data.progress.ReportAnnexesProgress);
        setImages(res.data.progress.ReportImagesProgress);
      }
    })
    .catch((err) => {
      catchHandler(err);
    });
};
