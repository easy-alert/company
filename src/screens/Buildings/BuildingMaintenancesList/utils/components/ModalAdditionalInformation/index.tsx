// REACT
import { useState } from 'react';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { TextArea } from '@components/Inputs/TextArea';

// STYLE
import * as Style from './styles';

// TYPES

interface IModalAdditionalInformation {
  maintenanceAdditionalInfo: string;
  handleUpdateAdditionalInformation: (additionalInformation: string) => void;
  handleModalAdditionalInformation: (modalState: boolean) => void;
}

export const ModalAdditionalInformation = ({
  maintenanceAdditionalInfo,
  handleUpdateAdditionalInformation,
  handleModalAdditionalInformation,
}: IModalAdditionalInformation) => {
  const [additionalInformation, setAdditionalInformation] =
    useState<string>(maintenanceAdditionalInfo);

  const handleChangeAdditionalInformation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalInformation(event.target.value);
  };

  return (
    <Modal
      title="Informações adicionais"
      closeOutside={false}
      setModal={handleModalAdditionalInformation}
    >
      <Style.ModalContainer>
        <Style.ModalText>
          Use o campo abaixo para adicionar algumas informações para esta manutenção:
        </Style.ModalText>

        <TextArea
          placeholder="Digite aqui..."
          value={additionalInformation}
          rows={5}
          cols={50}
          onChange={handleChangeAdditionalInformation}
        />

        <Style.ButtonContainer>
          <Button
            label="Salvar"
            onClick={() => handleUpdateAdditionalInformation(additionalInformation)}
          />
        </Style.ButtonContainer>
      </Style.ModalContainer>
    </Modal>
  );
};
