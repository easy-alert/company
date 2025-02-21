import { toast } from 'react-toastify';
import { handleToastify } from '@utils/toastifyResponses';
import { Api } from '@services/api';

import { unMaskBRL } from '@utils/functions';

import type {
  IRequestReportProgress,
  IRequestSaveReportProgress,
  IRequestSendReport,
  IRequestToggleInProgress,
} from './types';

export const requestSendReport = async ({
  syndicNanoId,
  userId,
  maintenanceHistoryId,
  maintenanceReport,
  files,
  images,
}: IRequestSendReport) => {
  const uri = `/maintenances/create/report`;

  const body = {
    userId,
    responsibleSyndicId: syndicNanoId,
    maintenanceHistoryId,
    cost: Number(unMaskBRL(maintenanceReport.cost)),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  };

  try {
    const response = await Api.post(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
};

export const requestToggleInProgress = async ({
  syndicNanoId,
  userId,
  maintenanceHistoryId,
  inProgressChange,
}: IRequestToggleInProgress) => {
  const uri = `/maintenances/set/in-progress`;

  const params = {
    syndicNanoId,
  };

  const body = {
    userId,
    maintenanceHistoryId,
    inProgressChange,
  };

  try {
    const response = await Api.post(uri, body, { params });

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
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
  userId,
  maintenanceReport,
  maintenanceHistoryId,
  files,
  images,
}: IRequestSaveReportProgress) => {
  const uri = `/maintenances/create/report/progress`;

  const params = {
    syndicNanoId,
  };

  const body = {
    userId,
    maintenanceHistoryId,
    cost: Number(unMaskBRL(maintenanceReport.cost)),
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  };

  try {
    const response = await Api.post(uri, body, { params });

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
};
