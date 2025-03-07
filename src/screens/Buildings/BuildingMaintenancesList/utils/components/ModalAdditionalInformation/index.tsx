// REACT
import { useState } from 'react';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { TextArea } from '@components/Inputs/TextArea';
import { Select } from '@components/Inputs/Select';

// GLOBAL TYPES
import type { IUser } from '@customTypes/IUser';

// STYLE
import * as Style from './styles';

// TYPES
import type { IHandleModals } from '../../types';

interface IModalAdditionalInformation {
  selectedMaintenance: {
    buildingId: string;
    maintenanceId: string;
    userResponsible?: IUser;
    additionalInfo: string;
  };
  usersResponsible: { User: IUser }[];
  handleUpdateAdditionalInformation: (
    additionalInformation: string,
    userResponsible: IUser,
  ) => void;
  handleModals: ({ modal, modalState }: IHandleModals) => void;
}

export const ModalAdditionalInformation = ({
  selectedMaintenance,
  usersResponsible,
  handleUpdateAdditionalInformation,
  handleModals,
}: IModalAdditionalInformation) => {
  const [userResponsible, setUserResponsible] = useState<IUser>(
    selectedMaintenance.userResponsible || ({} as IUser),
  );
  const [additionalInformation, setAdditionalInformation] = useState<string>(
    selectedMaintenance.additionalInfo,
  );

  const handleChangeAdditionalInformation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalInformation(event.target.value);
  };

  const handleChangeUserResponsible = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const user = usersResponsible.find(({ User }) => User.id === event.target.value);

    setUserResponsible(user?.User || ({} as IUser));
  };

  return (
    <Modal
      title="Informações adicionais"
      setModal={(state) => handleModals({ modal: 'additionalInformation', modalState: state })}
      closeOutside={false}
    >
      <Style.ModalContainer>
        <Style.ModalContent>
          <Style.ModalText>
            Use o campo abaixo para selecionar um responsável para esta manutenção:
          </Style.ModalText>

          <Select
            value={userResponsible.id}
            onChange={handleChangeUserResponsible}
            arrowColor="primary"
          >
            <option value="">Selecione um responsável</option>

            {usersResponsible.map(({ User }) => (
              <option key={User.id} value={User.id}>
                {User.name}
              </option>
            ))}
          </Select>
        </Style.ModalContent>

        <Style.ModalContent>
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
        </Style.ModalContent>

        <Style.ButtonContainer>
          <Button
            label="Salvar"
            onClick={() =>
              handleUpdateAdditionalInformation(additionalInformation, userResponsible)
            }
          />
        </Style.ButtonContainer>
      </Style.ModalContainer>
    </Modal>
  );
};
