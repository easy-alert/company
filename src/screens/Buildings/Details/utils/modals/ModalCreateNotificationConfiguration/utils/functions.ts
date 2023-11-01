/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../../services/api';
import { catchHandler, unMask } from '../../../../../../../utils/functions';

// TYPES
import { IAutoCompleteData, IRequestCreateNotificationConfiguration } from './types';

export const requestCreateNotificationConfiguration = async ({
  values,
  setModal,
  setOnQuery,
  buildingId,
  phoneConfirmUrl,
  emailConfirmUrl,
  setFieldValue,
  resetForm,
  requestBuildingDetailsCall,
}: IRequestCreateNotificationConfiguration) => {
  setOnQuery(true);

  if (values.email === '' && values.contactNumber === '') {
    toast.error('E-mail ou WhatsApp obrigatório.');
    setOnQuery(false);
    return;
  }

  await Api.post('/buildings/notifications/create', {
    linkEmail: emailConfirmUrl,
    linkPhone: phoneConfirmUrl,
    data: {
      buildingId,
      name: values.name,
      email: values.email !== '' ? values.email : null,
      contactNumber: values.contactNumber !== '' ? unMask(values.contactNumber) : null,
      role: values.role,
      isMain: values.isMain,
      showContact: values.showContact,
    },
  })
    .then((res) => {
      requestBuildingDetailsCall();
      toast.success(res.data.ServerMessage.message);

      if (values.createAgain) {
        resetForm();
        setFieldValue('createAgain', true);
        setOnQuery(false);
      } else {
        setModal(false);
      }
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaCreateNotificationConfiguration = yup
  .object({
    name: yup.string().required('O nome deve ser preenchido.'),
    email: yup.string().email('Informe um e-mail válido.'),
    contactNumber: yup
      .string()
      .min(14, 'O número do WhatsApp deve conter no mínimo 14 caracteres.'),
    role: yup.string().required('A função deve ser preenchida.'),

    isMain: yup.boolean(),
    showContact: yup.boolean(),
    createAgain: yup.boolean(),
  })
  .required();

export const getDataForAutoComplete = async ({
  buildingId,
  setAutoCompleteData,
}: {
  buildingId: string;
  setAutoCompleteData: React.Dispatch<React.SetStateAction<IAutoCompleteData[]>>;
}) => {
  await Api.get(`/buildings/notifications/list-for-autocomplete/${buildingId}`)
    .then((res) => {
      console.log(res.data);
      setAutoCompleteData(res.data);
    })
    .catch((err) => {
      catchHandler(err);
    });
};
