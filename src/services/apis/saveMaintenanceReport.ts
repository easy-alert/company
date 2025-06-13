import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';
import { unMaskBRL } from '@utils/functions';

import type { IAnnexesAndImages } from '@customTypes/IAnnexesAndImages';
import type { IMaintenanceReport } from '@customTypes/IMaintenanceReport';
import type { TOrigin } from '@utils/types';

interface ISaveMaintenanceReport {
  maintenanceHistoryId: string;
  userId: string;
  maintenanceReport: IMaintenanceReport;
  inProgress?: boolean;
  files: IAnnexesAndImages[];
  images: IAnnexesAndImages[];
  origin: TOrigin;
}

export const saveMaintenanceReport = async ({
  userId,
  maintenanceHistoryId,
  maintenanceReport,
  inProgress = false,
  files,
  images,
  origin,
}: ISaveMaintenanceReport) => {
  const uri = `/maintenances/create/report/progress`;

  const formattedCost =
    typeof maintenanceReport.cost === 'string'
      ? Number(unMaskBRL(maintenanceReport.cost))
      : maintenanceReport.cost;

  const body = {
    userId,
    maintenanceHistoryId,
    cost: formattedCost,
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
    inProgress,
    origin,
  };

  try {
    const response = await Api.post(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
};
