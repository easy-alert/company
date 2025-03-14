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

export const ModalAddFiles = ({ setModal, folderId, setBuilding }: IModalAddFiles) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles((prevState) => [...prevState, ...acceptedFiles]);
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
                // eslint-disable-next-line react/no-array-index-key
                key={e.name + i}
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
          bgColor="primary"
          loading={onQuery}
          label="Cadastrar"
          center
          onClick={() => {
            requestRegisterBuildingFile({
              files,
              setOnQuery,
              folderId,
              setModal,
              setBuilding,
            });
          }}
        />
      </Style.Container>
    </Modal>
  );
};
