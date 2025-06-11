import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';
import { unMaskBRL } from '@utils/functions';

import type { IAnnexesAndImages } from '@customTypes/IAnnexesAndImages';
import type { IMaintenanceReport } from '@customTypes/IMaintenanceReport';
import type { TOrigin } from '@utils/types';

interface ISendMaintenanceReport {
  syndicNanoId: string;
  userId: string;
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReport;
  files: IAnnexesAndImages[];
  images: IAnnexesAndImages[];
  origin: TOrigin;
}

export const sendMaintenanceReport = async ({
  syndicNanoId,
  userId,
  maintenanceHistoryId,
  maintenanceReport,
  files,
  images,
  origin,
}: ISendMaintenanceReport) => {
  const uri = `/maintenances/create/report`;

  const formattedCost =
    typeof maintenanceReport.cost === 'string'
      ? Number(unMaskBRL(maintenanceReport.cost))
      : maintenanceReport.cost;

  const body = {
    userId,
    responsibleSyndicId: syndicNanoId,
    maintenanceHistoryId,
    cost: formattedCost,
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
    origin,
  };

  try {
    const response = await Api.post(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
};
