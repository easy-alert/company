import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { applyMask, catchHandler, unMaskBRL } from '../../../../utils/functions';
import { IRequestMaintenanceDetailsForEdit, IRequestSendReport } from './types';

export const requestSendReport = async ({
  maintenanceReport,
  setModal,
  maintenanceHistoryId,
  files,
  images,
  setOnQuery,
  origin,
}: IRequestSendReport) => {
  setOnQuery(true);

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
      //  aqui

      toast.success(res.data.ServerMessage.message);
      setModal(false);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnQuery(false);
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
