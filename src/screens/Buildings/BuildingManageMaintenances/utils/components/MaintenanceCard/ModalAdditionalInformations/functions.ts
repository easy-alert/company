import * as yup from 'yup';

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
