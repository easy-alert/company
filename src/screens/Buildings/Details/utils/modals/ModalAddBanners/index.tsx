// LIBS
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import { useEffect, useState } from 'react';
import { Modal } from '../../../../../../components/Modal';
import { IImage, IModalAddBanners } from './utils/types';
import { Image } from '../../../../../../components/Image';
import { Button } from '../../../../../../components/Buttons/Button';
import { Input } from '../../../../../../components/Inputs/Input';
import { IconButton } from '../../../../../../components/Buttons/IconButton';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../../../assets/icons';

// FUNCTIONS
import { insertMiddleEllipsis, requestRegisterBuildingFile } from './utils/functions';
import { uploadFile } from '../../../../../../utils/functions';
import { ImagePreview } from '../../../../../../components/ImagePreview';

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

  const [mobileBanner, setMobileBanner] = useState<File[]>([]);
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

        <Style.DragAndDropWrapper>
          <h6>Banner web</h6>
          {webBanner.length === 0 ? (
            <Style.DragAndDropZone {...getRootPropsWeb({ className: 'dropzone' })}>
              <input {...getInputPropsWeb()} />

              <Style.Content>
                <Image img={icon.addFile} width="60px" height="48px" radius="0" />
                <p className="p2">Clique ou arraste para enviar seu arquivo.</p>
              </Style.Content>
            </Style.DragAndDropZone>
          ) : (
            <Style.FileZone>
              <ImagePreview
                src={webBanner[0].url}
                imageCustomName={webBanner[0].name}
                height="200px"
                width="200px"
              />
            </Style.FileZone>
          )}
        </Style.DragAndDropWrapper>

        <Style.DragAndDropWrapper>
          <h6>Banner mobile</h6>
          {mobileBanner.length === 0 ? (
            <Style.DragAndDropZone {...getRootPropsMobile({ className: 'dropzone' })}>
              <input {...getInputPropsMobile()} />

              <Style.Content>
                <Image img={icon.addFile} width="60px" height="48px" radius="0" />
                <p className="p2">Clique ou arraste para enviar seu arquivo.</p>
              </Style.Content>
            </Style.DragAndDropZone>
          ) : (
            <Style.FileZone>
              <p className="p2">{insertMiddleEllipsis(mobileBanner[0]?.name)}</p>
              <IconButton
                icon={icon.x}
                size="24px"
                onClick={() => {
                  setMobileBanner([]);
                }}
              />
            </Style.FileZone>
          )}
        </Style.DragAndDropWrapper>
        <Button
          loading={onQuery}
          label="Cadastrar"
          center
          onClick={() => {
            requestRegisterBuildingFile({
              files: acceptedWeb,
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
