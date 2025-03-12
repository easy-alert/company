import { useState } from 'react';

import { deleteChecklist } from '@services/apis/deleteChecklist';

import IconCheck from '@assets/icons/IconCheck';

import type { IChecklistTemplate } from '@customTypes/IChecklistTemplate';

import * as Style from './styles';

interface ModelTemplateProps {
  checklistTemplates: IChecklistTemplate[];
  handleSelectChecklistTemplate: (template: IChecklistTemplate) => void;
  setChecklistTemplates: (
    templates:
      | IChecklistTemplate[]
      | ((prevTemplates: IChecklistTemplate[]) => IChecklistTemplate[]),
  ) => void;
}

export const ModelTemplate = ({
  checklistTemplates,
  handleSelectChecklistTemplate,
  setChecklistTemplates,
}: ModelTemplateProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<IChecklistTemplate | null>(null);

  const handleDeleteChecklistTemplate = async (templateId: string) => {
    await deleteChecklist({ checklistId: templateId, deleteMode: 'this' });

    setChecklistTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template.id !== templateId),
    );

    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
  };

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
