// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../../../../services/api';
import { catchHandler } from '../../../../../../../../../utils/functions';

// TYPES
import { IRequestCreateMaintenance } from './types';

export const requestCreateMaintenance = async ({
  values,
  categoryId,
  setModal,
  categories,
  setCategories,
  setOnQuery,
}: IRequestCreateMaintenance) => {
  setOnQuery(true);

  await Api.post('/maintenances/create', {
    categoryId,
    element: values.element,
    activity: values.activity,
    frequency: Number(values.frequency),
    frequencyTimeIntervalId: values.frequencyTimeInterval,
    responsible: values.responsible,
    source: values.source,
    period: Number(values.period),
    periodTimeIntervalId: values.periodTimeInterval,
    delay: Number(values.delay),
    delayTimeIntervalId: values.delayTimeInterval,
    observation: values.observation !== '' ? values.observation : null,
  })
    .then((res) => {
      const categoriesEdit = categories;

      const index = categories.findIndex((category) => category.id === categoryId);

      categoriesEdit[index].Maintenances.unshift(res.data.maintenance);

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
export const schemaCreateMaintenance = yup
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
