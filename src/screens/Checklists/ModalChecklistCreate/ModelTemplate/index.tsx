import { useState } from 'react';
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';
import { icon } from '@assets/icons';
import type { IChecklistTemplate } from '@customTypes/IChecklistTemplate';
import { deleteChecklistTemplate } from '@services/apis/deleteChecklistTemplate';
import IconTrash from '@assets/icons/IconTrash';
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
      const response = await deleteChecklistTemplate({ checklistTemplateId: templateId });

      if (response) {
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
          <Style.TemplateContainer key={template.id}>
            {selectedTemplate?.id === template.id && <Image img={icon.checked} size="16px" />}

            <Style.TemplateOption
              onClick={() => {
                setSelectedTemplate(template);
                handleSelectChecklistTemplate(template);
              }}
            >
              {template.name}
            </Style.TemplateOption>

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
