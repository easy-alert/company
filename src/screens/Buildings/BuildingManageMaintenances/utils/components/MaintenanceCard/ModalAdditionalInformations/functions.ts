import { toast } from 'react-toastify';

import type { IHandleAdditionalInformations } from './types';

export const handleAdditionalInformations = ({
  maintenanceReport,
  categories,
  categoryIndex,
  maintenanceIndex,
  files,
  images,
  values,
  selectedMaintenance,
  setCategories,
  setModal,
}: IHandleAdditionalInformations) => {
  if (values.lastResolutionDate && !values.firstNotificationDate) {
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const lastResolutionDate = new Date(values.lastResolutionDate);

    const frequencyInDays =
      categories[categoryIndex].Maintenances[maintenanceIndex].frequency *
      categories[categoryIndex].Maintenances[maintenanceIndex].FrequencyTimeInterval.unitTime;

    // considerando a antecipação
    const notificationDateBasedOnLastResolution = new Date(
      new Date(
        lastResolutionDate.setDate(
          lastResolutionDate.getDate() + frequencyInDays - (values.daysToAnticipate || 0),
        ),
      ).setHours(0, 0, 0, 0),
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

    const maintenance = newState[categoryIndex].Maintenances.find(
      (m) => m.id === selectedMaintenance.id,
    );

    if (!maintenance) {
      toast.error('Manutenção não encontrada.');
      return prevState;
    }

    if (
      !!values.lastResolutionDate ||
      !!values.firstNotificationDate ||
      !!values.daysToAnticipate
    ) {
      maintenance.isSelected = true;
    }

    maintenance.resolutionDate =
      values.lastResolutionDate && values.lastResolutionDate !== ''
        ? new Date(new Date(values.lastResolutionDate).setUTCHours(3, 0, 0, 0))
        : null;

    maintenance.notificationDate =
      values.firstNotificationDate && values.firstNotificationDate !== ''
        ? new Date(new Date(values.firstNotificationDate).setUTCHours(3, 0, 0, 0))
        : null;

    if (values.hasLastResolutionDate) {
      maintenance.files = files;
      maintenance.images = images;
      maintenance.maintenanceReport = maintenanceReport;
    }

    maintenance.daysToAnticipate = values.daysToAnticipate || 0;

    if (values.status === 'inProgress') {
      maintenance.inProgress = true;
      maintenance.status = 'pending';
    } else {
      maintenance.status = values.status;
    }

    console.log('maintenance', maintenance);

    return newState;
  });

  setModal(false);
};
