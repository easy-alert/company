import { useState } from 'react';

import { Image } from '@components/Image';

import { icon } from '@assets/icons';

import type { IChecklistTemplate } from '@customTypes/IChecklistTemplate';

import IconCheck from '@assets/icons/IconCheck';
import * as Style from './styles';

interface ModelTemplateProps {
  checklistTemplates: IChecklistTemplate[];
  handleSelectChecklistTemplate: (template: IChecklistTemplate) => void;
}

export const ModelTemplate = ({
  checklistTemplates,
  handleSelectChecklistTemplate,
}: ModelTemplateProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<IChecklistTemplate>({});

  return (
    <Style.Content>
      <Style.SelectTitle>Selecione um template</Style.SelectTitle>
      {checklistTemplates.length > 0 ? (
        checklistTemplates.map((template) => (
          <Style.TemplateContainer
            key={template.id}
            onClick={() => {
              setSelectedTemplate({
                id: template.id,
                name: template.name,
                items: template.items,
              });

              handleSelectChecklistTemplate({
                id: template.id,
                name: template.name,
                items: template.items,
              });
            }}
          >
            {selectedTemplate?.id === template.id && <IconCheck />}

            <Style.TemplateOption>{template.name}</Style.TemplateOption>
          </Style.TemplateContainer>
        ))
      ) : (
        <p>Nenhum template foi salvo até o momento.</p>
      )}

      {Object.keys(selectedTemplate).length > 0 && (
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
