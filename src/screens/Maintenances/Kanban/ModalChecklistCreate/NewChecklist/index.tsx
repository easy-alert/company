import { useState } from 'react';

import { Button } from '@components/Buttons/Button';
import { Input } from '@components/Inputs/Input';
import { IconButton } from '@components/Buttons/IconButton';

import { icon } from '@assets/icons';

import { handleToastifyMessage } from '@utils/toastifyResponses';

import type { IChecklistTemplate } from '@customTypes/IChecklistTemplate';

import * as Style from './styles';

interface INewChecklist {
  newChecklist: IChecklistTemplate;
  handleNewChecklistTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewChecklistItemChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleNewChecklistItemDelete: (index: number) => void;
  handleCreateChecklistTemplate: (checklistTemplate: IChecklistTemplate) => void;
}

export const NewChecklist = ({
  newChecklist,
  handleNewChecklistTitleChange,
  handleNewChecklistItemChange,
  handleNewChecklistItemDelete,
  handleCreateChecklistTemplate,
}: INewChecklist) => {
  const [titleMode, setTitleMode] = useState<'input' | 'text'>('input');

  const saveChecklist = () => {
    if (newChecklist.name && newChecklist.items?.length) {
      const checklistTemplate: IChecklistTemplate = {
        ...newChecklist,
        items: newChecklist.items?.map((item) => ({
          name: item.name,
        })),
      };

      handleCreateChecklistTemplate(checklistTemplate);
    } else {
      handleToastifyMessage({ type: 'warning', message: 'Por favor, preencha todos os campos.' });
    }
  };

  return (
    <Style.Content>
      {titleMode === 'text' ? (
        <Style.ChecklistTitle onClick={() => setTitleMode('input')}>
          <p>{newChecklist.name}</p>
        </Style.ChecklistTitle>
      ) : (
        <Input
          label=""
          value={newChecklist.name}
          placeholder="Título do checklist"
          onChange={(e) => handleNewChecklistTitleChange(e)}
          onBlur={() => {
            if (!(newChecklist.name ?? '').trim()) {
              setTitleMode('input');
            } else {
              setTitleMode('text');
            }
          }}
          onKeyDown={(e) => e.key === 'Enter' && setTitleMode('text')}
          autoFocus
          onFocus={(e) => e.target.select()}
        />
      )}

      <Style.ChecklistContainer>
        {newChecklist.items?.map((item, index) => (
          <Style.ChecklistItem key={item.id}>
            <Input
              label=""
              type="text"
              value={item.name}
              onChange={(e) => handleNewChecklistItemChange(e, index)}
            />

            <IconButton
              icon={icon.trashWithPrimaryBg}
              onClick={() => handleNewChecklistItemDelete(index)}
            />
          </Style.ChecklistItem>
        ))}

        <Style.ChecklistButtons>
          <Button
            label="Adicionar"
            onClick={() => {
              const newItems = newChecklist.items || [];
              newItems.push({ id: newItems.length.toString(), name: '' });
              handleNewChecklistItemChange({ target: { value: '' } } as any, newItems.length - 1);
            }}
          />

          <Button label="Salvar" bgColor="transparent" textColor="black" onClick={saveChecklist} />
        </Style.ChecklistButtons>
      </Style.ChecklistContainer>
    </Style.Content>
  );
};
