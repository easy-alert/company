import { useState } from 'react';

import IconCheck from '@assets/icons/IconCheck';

import type { IChecklistTemplate } from '@customTypes/IChecklistTemplate';

import { Button } from '@components/Buttons/Button';
import { Input } from '@components/Inputs/Input';
import { IconButton } from '@components/Buttons/IconButton';
import IconTrash from '@assets/icons/IconTrash';
import IconPlus from '@assets/icons/IconPlus';
import * as Style from './styles';

interface ModelTemplateProps {
  checklistTemplates: IChecklistTemplate[];
  selectedChecklistTemplate: IChecklistTemplate | null;
  handleSelectChecklistTemplate: (template: IChecklistTemplate) => void;
}

export const ModelTemplate = ({
  checklistTemplates,
  selectedChecklistTemplate,
  handleSelectChecklistTemplate,
}: ModelTemplateProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<IChecklistTemplate | null>(null);

  return (
    <Style.Content>
      {!selectedChecklistTemplate?.id && (
        <>
          <Style.SelectTitle>Selecione um modelo</Style.SelectTitle>

          {checklistTemplates.length > 0 ? (
            checklistTemplates.map((template) => (
              <Style.TemplateContainer
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
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

          <Style.SelectTemplateButtonContainer>
            <Button
              bgColor="primary"
              label="Selecionar modelo"
              onClick={() => handleSelectChecklistTemplate(selectedTemplate as IChecklistTemplate)}
            />
          </Style.SelectTemplateButtonContainer>
        </>
      )}

      {selectedChecklistTemplate?.id && (
        <>
          <Input
            label=""
            value={selectedChecklistTemplate.name}
            placeholder="Título do checklist"
            onChange={(e) =>
              handleSelectChecklistTemplate({ ...selectedChecklistTemplate, name: e.target.value })
            }
            autoFocus
            onFocus={(e) => e.target.select()}
          />

          <Style.ChecklistContainer>
            {selectedChecklistTemplate.items?.map((item, index) => (
              <Style.ChecklistItem key={item.id}>
                <Input
                  label=""
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleSelectChecklistTemplate({
                      ...selectedChecklistTemplate,
                      items: selectedChecklistTemplate.items?.map((i, idx) =>
                        idx === index ? { ...i, name: e.target.value } : i,
                      ),
                    })
                  }
                />

                <IconButton
                  icon={<IconTrash strokeColor="danger" />}
                  onClick={() =>
                    handleSelectChecklistTemplate({
                      ...selectedChecklistTemplate,
                      items: selectedChecklistTemplate.items?.filter((_, idx) => idx !== index),
                    })
                  }
                />
              </Style.ChecklistItem>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                icon={<IconPlus strokeColor="success" />}
                onClick={() =>
                  handleSelectChecklistTemplate({
                    ...selectedChecklistTemplate,
                    items: [...(selectedChecklistTemplate.items || []), { name: '' }],
                  })
                }
              />
            </div>

            <Style.ButtonContainer>
              <Button
                label="Voltar"
                color="danger"
                borderless
                onClick={() => handleSelectChecklistTemplate({} as IChecklistTemplate)}
              />
            </Style.ButtonContainer>
          </Style.ChecklistContainer>
        </>
      )}
    </Style.Content>
  );
};
