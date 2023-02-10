// LIBS
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import { useEffect, useState } from 'react';
import { Modal } from '../../../../../../components/Modal';
import { IImage, IModalAddBanners } from './utils/types';
import { Image } from '../../../../../../components/Image';
import { Button } from '../../../../../../components/Buttons/Button';
import { Input } from '../../../../../../components/Inputs/Input';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../../../assets/icons';

// FUNCTIONS
import { requestRegisterBuildingBanners } from './utils/functions';
import { uploadFile } from '../../../../../../utils/functions';
import { ImagePreview } from '../../../../../../components/ImagePreview';
import { DotLoading } from '../../../../../../components/Loadings/DotLoading';

export const ModalAddBanners = ({
  setModal,
  buildingId,
  setBuilding,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
}: IModalAddBanners) => {
  const [fileName, setFileName] = useState<string>('');
  const [bannerLink, setBannerLink] = useState<string>('');

  const [onQuery, setOnQuery] = useState<boolean>(false);

  const [onWebQuery, setWebOnQuery] = useState<boolean>(false);

  const [onMobileQuery, setMobileOnQuery] = useState<boolean>(false);

  const [webBanner, setWebBanner] = useState<IImage[]>([]);
  const {
    acceptedFiles: acceptedWeb,
    getRootProps: getRootPropsWeb,
    getInputProps: getInputPropsWeb,
  } = useDropzone({
    multiple: false,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
    disabled: onWebQuery,
  });

  const [mobileBanner, setMobileBanner] = useState<IImage[]>([]);
  const {
    acceptedFiles: acceptedMobile,
    getRootProps: getRootPropsMobile,
    getInputProps: getInputPropsMobile,
  } = useDropzone({
    multiple: false,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
    disabled: onMobileQuery,
  });

  useEffect(() => {
    if (acceptedWeb.length > 0) {
      const uploadAcceptedWeb = async () => {
        setWebOnQuery(true);

        const { Location: fileUrl, originalname: originalName } = await uploadFile(acceptedWeb[0]);

        setWebBanner((prevState) => {
          let newState = [...prevState];
          newState = [...newState, { name: originalName, url: fileUrl }];
          return newState;
        });
        setWebOnQuery(false);
      };

      uploadAcceptedWeb();
    }
  }, [acceptedWeb]);

  useEffect(() => {
    if (acceptedMobile.length > 0) {
      const uploadAcceptedMobile = async () => {
        setMobileOnQuery(true);

        const { Location: fileUrl, originalname: originalName } = await uploadFile(
          acceptedMobile[0],
        );

        setMobileBanner((prevState) => {
          let newState = [...prevState];
          newState = [...newState, { name: originalName, url: fileUrl }];
          return newState;
        });
        setMobileOnQuery(false);
      };

      uploadAcceptedMobile();
    }
  }, [acceptedMobile]);

  return (
    <Modal title="Cadastrar banners" setModal={setModal}>
      <Style.Container>
        <Input
          label="Nome do banner"
          maxLength={50}
          value={fileName}
          placeholder="Ex: Foto do Edifício"
          onChange={(e) => {
            setFileName(e.target.value);
          }}
        />
        <Input
          label="Link do banner"
          maxLength={50}
          value={bannerLink}
          placeholder="Ex: easyalert.com.br"
          onChange={(e) => {
            setBannerLink(e.target.value);
          }}
        />

        <Style.DragAndDropGrid>
          <Style.DragAndDropWrapper>
            <h6>Banner web</h6>
            {webBanner.length === 0 &&
              (onWebQuery ? (
                <Style.ImageLoading>
                  <DotLoading />
                </Style.ImageLoading>
              ) : (
                <Style.DragAndDropZone {...getRootPropsWeb({ className: 'dropzone' })}>
                  <input {...getInputPropsWeb()} />

                  <Style.Content>
                    <Image img={icon.addImage} width="48px" height="46px" radius="0" />
                    <p className="p2">Clique ou arraste para enviar sua imagem.</p>
                  </Style.Content>
                </Style.DragAndDropZone>
              ))}
            {webBanner.length > 0 && (
              <ImagePreview
                src={webBanner[0].url}
                imageCustomName={webBanner[0].name}
                height="202px"
                width="202px"
                onTrashClick={() => {
                  setWebBanner([]);
                }}
              />
            )}
          </Style.DragAndDropWrapper>

          <Style.DragAndDropWrapper>
            <h6>Banner mobile</h6>
            {mobileBanner.length === 0 &&
              (onMobileQuery ? (
                <Style.ImageLoading>
                  <DotLoading />
                </Style.ImageLoading>
              ) : (
                <Style.DragAndDropZone {...getRootPropsMobile({ className: 'dropzone' })}>
                  <input {...getInputPropsMobile()} />

                  <Style.Content>
                    <Image img={icon.addImage} width="48px" height="46px" radius="0" />
                    <p className="p2">Clique ou arraste para enviar sua imagem.</p>
                  </Style.Content>
                </Style.DragAndDropZone>
              ))}
            {mobileBanner.length > 0 && (
              <ImagePreview
                src={mobileBanner[0].url}
                imageCustomName={mobileBanner[0].name}
                height="202px"
                width="202px"
                onTrashClick={() => {
                  setMobileBanner([]);
                }}
              />
            )}
          </Style.DragAndDropWrapper>
        </Style.DragAndDropGrid>
        <Button
          center
          loading={onQuery}
          disable={onMobileQuery || onWebQuery}
          label="Cadastrar"
          onClick={() => {
            requestRegisterBuildingBanners({
              files: [],
              fileName,
              setOnQuery,
              buildingId,
              setBuilding,
              setTotalMaintenancesCount,
              setUsedMaintenancesCount,
              setModal,
            });
          }}
        />
      </Style.Container>
    </Modal>
  );
};
