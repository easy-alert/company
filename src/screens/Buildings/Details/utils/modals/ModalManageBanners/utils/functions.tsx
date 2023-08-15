import { toast } from 'react-toastify';
import { Api } from '../../../../../../../services/api';
import { catchHandler } from '../../../../../../../utils/functions';
import { IData, IRequestRegisterBuildingBanners } from './types';

export const requestRegisterBuildingBanners = async ({
  setOnQuery,
  buildingId,
  setModal,
  bannerLink,
  bannerName,
  webBanner,
  mobileBanner,
  requestBuildingDetailsCall,
}: IRequestRegisterBuildingBanners) => {
  if (!bannerName) {
    toast.error('Verifique a informação: nome do banner e tente novamente.');
    return;
  }

  if (bannerLink && !bannerLink.startsWith('https://') && !bannerLink.startsWith('http://')) {
    toast.error(
      <div>
        Informe um link válido.
        <br />
        Ex: https://easyalert.com.br
      </div>,
    );
    return;
  }

  setOnQuery(true);

  const data: IData[] = [];

  if (webBanner.length > 0) {
    data.push({
      buildingId,
      bannerName: bannerName !== '' ? bannerName : null,
      redirectUrl: bannerLink !== '' ? bannerLink : null,
      type: 'Web',
      url: webBanner[0]?.url,
      originalName: webBanner[0]?.name,
    });
  }

  if (mobileBanner.length > 0) {
    data.push({
      buildingId,
      bannerName: bannerName !== '' ? bannerName : null,
      redirectUrl: bannerLink !== '' ? bannerLink : null,
      type: 'Mobile',
      url: mobileBanner[0]?.url,
      originalName: mobileBanner[0]?.name,
    });
  }

  await Api.post('/buildings/banners/change', {
    data,
    buildingId,
  })
    .then((res) => {
      requestBuildingDetailsCall();
      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};
