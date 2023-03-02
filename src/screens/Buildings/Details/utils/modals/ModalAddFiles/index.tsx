// LIBS
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import { useEffect, useState } from 'react';
import { Modal } from '../../../../../../components/Modal';
import { Image } from '../../../../../../components/Image';
import { Button } from '../../../../../../components/Buttons/Button';
import { Input } from '../../../../../../components/Inputs/Input';
import { IconButton } from '../../../../../../components/Buttons/IconButton';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../../../assets/icons';

// TYPES
import { IModalAddFiles } from './utils/types';

// FUNCTIONS
import { insertMiddleEllipsis, requestRegisterBuildingFile } from './utils/functions';

export const ModalAddFiles = ({
  setModal,
  buildingId,
  setBuilding,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
}: IModalAddFiles) => {
  const [files, setFiles] = useState<any[]>([]);

  const [fileName, setFileName] = useState<string>('');

  const [onQuery, setOnQuery] = useState<boolean>(false);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
    }
  }, [acceptedFiles]);

  return (
    <Modal title="Cadastrar anexos" setModal={setModal}>
      <Style.Container>
        <Input
          label="Nome do anexo"
          maxLength={50}
          value={fileName}
          placeholder="Ex: Foto do Edifício"
          onChange={(e) => {
            setFileName(e.target.value);
          }}
        />
        <h6>Anexo</h6>
        {files.length === 0 ? (
          <Style.DragAndDropZone {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />

            <Style.Content>
              <Image img={icon.addFile} width="60px" height="48px" radius="0" />
              <p className="p2" />
            </Style.Content>
          </Style.DragAndDropZone>
        ) : (
          <Style.FileZone>
            <p className="p2">{insertMiddleEllipsis(files[0]?.name)}</p>
            <IconButton
              icon={icon.x}
              size="24px"
              onClick={() => {
                setFiles([]);
              }}
            />
          </Style.FileZone>
        )}

        <Button
          loading={onQuery}
          label="Cadastrar"
          center
          onClick={() => {
            requestRegisterBuildingFile({
              files,
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
