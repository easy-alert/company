import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { applyMask, catchHandler, unMaskBRL } from '../../../../utils/functions';
import { IRequestMaintenanceDetailsForEdit, IRequestEditReport } from './types';

export const requestEditReport = async ({
  maintenanceReport,
  handleModalEditReport,
  maintenanceHistoryId,
  files,
  images,
  setOnModalQuery,
  origin,
  onThenRequest,
}: IRequestEditReport) => {
  setOnModalQuery(true);

  await Api.post('/maintenances/edit/report', {
    origin,
    maintenanceHistoryId,
    maintenanceReportId: maintenanceReport.id,
    cost: Number(unMaskBRL(maintenanceReport.cost)),
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
