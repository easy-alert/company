// REACT
import { useEffect, useState } from 'react';

// HOOKS
import { useUsersForSelect } from '@hooks/useUsersForSelect';

// SERVICES
import { getChecklistsTemplates } from '@services/apis/getChecklistsTemplates';
import { createChecklist } from '@services/apis/createChecklist';
import { createChecklistTemplate } from '@services/apis/createChecklistTemplate';

// GLOBAL COMPONENTES
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { Input } from '@components/Inputs/Input';
import { Select } from '@components/Inputs/Select';
import { LoadingWrapper } from '@components/Loadings/LoadingWrapper';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { InputRadio } from '@components/Inputs/InputRadio';

// GLOBAL UTILS
import { handleToastifyMessage } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { IChecklistTemplate } from '@customTypes/IChecklistTemplate';
import type { TChecklistStatus } from '@customTypes/IChecklist';
import type { IBuilding } from '@customTypes/IBuilding';

// COMPONENTS
import { NewChecklist } from './NewChecklist';
import { ModelTemplate } from './ModelTemplate';

// STYLES
import * as Style from './styles';

import type { TModalNames } from '..';

interface IModalChecklistCreate {
  buildingId?: string;
  buildingsForSelect?: IBuilding[];
  handleModals: (modal: TModalNames, modalState: boolean) => void;
  handleRefresh: () => void;
}

