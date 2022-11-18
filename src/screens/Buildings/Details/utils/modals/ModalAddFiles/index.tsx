// LIBS
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import { Modal } from '../../../../../../components/Modal';
import { IModalAddFiles } from './utils/types';
import { Image } from '../../../../../../components/Image';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../../../assets/icons';
import { insertMiddleEllipsis } from '../../functions';
import { IconButton } from '../../../../../../components/Buttons/IconButton';

export const ModalAddFiles = ({ setModal }: IModalAddFiles) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  return (
    <Modal title="Cadastrar anexos" setModal={setModal}>
      <>
        <h6>Anexar</h6>
        <Style.DragAndDropZone {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Style.Content>
            <Image img={icon.addFile} width="60px" height="48px" radius="0" />
            <p className="p2">Clique ou arraste para enviar arquivos.</p>
          </Style.Content>
        </Style.DragAndDropZone>

        <Style.MatrixTagWrapper>
          {acceptedFiles.map((file, i: number) => (
            <Style.Tag key={file.name + String(i)}>
              <Image size="16px" img={icon.paperBlack} />
              <p title={file.name} className="p3">
                {insertMiddleEllipsis(file.name)}
              </p>
              <IconButton
                size="16px"
                icon={icon.xBlack}
                onClick={() => {
                  //
                }}
              />
            </Style.Tag>
          ))}
        </Style.MatrixTagWrapper>
      </>
    </Modal>
  );
};
