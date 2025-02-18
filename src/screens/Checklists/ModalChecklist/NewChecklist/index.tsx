import { useState } from 'react';
import { Button } from '@components/Buttons/Button';
import * as Style from './styles';

export const NewChecklist = ({
  onSaveChecklist,
}: {
  onSaveChecklist: (checklist: { title: string; tasks: { id: string; task: string }[] }) => void;
}) => {
  const [title, setTitle] = useState('');
  const [newItem, setNewItem] = useState('');
  const [tasks, setTasks] = useState<{ id: string; task: string }[]>([]);

  const addItem = () => {
    if (newItem.trim()) {
      const newTask = { id: Date.now().toString(), task: newItem };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewItem('');
    }
  };

  const saveChecklist = () => {
    if (title.trim() && tasks.length > 0) {
      const checklist = { title, tasks };
      onSaveChecklist(checklist);
    }
  };

  return (
    <Style.Content>
      <Style.ChecklistHeader>
        <input
          type="text"
          placeholder="Digite o título da atividade"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Style.ChecklistHeader>

      <Style.InputText>
        <input
          type="text"
          placeholder="Adicionar uma tarefa"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
      </Style.InputText>

      <Style.ButtonContainer>
        <Button label="Adicionar Tarefa" onClick={addItem} />
        <Button label="Salvar Checklist" onClick={saveChecklist} />
        <Button label="Cancelar" bgColor="transparent" textColor="actionBlue" />
      </Style.ButtonContainer>

      {title && tasks.length > 0 && (
        <div>
          <h3>{title}</h3>
          <ul>
            {tasks.map(({ id, task }) => (
              <li key={id}>{task}</li>
            ))}
          </ul>
        </div>
      )}
    </Style.Content>
  );
};
