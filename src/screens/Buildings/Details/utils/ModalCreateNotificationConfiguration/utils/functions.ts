/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../services/api';
import { catchHandler, unMask } from '../../../../../../utils/functions';
import { requestBuildingDetails } from '../../functions';

// TYPES
import { IRequestCreateNotificationConfiguration } from './types';

export const requestCreateNotificationConfiguration = async ({
  values,
  setModal,
  setOnQuery,
  buildingId,
  setBuilding,
}: IRequestCreateNotificationConfiguration) => {
  setOnQuery(true);
  const phoneConfirmUrl = `${window.location.host}/confirm/phone`;

  await Api.post('/buildings/notifications/create', {
    link: phoneConfirmUrl,
    data: {
      buildingId,
      name: values.name,
      email: values.email,
      role: values.role,
      contactNumber: unMask(values.contactNumber),
      isMain: values.isMain,
    },
  })
    .then((res) => {
      requestBuildingDetails({ buildingId, setBuilding });
      setModal(false);
      toast.success(res.data.ServerMessage.message);
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
    email: yup
      .string()
      .email('Informe um e-mail válido.')
      .required('O e-mail deve ser preenchido.'),
    role: yup.string().required('A função deve ser preenchida'),
    contactNumber: yup
      .string()
      .required('O número de contato é obrigatório.')
      .min(14, 'O número de telefone deve conter no mínimo 14 caracteres.'),
    isMain: yup.boolean(),
  })
  .required();
