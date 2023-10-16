// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../../../../services/api';
import { catchHandler } from '../../../../../../../../../utils/functions';

// TYPES
import { IDeleteMaintenance, IRequestEditMaintenance } from './types';

export const requestEditMaintenance = async ({
  maintenanceId,
  values,
  setOnQuery,
  setModal,
  categories,
  setCategories,
  categoryId,
  timeIntervals,
}: IRequestEditMaintenance) => {
  setOnQuery(true);

  await Api.put('/maintenances/edit', {
    maintenanceId,
    element: values.element,
    activity: values.activity,
    frequency: Number(values.frequency),
    frequencyTimeIntervalId: values.frequencyTimeInterval,
    responsible: values.responsible,
    source: values.source,
    period: Number(values.period),
    periodTimeIntervalId: values.periodTimeInterval,

    // OCULTADO DA PLATAFORMA
    delay: 0,
    delayTimeIntervalId: values.delayTimeInterval,
    observation: values.observation !== '' ? values.observation : null,
  })
    .then((res) => {
      const categoriesEdit = structuredClone(categories);

      const categoryIndex = categories.findIndex((category) => category.id === categoryId);

      const maintenanceIndex = categoriesEdit[categoryIndex].Maintenances.findIndex(
        (maintenance) => maintenance.id === maintenanceId,
      );

      // mínimo para antecipar
      const sixMonthsInDays = 30 * 6;

      // tive que pegar por fora pq o state nao estava atualizado
      const foundFrequencyInterval = timeIntervals.find(
        (e) => e.id === values.frequencyTimeInterval,
      );

      let daysToAnticipate = 0;
      if (foundFrequencyInterval) {
        const frequency = foundFrequencyInterval.unitTime * Number(values.frequency);

        const daysToAnticipateSaved =
          categoriesEdit[categoryIndex].Maintenances[maintenanceIndex].daysToAnticipate ?? 0;

        daysToAnticipate = frequency >= sixMonthsInDays ? daysToAnticipateSaved : 0;
      }

      categoriesEdit[categoryIndex].Maintenances[maintenanceIndex] = {
        ...res.data.maintenance,
        isSelected: !!categoriesEdit[categoryIndex].Maintenances[maintenanceIndex].isSelected,
        hasHistory:
          categoriesEdit[categoryIndex].Maintenances[maintenanceIndex].hasHistory ?? false,
        notificationDate:
          categoriesEdit[categoryIndex].Maintenances[maintenanceIndex].notificationDate ?? null,
        resolutionDate:
          categoriesEdit[categoryIndex].Maintenances[maintenanceIndex].resolutionDate ?? null,

        nextNotificationDate:
          categoriesEdit[categoryIndex].Maintenances[maintenanceIndex].nextNotificationDate,

        lastResolutionDate:
          categoriesEdit[categoryIndex].Maintenances[maintenanceIndex].lastResolutionDate,

        lastNotificationDate:
          categoriesEdit[categoryIndex].Maintenances[maintenanceIndex].lastNotificationDate,

        lastNotificationStatus:
          categoriesEdit[categoryIndex].Maintenances[maintenanceIndex].lastNotificationStatus,

        daysToAnticipate,
      };

      setCategories([...categoriesEdit]);

      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

export const requestDeleteMaintenance = async ({
  categoryId,
  maintenanceId,
  setOnQuery,
  setModal,
  categories,
  setCategories,
}: IDeleteMaintenance) => {
  setOnQuery(true);
  await Api.delete('/maintenances/delete', {
    data: {
      maintenanceId,
    },
  })
    .then((res) => {
      const categoriesEdit = structuredClone(categories);

      const categoryIndex = categories.findIndex((category) => category.id === categoryId);

      const maintenanceIndex = categoriesEdit[categoryIndex].Maintenances.findIndex(
        (maintenance) => maintenance.id === maintenanceId,
      );

      categoriesEdit[categoryIndex].Maintenances.splice(maintenanceIndex, 1);

      setCategories([...categoriesEdit]);
      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaEditMaintenance = yup
  .object({
    element: yup
      .string()
      .required('O elemento deve ser preenchido.')
      .min(3, 'O elemento deve conter 3 ou mais caracteres.'),

    activity: yup
      .string()
      .required('A atividade deve ser preenchida.')
      .min(3, 'A atividade deve conter 3 ou mais caracteres.'),

    frequency: yup
      .string()
      .required('A periodicidade deve ser preenchida.')
      .matches(/^\d/, 'A periodicidade deve ser um número.')
      .test(
        'greaterThanZero',
        'A periodicidade deve ser maior que zero.',
        (value) => Number(value) > 0,
      ),

    frequencyTimeInterval: yup
      .string()
      .required('A unidade da periodicidade deve ser preenchida.')
      .test(
        'hasValue',
        'A unidade da periodicidade deve ser preenchida.',
        (value) => value !== 'Selecione',
      ),

    responsible: yup
      .string()
      .required('O nome do responsável deve ser preenchido.')
      .min(3, 'O nome deve conter 3 ou mais caracteres.'),

    source: yup
      .string()
      .required('A fonte deve ser preenchida.')
      .min(3, 'A fonte deve conter 3 ou mais caracteres.'),

    period: yup
      .string()
      .required('O prazo para execução deve ser preenchido.')
      .matches(/^\d/, 'O prazo para execução deve ser um número.')
      .test(
        'greaterThanZero',
        'O prazo para execução deve ser maior que zero.',
        (value) => Number(value) > 0,
      ),

    periodTimeInterval: yup
      .string()
      .required('A unidade do prazo para execução deve ser preenchida.')
      .test(
        'hasValue',
        'A unidade do prazo para execução deve ser preenchida.',
        (value) => value !== 'Selecione',
      ),

    delay: yup
      .string()
      .required('O delay deve ser preenchido.')
      .matches(/^\d/, 'O delay deve ser um número.'),

    delayTimeInterval: yup
      .string()
      .required('A unidade do delay deve ser preenchida.')
      .test(
        'hasValue',
        'A unidade do delay deve ser preenchida.',
        (value) => value !== 'Selecione',
      ),

    observation: yup.string().min(3, 'A observação deve conter 3 ou mais caracteres.'),
  })

  .required();
