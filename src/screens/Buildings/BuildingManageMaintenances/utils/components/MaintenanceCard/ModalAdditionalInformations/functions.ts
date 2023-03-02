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

    newState[categoryIndex].Maintenances[maintenanceIndex].lastResolutionDate =
      values.lastResolutionDate;

    newState[categoryIndex].Maintenances[maintenanceIndex].firstNotificationDate =
      values.firstNotificationDate;

    return newState;
  });
  setModal(false);
};
