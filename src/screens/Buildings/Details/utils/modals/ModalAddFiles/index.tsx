// LIBS
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import { useCallback, useState } from 'react';
import { Modal } from '../../../../../../components/Modal';
import { Image } from '../../../../../../components/Image';
import { Button } from '../../../../../../components/Buttons/Button';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../../../assets/icons';

// FUNCTIONS
import { requestRegisterBuildingFile } from './functions';
import { IModalAddFiles } from './types';
import { ListTag } from '../../../../../../components/ListTag';

export const ModalAddFiles = ({
  setModal,
  buildingId,
  setBuilding,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
}: IModalAddFiles) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
    },
    [files],
  );

  const [onQuery, setOnQuery] = useState<boolean>(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: onQuery,
  });

  return (
    <Modal title="Cadastrar anexos" setModal={setModal}>
      <Style.Container>
        <Style.DragAndDropZone {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />

          <Style.Content>
            <Image img={icon.addFile} width="60px" height="48px" radius="0" />
            <p className="p2" />
          </Style.Content>
        </Style.DragAndDropZone>

        {files.length > 0 && (
          <Style.TagsWrapper>
            {files.map((e, i) => (
              <ListTag
                label={e.name}
                key={e.name}
                onClick={() => {
                  setFiles((prevState) => {
                    const newState = [...prevState];
                    newState.splice(i, 1);
                    return newState;
                  });
                }}
              />
            ))}
          </Style.TagsWrapper>
        )}

        <Button
          loading={onQuery}
          label="Cadastrar"
          center
          onClick={() => {
            requestRegisterBuildingFile({
              files,
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
