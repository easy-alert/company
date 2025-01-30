// LIBS
import { toast } from 'react-toastify';

// SERVICES
import { Api } from '@services/api';

// GLOBAL UTILS
import { applyMask, catchHandler, unMaskBRL } from '@utils/functions';

// UTILS
import { requestCalendarData } from '../../functions';

// TYPES
import type {
  IRequestReportProgress,
  IRequestSaveReportProgress,
  IRequestSendReport,
  IRequestToggleInProgress,
} from './types';

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
        buildingId,
        calendarType,
        yearToRequest,
        setLoading,
        setMaintenancesWeekView,
        setMaintenancesMonthView,
        setMaintenancesDisplay,
        setYearChangeLoading,
        setBuildingOptions,
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
  maintenanceHistoryId,
  maintenanceReport,
  maintenance,
  handleModalSendMaintenanceReport,
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
    maintenancePriorityName: maintenance.priorityName,
    cost: Number(unMaskBRL(String(maintenanceReport.cost))),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  })
    .then((res) => {
      requestCalendarData({
        buildingId,
        calendarType,
        yearToRequest,
        setLoading,
        setMaintenancesWeekView,
        setMaintenancesMonthView,
        setMaintenancesDisplay,
        setYearChangeLoading,
        setBuildingOptions,
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
