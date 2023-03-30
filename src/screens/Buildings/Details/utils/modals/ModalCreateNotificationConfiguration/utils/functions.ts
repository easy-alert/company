/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../../services/api';
import { catchHandler, unMask } from '../../../../../../../utils/functions';
import { requestBuildingDetails } from '../../../functions';

// TYPES
import { IRequestCreateNotificationConfiguration } from './types';

export const requestCreateNotificationConfiguration = async ({
  values,
  setModal,
  setOnQuery,
  buildingId,
  setBuilding,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
  phoneConfirmUrl,
  emailConfirmUrl,
  setFieldValue,
  resetForm,
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
      requestBuildingDetails({
        buildingId,
        setBuilding,
        setTotalMaintenancesCount,
        setUsedMaintenancesCount,
      });
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
    createAgain: yup.boolean(),
  })
  .required();
