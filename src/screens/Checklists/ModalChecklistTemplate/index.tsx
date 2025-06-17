import { useEffect, useState } from 'react';

// SERVICES
import { getChecklistsTemplates } from '@services/apis/getChecklistsTemplates';
import { deleteChecklistTemplate } from '@services/apis/deleteChecklistTemplate';
import { putChecklistTemplateById } from '@services/apis/putChecklistTemplateById';
import { createChecklistTemplate } from '@services/apis/createChecklistTemplate';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { LoadingWrapper } from '@components/Loadings/LoadingWrapper';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { IconButton } from '@components/Buttons/IconButton';
import { Input } from '@components/Inputs/Input';

// GLOBAL ASSETS
import IconTrash from '@assets/icons/IconTrash';
import IconEdit from '@assets/icons/IconEdit';
import IconPlus from '@assets/icons/IconPlus';
import IconDuplicate from '@assets/icons/IconDuplicate';

// GLOBAL TYPES
import { IChecklistTemplate } from '@customTypes/IChecklistTemplate';

// STYLES

import * as Style from './styles';

// TYPES
import type { TModalNames } from '..';

interface ModalSendReportProps {
  handleModals: (modal: TModalNames, modalState: boolean) => void;
}

export const ModalChecklistTemplate = ({ handleModals }: ModalSendReportProps) => {
  const [checklistTemplates, setChecklistTemplates] = useState<IChecklistTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<IChecklistTemplate | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const handleGetChecklistsTemplate = async () => {
    setLoading(true);

    try {
      const responseData = await getChecklistsTemplates({ buildingId: '' });
      setChecklistTemplates(responseData);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChecklistTemplate = async () => {
    if (!selectedTemplate) return;

    setLoading(true);

    try {
      const responseData = await putChecklistTemplateById({
        ...selectedTemplate,
      });
      console.log('🚀 ~ handleUpdateChecklistTemplate ~ responseData:', responseData);
    } finally {
      setLoading(false);
      setSelectedTemplate(null);
      handleRefresh();
    }
  };

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

  const handleCloneChecklistTemplate = async (checklistTemplate: IChecklistTemplate) => {
    setLoading(true);

    try {
      await createChecklistTemplate({
        buildingId: checklistTemplate.buildingId!,
        name: `${checklistTemplate?.name} (Cópia)`,
        description: checklistTemplate?.description || '',
        items: checklistTemplate?.items || [],
      });

      handleRefresh();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetChecklistsTemplate();
  }, [refresh]);

  return (
    <Modal
      title={selectedTemplate ? 'Editar modelo' : 'Modelos de checklist'}
      setModal={(modalState) => handleModals('modalChecklistTemplate', modalState)}
    >
      {loading ? (
        <LoadingWrapper minHeight="300px">
          <DotSpinLoading />
        </LoadingWrapper>
      ) : (
        <Style.Content>
          {!selectedTemplate && (
            <>
              <Style.SelectTitle>Selecione um modelo</Style.SelectTitle>

              <div>
                {checklistTemplates.length > 0 ? (
                  checklistTemplates.map((template) => (
                    <Style.TemplateContainer key={template.id}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Style.TemplateOption>{template.name}</Style.TemplateOption>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <IconButton
                          title="Editar"
                          icon={<IconEdit strokeColor="primary" />}
                          zIndex={1}
                          onClick={() => {
                            setSelectedTemplate(template);
                          }}
                        />

                        <IconButton
                          title="Clonar"
                          icon={<IconDuplicate strokeColor="primary" />}
                          zIndex={1}
                          onClick={() => handleCloneChecklistTemplate(template)}
                        />

                        <IconButton
                          title="Deletar"
                          icon={<IconTrash strokeColor="danger" />}
                          onClick={async () => {
                            if (template.id) {
                              await handleDeleteChecklistTemplate(template.id);
                            }
                          }}
                        />
                      </div>
                    </Style.TemplateContainer>
                  ))
                ) : (
                  <p>Nenhum template foi salvo até o momento.</p>
                )}
              </div>
            </>
          )}

          {selectedTemplate && (
            <>
              <Input
                label=""
                value={selectedTemplate.name}
                placeholder="Título do checklist"
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                autoFocus
                onFocus={(e) => e.target.select()}
              />

              <Style.ChecklistContainer>
                {selectedTemplate.items?.map((item, index) => (
                  <Style.ChecklistItem key={item.id}>
                    <Input
                      label=""
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        setSelectedTemplate((prev) => {
                          const newItems = [...(prev?.items || [])];
                          newItems[index].name = e.target.value;
                          return { ...prev, items: newItems };
                        })
                      }
                    />

                    <IconButton
                      icon={<IconTrash strokeColor="danger" />}
                      onClick={() =>
                        setSelectedTemplate((prev) => {
                          const newItems = [...(prev?.items || [])];
                          newItems.splice(index, 1);
                          return { ...prev, items: newItems };
                        })
                      }
                    />
                  </Style.ChecklistItem>
                ))}

                <div>
                  <IconButton
                    icon={<IconPlus strokeColor="success" />}
                    onClick={() =>
                      setSelectedTemplate((prev) => {
                        const newItems = [...(prev?.items || [])];
                        newItems.push({ id: newItems.length.toString(), name: '' });
                        return { ...prev, items: newItems };
                      })
                    }
                  />
                </div>

                <Style.ChecklistButtons>
                  <Button
                    label="Cancelar"
                    color="danger"
                    borderless
                    onClick={() => setSelectedTemplate(null)}
                  />

                  <Button
                    label="Salvar"
                    bgColor="success"
                    onClick={handleUpdateChecklistTemplate}
                  />
                </Style.ChecklistButtons>
              </Style.ChecklistContainer>
            </>
          )}
        </Style.Content>
      )}
    </Modal>
  );
};
