import { toast } from 'react-toastify';
import { handleToastify } from '@utils/toastifyResponses';
import { Api } from '../../../../services/api';
import { applyMask, catchHandler, unMaskBRL } from '../../../../utils/functions';
import { requestSyndicKanban } from '../functions';
import {
  IRequestReportProgress,
  IRequestSaveReportProgress,
  IRequestSendReport,
  IRequestToggleInProgress,
} from './types';

export const requestSendReport = async ({
  maintenanceReport,
  maintenanceHistoryId,
  files,
  images,
  syndicNanoId,
}: IRequestSendReport) => {
  await Api.post('/maintenances/create/report', {
    origin: 'Client',
    maintenanceHistoryId,
    cost: Number(unMaskBRL(maintenanceReport.cost)),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
    responsibleSyndicId: syndicNanoId,
  })
    .then((res) => {
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      catchHandler(err);
    });
};

export const requestToggleInProgress = async ({
  maintenanceHistoryId,
  syndicNanoId,
  inProgressChange,
}: IRequestToggleInProgress) => {
  await Api.post(`/maintenances/set/in-progress?syndicNanoId=${syndicNanoId}`, {
    maintenanceHistoryId,
    inProgressChange,
  })
    .then((res) => {
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      catchHandler(err);
      throw new Error(err);
    });
};

export const requestReportProgress = async ({ maintenanceHistoryId }: IRequestReportProgress) => {
  const uri = `/maintenances/list/report/progress/${maintenanceHistoryId}`;

  try {
    const response = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response, false);
    return {};
  }
};

export const requestSaveReportProgress = async ({
  syndicNanoId,
  maintenanceReport,
  maintenanceHistoryId,
  files,
  images,
}: IRequestSaveReportProgress) => {
  await Api.post(`/maintenances/create/report/progress?syndicNanoId=${syndicNanoId}`, {
    maintenanceHistoryId,
    cost: Number(unMaskBRL(maintenanceReport.cost)),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  })
    .then((res) => {
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      catchHandler(err);
    });
};
