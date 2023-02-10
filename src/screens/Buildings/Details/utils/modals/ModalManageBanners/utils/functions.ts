import { toast } from 'react-toastify';
import { Api } from '../../../../../../../services/api';
import { catchHandler } from '../../../../../../../utils/functions';
import { requestBuildingDetails } from '../../../functions';
import { IData, IRequestRegisterBuildingBanners } from './types';

export const requestRegisterBuildingBanners = async ({
  setOnQuery,
  buildingId,
  setBuilding,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
  setModal,
  bannerLink,
  bannerName,
  webBanner,
  mobileBanner,
}: IRequestRegisterBuildingBanners) => {
  if (!bannerName) {
    toast.error('Verifique a informação: nome do banner e tente novamente.');
    return;
  }

  if (!bannerLink) {
    toast.error('Verifique a informação: link do banner e tente novamente.');
    return;
  }

  setOnQuery(true);

  const data: IData[] = [];

  data.push(
    {
      buildingId,
      bannerName: bannerName !== '' ? bannerName : null,
      redirectUrl: bannerLink !== '' ? bannerLink : null,
      type: 'Web',
      url: webBanner[0]?.url,
      originalName: webBanner[0]?.name,
    },
    {
      buildingId,
      bannerName: bannerName !== '' ? bannerName : null,
      redirectUrl: bannerLink !== '' ? bannerLink : null,
      type: 'Mobile',
      url: mobileBanner[0]?.url,
      originalName: mobileBanner[0]?.name,
    },
  );

  await Api.post('/buildings/banners/change', {
    data,
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
