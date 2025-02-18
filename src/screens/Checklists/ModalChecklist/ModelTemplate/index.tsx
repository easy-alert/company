import { useState } from 'react';
import * as Style from './styles';

interface ModelTemplateProps {
  savedTemplates: { title: string; tasks: { id: string; task: string }[] }[];
  onSelectTemplate: (template: { title: string; tasks: { id: string; task: string }[] }) => void;
}

export const ModelTemplate = ({ savedTemplates, onSelectTemplate }: ModelTemplateProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    tasks: { id: string; task: string }[];
  } | null>(null);

  return (
    <Style.Content>
      <Style.SelectContainer>
        <Style.SelectTitle>Selecione um template</Style.SelectTitle>

        {savedTemplates.length > 0 ? (
          savedTemplates.map((template) => (
            <Style.Option
              key={template.title}
              onClick={() => {
                setSelectedTemplate(template);
                onSelectTemplate(template);
              }}
            >
              {template.title}
            </Style.Option>
          ))
        ) : (
          <p>Nenhum template foi salvo até o momento.</p>
        )}
      </Style.SelectContainer>

      {selectedTemplate && (
        <Style.SelectedTemplateContainer>
          <Style.TemplateTitle>{selectedTemplate.title}</Style.TemplateTitle>
          <Style.TaskList>
            {selectedTemplate.tasks.map(({ id, task }) => (
              <Style.TaskItem key={id}>{task}</Style.TaskItem>
            ))}
          </Style.TaskList>
        </Style.SelectedTemplateContainer>
      )}
    </Style.Content>
  );
};
