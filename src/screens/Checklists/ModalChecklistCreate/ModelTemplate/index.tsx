import { useState } from 'react';

import { deleteChecklistTemplate } from '@services/apis/deleteChecklistTemplate';

import { IconButton } from '@components/Buttons/IconButton';

import IconCheck from '@assets/icons/IconCheck';
import IconTrash from '@assets/icons/IconTrash';

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
    try {
      const responseData = await deleteChecklistTemplate({ checklistTemplateId: templateId });

      if (responseData) {
        setChecklistTemplates((prevTemplates) =>
          prevTemplates.filter((template) => template.id !== templateId),
        );

        if (selectedTemplate?.id === templateId) {
          setSelectedTemplate(null);
        }
      }
    } catch (error) {
      console.error('Erro ao deletar o template:', error);
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
              setSelectedTemplate(template);
              handleSelectChecklistTemplate(template);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {selectedTemplate?.id === template.id && <IconCheck />}

              <Style.TemplateOption>{template.name}</Style.TemplateOption>
            </div>

            <IconButton
              icon={<IconTrash strokeColor="danger" />}
              onClick={async () => {
                if (template.id) {
                  await handleDeleteChecklistTemplate(template.id);
                }
              }}
            />
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
