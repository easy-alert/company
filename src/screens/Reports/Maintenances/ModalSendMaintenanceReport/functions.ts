import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { applyMask, catchHandler, unMaskBRL } from '../../../../utils/functions';
import { IRequestReportProgress, IRequestSaveReportProgress, IRequestSendReport } from './types';

export const requestSendReport = async ({
  maintenanceReport,
  setModal,
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
    cost: Number(unMaskBRL(maintenanceReport.cost)),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  })
    .then((res) => {
      onThenRequest();
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
  setModal,
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
      setModal(false);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnModalQuery(false);
    });
};
