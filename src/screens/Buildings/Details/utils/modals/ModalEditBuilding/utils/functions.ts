/* eslint-disable @typescript-eslint/no-explicit-any */
// LIBS
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Api } from '../../../../../../../services/api';
import { unMask, catchHandler } from '../../../../../../../utils/functions';
import { requestBuildingDetails } from '../../../functions';

// FUNCTIONS

// TYPES
import { IRequestDeleteBuilding, IRequestEditBuilding } from './types';

export const requestEditBuilding = async ({
  values,
  setModal,
  setOnQuery,
  setBuilding,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
}: IRequestEditBuilding) => {
  setOnQuery(true);

  await Api.put('/buildings/edit', {
    buildingId: values.id,
    data: {
      name: values.name,
      buildingTypeId: values.buildingTypeId,
      cep: values.cep !== '' ? unMask(values.cep) : null,
      city: values.city !== '' ? values.city : null,
      state: values.state !== '' ? values.state : null,
      neighborhood: values.neighborhood !== '' ? values.neighborhood : null,
      streetName: values.streetName !== '' ? values.streetName : null,
      area: values.area !== '' ? unMask(values.area) : null,
      deliveryDate: new Date(values.deliveryDate),
      warrantyExpiration: new Date(values.warrantyExpiration),
      keepNotificationAfterWarrantyEnds: values.keepNotificationAfterWarrantyEnds,
    },
  })
    .then((res) => {
      requestBuildingDetails({
        buildingId: values.id,
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

export const requestDeleteBuilding = async ({
  setModal,
  setOnQuery,
  buildingId,
  navigate,
}: IRequestDeleteBuilding) => {
  setOnQuery(true);

  await Api.delete('/buildings/delete', {
    data: {
      buildingId,
    },
  })
    .then((res) => {
      setModal(false);
      navigate('/buildings', { replace: true });
      toast.success(res.data.ServerMessage.message);
      setOnQuery(false);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

// YUP
export const schemaModalEditBuilding = yup
  .object({
    name: yup.string().required('O nome deve ser preenchido.'),
    buildingTypeId: yup.string().required('O tipo deve ser selecionado.'),
    cep: yup.string().min(9, 'Digite um CEP válido.'),
    city: yup.string(),
    state: yup.string(),
    neighborhood: yup.string(),
    streetName: yup.string(),
    area: yup.string().not(['0,00'], 'Digite um número maior que zero.'),
    deliveryDate: yup.date().required('A data de entrega deve ser preenchida.'),
    warrantyExpiration: yup
      .date()
      .required('O término da garantia deve ser preenchido.')
      .min(yup.ref('deliveryDate'), 'O término da garantia deve ser maior que a data de entrega.'),
    keepNotificationAfterWarrantyEnds: yup.boolean(),
  })
  .required();
