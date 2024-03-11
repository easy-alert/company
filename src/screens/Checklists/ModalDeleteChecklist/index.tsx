import { toast } from 'react-toastify';
import { useState } from 'react';
import * as Style from './styles';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Buttons/Button';
import { Api } from '../../../services/api';
import { PopoverButton } from '../../../components/Buttons/PopoverButton';
import { theme } from '../../../styles/theme';
import { catchHandler } from '../../../utils/functions';
import { InputRadio } from '../../../components/Inputs/InputRadio';

interface IModalDeleteChecklist {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onThenRequest: () => Promise<void>;
  checklistId: string;
}

type TDeleteMode = 'this' | 'all' | 'thisAndFollowing' | '';

export const ModalDeleteChecklist = ({
  setModal,
  onThenRequest,
  checklistId,
}: IModalDeleteChecklist) => {
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<TDeleteMode>('');

  const handleOnChange = (value: TDeleteMode) => {
    setDeleteMode(value);
  };

  const completeChecklist = async () => {
    setOnQuery(true);

    await Api.delete(`/checklists/${checklistId}/${deleteMode}`)
      .then((res) => {
        onThenRequest();
        toast.success(res.data.ServerMessage.message);
        setModal(false);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  const inputs = [
    { id: '1', name: 'mode', value: 'this', label: 'Este checklist' },
    { id: '2', name: 'mode', value: 'thisAndFollowing', label: 'Este e os checklists seguintes' },
    { id: '3', name: 'mode', value: 'all', label: 'Todos os checklists' },
  ];

  return (
    <Modal setModal={setModal} title="Excluir checklist">
      <Style.Container>
        {inputs.map((input) => (
          <InputRadio
            id={input.id}
            key={input.value}
            value={input.value}
            name={input.name}
            label={input.label}
            checked={deleteMode === input.value}
            onChange={(evt) => handleOnChange(evt.target.value as TDeleteMode)}
          />
        ))}

        <Style.ButtonContainer>
          <Button
            borderless
            label="Cancelar"
            type="button"
            loading={onQuery}
            onClick={() => {
              setModal(false);
            }}
          />

          <PopoverButton
            disabled={onQuery || !deleteMode}
            actionButtonBgColor={theme.color.actionDanger}
            type="Button"
            label="Excluir"
            message={{
              title: 'Deseja excluir este checklist?',
              content: 'Atenção, essa ação não poderá ser desfeita posteriormente.',
              contentColor: theme.color.danger,
            }}
            actionButtonClick={completeChecklist}
          />
        </Style.ButtonContainer>
      </Style.Container>
    </Modal>
  );
};
