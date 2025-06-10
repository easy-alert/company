import { toast } from 'react-toastify';

import { Api } from '@services/api';

import { applyMask, catchHandler, unMaskBRL } from '@utils/functions';

import type {
  IRequestMaintenanceDetailsForEdit,
  IRequestEditReport,
  IRequestDeleteMaintenanceHistory,
} from './types';

export const requestEditReport = async ({
  maintenanceReport,
  maintenanceHistoryId,
  files,
  images,
  origin,
  setOnModalQuery,
  handleModalEditReport,
  onThenRequest,
}: IRequestEditReport) => {
  setOnModalQuery(true);

  const formattedCost =
    typeof maintenanceReport.cost === 'string'
      ? Number(unMaskBRL(maintenanceReport.cost))
      : maintenanceReport.cost;

  await Api.post('/maintenances/edit/report', {
    origin,
    maintenanceHistoryId,
    maintenanceReportId: maintenanceReport.id,
    cost: formattedCost,
    observation: maintenanceReport.observation !== '' ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  })
    .then((res) => {
      onThenRequest();

      toast.success(res.data.ServerMessage.message);
      handleModalEditReport(false);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnModalQuery(false);
    });
};

export const requestMaintenanceDetailsForEdit = async ({
  maintenanceHistoryId,
  setMaintenance,
  setModalLoading,
  setFiles,
  setImages,
  setMaintenanceReport,
}: IRequestMaintenanceDetailsForEdit) => {
  await Api.get(`maintenances/list/details/${maintenanceHistoryId}`)
    .then((res) => {
      setMaintenance(res.data);

      const report = res.data.MaintenanceReport[0];

      if (report) {
        setMaintenanceReport({
          cost: applyMask({ mask: 'BRL', value: String(report.cost) }).value,
          observation: report.observation,
          id: report.id,
        });

        setFiles(report.ReportAnnexes);
        setImages(report.ReportImages);
      }
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setModalLoading(false);
    });
};

export const requestDeleteMaintenanceHistory = async ({
  maintenanceHistoryId,
  onThenRequest,
  handleModalSendMaintenanceReport,
  handleModalEditReport,
  setOnModalQuery,
}: IRequestDeleteMaintenanceHistory) => {
  setOnModalQuery(true);

  await Api.delete(`/maintenances/occasional/delete/${maintenanceHistoryId}`)
    .then((res) => {
      onThenRequest();
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      if (handleModalSendMaintenanceReport) {
        handleModalSendMaintenanceReport(false);
      }

      if (handleModalEditReport) {
        handleModalEditReport(false);
      }

      setOnModalQuery(false);
    });
};
