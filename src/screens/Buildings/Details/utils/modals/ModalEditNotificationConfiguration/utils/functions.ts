/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';

// FUNCTIONS
import { Api } from '../../../../../../../services/api';
import { catchHandler, unMask } from '../../../../../../../utils/functions';
import { requestBuildingDetails } from '../../../functions';

// TYPES
import {
  IRequestDeleteNotificationConfiguration,
  IRequestEditNotificationConfiguration,
} from './types';

export const requestEditNotificationConfiguration = async ({
  values,
  setModal,
  setOnQuery,
  buildingId,
  setBuilding,
  buildingNotificationConfigurationId,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
  emailConfirmUrl,
  phoneConfirmUrl,
}: IRequestEditNotificationConfiguration) => {
  setOnQuery(true);

  if (values.email === '' && values.contactNumber === '') {
    toast.error('E-mail ou WhatsApp obrigatório.');
    setOnQuery(false);
    return;
  }

  await Api.put('/buildings/notifications/edit', {
    linkEmail: emailConfirmUrl,
    linkPhone: phoneConfirmUrl,
    buildingNotificationConfigurationId,
    buildingId,
    data: {
      name: values.name,
      email: values.email !== '' ? values.email : null,
      contactNumber: values.contactNumber !== '' ? unMask(values.contactNumber) : null,
      role: values.role,
      isMain: values.isMain,
    },
  })
    .then((res) => {
      requestBuildingDetails({
        buildingId,
        setBuilding,
        setTotalMaintenancesCount,
        setUsedMaintenancesCount,
      });
      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

export const requestDeleteNotificationConfiguration = async ({
  setModal,
  setOnQuery,
  buildingNotificationConfigurationId,
  setBuilding,
  buildingId,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
}: IRequestDeleteNotificationConfiguration) => {
  setOnQuery(true);

  await Api.delete('/buildings/notifications/delete', {
    data: {
      buildingNotificationConfigurationId,
    },
  })
    .then((res) => {
      requestBuildingDetails({
        buildingId,
        setBuilding,
        setTotalMaintenancesCount,
        setUsedMaintenancesCount,
      });
      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaEditNotificationConfiguration = yup
  .object({
    name: yup.string().required('O nome deve ser preenchido.'),
    email: yup.string().email('Informe um e-mail válido.'),
    contactNumber: yup
      .string()
      .min(14, 'O número de telefone deve conter no mínimo 14 caracteres.'),
    role: yup.string().required('A função deve ser preenchida.'),

    isMain: yup.boolean(),
  })
  .required();
