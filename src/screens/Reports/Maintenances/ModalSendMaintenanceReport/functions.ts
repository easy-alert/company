// LIBS
import { toast } from 'react-toastify';

// SERVICES
import { Api } from '@services/api';

// GLOBAL UTILS
import { applyMask, catchHandler, unMaskBRL } from '@utils/functions';

// TYPES
import { IRequestReportProgress, IRequestSaveReportProgress, IRequestSendReport } from './types';

export const requestSendReport = async ({
  maintenanceReport,
  handleModalSendMaintenanceReport,
  maintenanceHistoryId,
  files,
  images,
  setOnModalQuery,
  origin,
  onThenRequest,
}: IRequestSendReport) => {
  setOnModalQuery(true);

  await Api.post('/maintenances/create/report', {
    origin,
    maintenanceHistoryId,
    cost: Number(unMaskBRL(String(maintenanceReport.cost))),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  })
    .then((res) => {
      onThenRequest();
      toast.success(res.data.ServerMessage.message);
      handleModalSendMaintenanceReport(false);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnModalQuery(false);
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

export const requestSaveReportProgress = async ({
  maintenanceReport,
  handleModalSendMaintenanceReport,
  maintenanceHistoryId,
  files,
  images,
  onThenRequest,
  setOnModalQuery,
}: IRequestSaveReportProgress) => {
  setOnModalQuery(true);

  await Api.post('/maintenances/create/report/progress', {
    maintenanceHistoryId,
    cost: Number(unMaskBRL(String(maintenanceReport.cost))),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  })
    .then((res) => {
      onThenRequest();
      toast.success(res.data.ServerMessage.message);
      handleModalSendMaintenanceReport(false);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnModalQuery(false);
    });
};
