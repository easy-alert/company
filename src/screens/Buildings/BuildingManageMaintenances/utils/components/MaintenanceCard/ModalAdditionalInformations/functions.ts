import * as yup from 'yup';
import { toast } from 'react-toastify';
import { IHandleAdditionalInformations } from './types';

export const schemaAdditionalInformations = yup
  .object({
    hasLastResolutionDate: yup.boolean(),
    lastResolutionDate: yup.date().when('hasLastResolutionDate', {
      is: (hasLastResolutionDate: boolean) => hasLastResolutionDate === true,
      then: yup.date().required('Informe a data da última conclusão.'),
    }),

    hasFirstNotificationDate: yup.boolean(),
    firstNotificationDate: yup.date().when('hasFirstNotificationDate', {
      is: (hasFirstNotificationDate: boolean) => hasFirstNotificationDate === true,
      then: yup.date().required('Informe a data da primeira notificação.'),
    }),
  })
  .required();

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
      toast.error('Informe a data que deseja receber a primeira notificação.');
      return;
    }
  }

  setCategories((prevState) => {
    const newState = [...prevState];

    if (!!values.lastResolutionDate || !!values.firstNotificationDate) {
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

    return newState;
  });
  setModal(false);
};
