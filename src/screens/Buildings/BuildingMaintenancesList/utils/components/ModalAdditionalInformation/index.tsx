// REACT
import { useEffect, useState } from 'react';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';
import { Button } from '@components/Buttons/Button';
import { TextArea } from '@components/Inputs/TextArea';
import { Select } from '@components/Inputs/Select';

// GLOBAL UTILS
import { catchHandler } from '@utils/functions';

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
  handleUpdateAdditionalInformation: (additionalInformation: string) => void;
  handleModals: ({ modal, modalState }: IHandleModals) => void;
}

export const ModalAdditionalInformation = ({
  selectedMaintenance,
  handleUpdateAdditionalInformation,
  handleModals,
}: IModalAdditionalInformation) => {
  const [userResponsible, setUserResponsible] = useState<IUser>(
    selectedMaintenance.userResponsible || ({} as IUser),
  );
  console.log('🚀 ~ userResponsible:', userResponsible);
  const [userResponsibleOptions, setUserResponsibleOptions] = useState<{ User: IUser }[]>([]);
  const [additionalInformation, setAdditionalInformation] = useState<string>(
    selectedMaintenance.additionalInfo,
  );

  const handleChangeAdditionalInformation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalInformation(event.target.value);
  };

  useEffect(() => {
    const handleGetUsersResponsible = async () => {
      try {
        const response = await Api.get(
          `permissions/user-buildings-permissions/users/${selectedMaintenance.buildingId}`,
        );

        setUserResponsibleOptions(response.data.userBuildings);
      } catch (error: any) {
        catchHandler(error);
      }
    };

    handleGetUsersResponsible();
  }, []);

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
            onChange={(event) => {
              const user = userResponsibleOptions.find(
                ({ User }) => User.id === event.target.value,
              );

              setUserResponsible(user?.User || ({} as IUser));
            }}
          >
            <option value="">Selecione um responsável</option>

            {userResponsibleOptions.map(({ User }) => (
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
            onClick={() => handleUpdateAdditionalInformation(additionalInformation)}
          />
        </Style.ButtonContainer>
      </Style.ModalContainer>
    </Modal>
  );
};
