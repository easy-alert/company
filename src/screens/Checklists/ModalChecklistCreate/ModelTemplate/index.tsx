import { useState } from 'react';

import IconCheck from '@assets/icons/IconCheck';

import type { IChecklistTemplate } from '@customTypes/IChecklistTemplate';

import * as Style from './styles';

interface ModelTemplateProps {
  checklistTemplates: IChecklistTemplate[];
  handleSelectChecklistTemplate: (template: IChecklistTemplate) => void;
}

export const ModelTemplate = ({
  checklistTemplates,
  handleSelectChecklistTemplate,
}: ModelTemplateProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<IChecklistTemplate | null>(null);

  return (
    <Style.Content>
      <Style.SelectTitle>Selecione um template</Style.SelectTitle>
      {checklistTemplates.length > 0 ? (
        checklistTemplates.map((template) => (
          <Style.TemplateContainer
            key={template.id}
            onClick={() => {
              setSelectedTemplate(template);
              handleSelectChecklistTemplate(template);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {selectedTemplate?.id === template.id && <IconCheck />}

              <Style.TemplateOption>{template.name}</Style.TemplateOption>
            </div>
          </Style.TemplateContainer>
        ))
      ) : (
        <p>Nenhum template foi salvo até o momento.</p>
      )}

      {selectedTemplate && (
        <Style.SelectedTemplate>
          <Style.SelectedTemplateTitle>{selectedTemplate.name}</Style.SelectedTemplateTitle>
          <Style.SelectedTemplateTasks>
            {selectedTemplate.items?.map((item) => (
              <Style.SelectedTemplateTask key={item.id}>{item.name}</Style.SelectedTemplateTask>
            ))}
          </Style.SelectedTemplateTasks>
        </Style.SelectedTemplate>
      )}
    </Style.Content>
  );
};
