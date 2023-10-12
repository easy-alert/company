import { toast } from 'react-toastify';
import { IHandleAdditionalInformations } from './types';

export const handleAdditionalInformations = ({
  setCategories,
  values,
  categoryIndex,
  maintenanceIndex,
  setModal,
  files,
  images,
  maintenanceReport,
  categories,
}: IHandleAdditionalInformations) => {
  if (values.lastResolutionDate && !values.firstNotificationDate) {
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const lastResolutionDate = new Date(values.lastResolutionDate);

    const frequencyInDays =
      categories[categoryIndex].Maintenances[maintenanceIndex].frequency *
      categories[categoryIndex].Maintenances[maintenanceIndex].FrequencyTimeInterval.unitTime;

    const notificationDateBasedOnLastResolution = new Date(
      new Date(lastResolutionDate.setDate(lastResolutionDate.getDate() + frequencyInDays)).setHours(
        0,
        0,
        0,
        0,
      ),
    );

    if (notificationDateBasedOnLastResolution < today) {
      toast.error(
        'Essa manutenção deveria ter sido realizada mais vezes desde a data da última conclusão. Informe a data que deseja receber a próxima notificação.',
        { autoClose: 6000 },
      );
      return;
    }
  }

  setCategories((prevState) => {
    const newState = [...prevState];

    if (
      !!values.lastResolutionDate ||
      !!values.firstNotificationDate ||
      !!values.daysToAnticipate
    ) {
      newState[categoryIndex].Maintenances[maintenanceIndex].isSelected = true;
    }

    newState[categoryIndex].Maintenances[maintenanceIndex].resolutionDate =
      values.lastResolutionDate && values.lastResolutionDate !== ''
        ? new Date(new Date(values.lastResolutionDate).setUTCHours(3, 0, 0, 0))
        : null;

    newState[categoryIndex].Maintenances[maintenanceIndex].notificationDate =
      values.firstNotificationDate && values.firstNotificationDate !== ''
        ? new Date(new Date(values.firstNotificationDate).setUTCHours(3, 0, 0, 0))
        : null;

    if (values.hasLastResolutionDate) {
      newState[categoryIndex].Maintenances[maintenanceIndex].files = files;
      newState[categoryIndex].Maintenances[maintenanceIndex].images = images;
      newState[categoryIndex].Maintenances[maintenanceIndex].maintenanceReport = maintenanceReport;
    }

    newState[categoryIndex].Maintenances[maintenanceIndex].daysToAnticipate =
      values.daysToAnticipate || 0;
    return newState;
  });
  setModal(false);
};
