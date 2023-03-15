import * as yup from 'yup';
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
}: IHandleAdditionalInformations) => {
  setCategories((prevState) => {
    const newState = [...prevState];

    if (!!values.lastResolutionDate || !!values.firstNotificationDate) {
      newState[categoryIndex].Maintenances[maintenanceIndex].isSelected = true;
    }

    newState[categoryIndex].Maintenances[maintenanceIndex].resolutionDate =
      values.lastResolutionDate !== ''
        ? new Date(new Date(values.lastResolutionDate).setUTCHours(3, 0, 0, 0))
        : null;

    newState[categoryIndex].Maintenances[maintenanceIndex].notificationDate =
      values.firstNotificationDate !== ''
        ? new Date(new Date(values.firstNotificationDate).setUTCHours(3, 0, 0, 0))
        : null;

    return newState;
  });
  setModal(false);
};
