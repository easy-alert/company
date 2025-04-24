/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';

// FUNCTIONS
import { Api } from '../../../../../../../services/api';
import { catchHandler, unMask } from '../../../../../../../utils/functions';

// TYPES
import { IRequestCreateNotificationConfiguration } from './types';

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