export const ModalChecklistCreate = ({
  buildingId,
  buildingsForSelect,
  handleModals,
  handleRefresh,
}: IModalChecklistCreate) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildingId || '');
  const { usersForSelect } = useUsersForSelect({
    buildingId: selectedBuildingId,
    checkPerms: true,
  });

  const [checklistTemplates, setChecklistTemplates] = useState<IChecklistTemplate[]>([]);

  const [newChecklist, setNewChecklist] = useState<IChecklistTemplate>({
    name: 'Insira o título',
    items: [
      {
        name: 'Insira o item',
      },
    ],
  });
  const [selectedChecklistTemplate, setSelectedChecklistTemplate] = useState<IChecklistTemplate>(
    {},
  );

  const [selectedResponsible, setSelectedResponsible] = useState('');
  const [selectedInterval, setSelectedInterval] = useState('0');
  const [startDate, setStartDate] = useState('');

  const [checklistMode, setChecklistMode] = useState<'new' | 'template'>('new');

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const disableCreateButton =
    checklistMode === 'template'
      ? !selectedChecklistTemplate.id || !selectedResponsible || !selectedInterval || !startDate
      : !newChecklist.name ||
        !newChecklist.items ||
        !selectedResponsible ||
        !selectedInterval ||
        !startDate;

  const handleChecklistMode = (mode: 'new' | 'template') => {
    setSelectedResponsible('');
    setStartDate('');

    if (mode === 'template') {
      setSelectedChecklistTemplate({});
      setSelectedInterval('1');
    } else {
      setSelectedInterval('0');
    }

    setChecklistMode(mode);
  };

  const handleNewChecklistTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChecklist({ ...newChecklist, name: e.target.value });
  };

  const handleNewChecklistItemChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newItems = newChecklist.items || [];

    newItems[index] = { id: index.toString(), name: e.target.value };

    setNewChecklist({ ...newChecklist, items: newItems });
  };

  const handleNewChecklistItemDelete = (index: number) => {
    const newItems = newChecklist.items || [];

    newItems.splice(index, 1);

    setNewChecklist({ ...newChecklist, items: newItems });
  };

  const handleResponsibleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedResponsible(e.target.value);
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInterval(e.target.value);
  };

  // #region api calls
  const handleCreateChecklistTemplate = async (checklistTemplate: IChecklistTemplate) => {
    setLoading(true);

    try {
      newChecklist.items = newChecklist.items?.filter((item) => item.name);

      await createChecklistTemplate({
        buildingId: selectedBuildingId,
        name: checklistTemplate.name!,
        items: checklistTemplate.items!,
      });
    } finally {
      setRefresh(!refresh);
      setLoading(false);
      handleChecklistMode('template');
    }
  };

  const handleCreateChecklist = async (status: TChecklistStatus) => {
    setLoading(true);

    if (disableCreateButton) {
      handleToastifyMessage({ type: 'error', message: 'Preencha todos os campos obrigatórios.' });
      setLoading(false);
      return;
    }

    if (checklistMode === 'new' && !newChecklist.items?.length) {
      handleToastifyMessage({ type: 'error', message: 'Adicione ao menos um item ao checklist.' });
      setLoading(false);
      return;
    }

    try {
      newChecklist.items = newChecklist.items?.filter((item) => item.name);

      await createChecklist({
        buildingId: selectedBuildingId,
        checklistTemplateId: selectedChecklistTemplate.id,
        newChecklist,
        responsibleId: selectedResponsible,
        startDate,
        interval: selectedInterval,
        status,
      });
    } finally {
      setLoading(false);
      handleRefresh();
      handleModals('modalChecklistCreate', false);
    }
  };
  // #endregion

  useEffect(() => {
    const handleGetChecklistsTemplate = async () => {
      setLoading(true);

      try {
        const responseData = await getChecklistsTemplates({ buildingId: '' });
        setChecklistTemplates(responseData);
      } finally {
        setLoading(false);
      }
    };

    if (selectedBuildingId) {
      handleGetChecklistsTemplate();
    }
  }, [refresh, selectedBuildingId]);

  return (
    <Modal title="Checklist" setModal={(state) => handleModals('modalChecklistCreate', state)}>
      {loading ? (
        <LoadingWrapper minHeight="300px">
          <DotSpinLoading />
        </LoadingWrapper>
      ) : (
        <Style.Content>
          {!buildingId && buildingsForSelect && (
            <Select
              label="Prédio *"
              selectPlaceholderValue={' '}
              value={buildingsForSelect.find((b) => b.id === selectedBuildingId)?.id || ''}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
            >
              <option value="" disabled>
                Selecione o prédio
              </option>

              {buildingsForSelect?.map((building) => (
                <option value={building.id} key={building.id}>
                  {building.name}
                </option>
              ))}
            </Select>
          )}

          {selectedBuildingId && (
            <>
              <Style.ChecklistButtons>
                <InputRadio
                  id="newChecklist"
                  label="Avulso"
                  checked={checklistMode === 'new'}
                  onChange={() => handleChecklistMode('new')}
                />

                <InputRadio
                  id="useTemplate"
                  label="Usar template"
                  checked={checklistMode === 'template'}
                  onChange={() => handleChecklistMode('template')}
                />
              </Style.ChecklistButtons>

              {checklistMode === 'new' && (
                <>
                  <NewChecklist
                    newChecklist={newChecklist}
                    handleNewChecklistTitleChange={handleNewChecklistTitleChange}
                    handleNewChecklistItemChange={handleNewChecklistItemChange}
                    handleNewChecklistItemDelete={handleNewChecklistItemDelete}
                    handleCreateChecklistTemplate={handleCreateChecklistTemplate}
                  />

                  <Select
                    arrowColor="primary"
                    label="Usuário responsável *"
                    value={selectedResponsible}
                    onChange={handleResponsibleChange}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>

                    {usersForSelect.map((user) => (
                      <option value={user.id} key={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Data de início *"
                    type="date"
                    value={startDate}
                    typeDatePlaceholderValue={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </>
              )}

              {checklistMode === 'template' && (
                <>
                  <ModelTemplate
                    checklistTemplates={checklistTemplates}
                    selectedChecklistTemplate={selectedChecklistTemplate}
                    handleSelectChecklistTemplate={(template) =>
                      setSelectedChecklistTemplate(template)
                    }
                  />

                  {selectedChecklistTemplate.id && (
                    <>
                      <Select
                        arrowColor="primary"
                        label="Usuário responsável *"
                        value={selectedResponsible}
                        onChange={handleResponsibleChange}
                      >
                        <option value="" disabled>
                          Selecione
                        </option>

                        {usersForSelect.map((user) => (
                          <option value={user.id} key={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </Select>

                      <Select
                        arrowColor="primary"
                        label="Periodicidade *"
                        value={selectedInterval}
                        onChange={handleIntervalChange}
                      >
                        <option value="" disabled>
                          Selecione
                        </option>

                        <option value="1">Diário</option>
                        <option value="2">A cada 2 dias</option>
                        <option value="3">A cada 3 dias</option>
                        <option value="7">Semanal</option>
                        <option value="15">Quinzenal</option>
                        <option value="30">Mensal</option>
                        <option value="60">Bimestral</option>
                        <option value="90">Trimestral</option>
                        <option value="180">Semestral</option>
                        <option value="365">Anual</option>
                      </Select>

                      <Input
                        label="Data de início *"
                        type="date"
                        value={startDate}
                        typeDatePlaceholderValue={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </>
                  )}
                </>
              )}

              <Style.ButtonContainer>
                <Button
                  label="Iniciar execução"
                  textColor="actionBlue"
                  borderless
                  disable={disableCreateButton}
                  onClick={() => handleCreateChecklist('inProgress')}
                />

                <Button
                  bgColor="primary"
                  label="Criar"
                  disable={disableCreateButton}
                  onClick={() => handleCreateChecklist('pending')}
                />
              </Style.ButtonContainer>
            </>
          )}
        </Style.Content>
      )}
    </Modal>
  );
};
