import { Select } from '@components/Inputs/Select';
import { Button } from '@components/Buttons/Button';
import { Input } from '@components/Inputs/Input';
import { CRUDInput } from '@components/Inputs/CRUDInput';

import * as Style from '../styles';

import type { IModalSecondView } from '../types';

const ModalSecondView = ({
  buildingsData,
  categoriesData,
  occasionalMaintenanceData,
  handleSetOccasionalMaintenanceData,
  handleCreateOccasionalMaintenance,
}: IModalSecondView) => {
  const responsibleArray = [
    { id: '1', name: 'Equipe de manutenção local' },
    { id: '2', name: 'Equipe capacitada' },
    { id: '3', name: 'Equipe Especializada' },
  ];

  const handleCreateInProgressMaintenance = () => {
    handleSetOccasionalMaintenanceData({
      primaryKey: 'inProgress',
      value: true,
    });

    handleCreateOccasionalMaintenance();
  };

  return (
    <Style.FormContainer>
      <form>
        <Select
          label="Edificação *"
          value={occasionalMaintenanceData.buildingId}
          selectPlaceholderValue={occasionalMaintenanceData.buildingId}
          onChange={(e) =>
            handleSetOccasionalMaintenanceData({ primaryKey: 'buildingId', value: e.target.value })
          }
        >
          <option value="" disabled>
            Selecione
          </option>

          {buildingsData.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </Select>

        <CRUDInput
          label="Categoria *"
          value={occasionalMaintenanceData.categoryData.name}
          select={{
            createLabel: 'Criar categoria',
            options: categoriesData.map((category) => ({
              value: category.id || '',
              label: category.name || '',
            })),
            getEvtValue: (value) => {
              const selectedCategory = categoriesData.find((category) => category.id === value);

              if (!selectedCategory) return;

              handleSetOccasionalMaintenanceData({
                primaryKey: 'categoryData',
                value: selectedCategory.id || '',
                secondaryKey: 'id',
              });

              handleSetOccasionalMaintenanceData({
                primaryKey: 'categoryData',
                value: selectedCategory.name || '',
                secondaryKey: 'name',
              });
            },
          }}
          input={{
            placeholder: 'Digite o nome da categoria',
            getEvtValue: (value) =>
              handleSetOccasionalMaintenanceData({
                primaryKey: 'categoryData',
                value,
                secondaryKey: 'name',
              }),
            onXClick: () =>
              handleSetOccasionalMaintenanceData({
                primaryKey: 'categoryData',
                value: { id: '', name: '' },
              }),
          }}
        />

        <Input
          label="Elemento *"
          placeholder="Informe o elemento"
          value={occasionalMaintenanceData.element}
          onChange={(e) =>
            handleSetOccasionalMaintenanceData({
              primaryKey: 'element',
              value: e.target.value,
            })
          }
        />

        <Input
          label="Atividade *"
          placeholder="Ex: Troca de lâmpada"
          value={occasionalMaintenanceData.activity}
          onChange={(e) =>
            handleSetOccasionalMaintenanceData({
              primaryKey: 'activity',
              value: e.target.value,
            })
          }
        />

        <Select
          label="Responsável *"
          value={occasionalMaintenanceData.responsible}
          selectPlaceholderValue={occasionalMaintenanceData.responsible}
          onChange={(e) =>
            handleSetOccasionalMaintenanceData({
              primaryKey: 'responsible',
              value: e.target.value,
            })
          }
        >
          <option value="" disabled>
            Selecione
          </option>

          {responsibleArray.map((responsible) => (
            <option key={responsible.id} value={responsible.id}>
              {responsible.name}
            </option>
          ))}
        </Select>

        <Input
          label="Data de execução *"
          type="date"
          value={occasionalMaintenanceData.executionDate}
          typeDatePlaceholderValue={occasionalMaintenanceData.executionDate}
          onChange={(evt) =>
            handleSetOccasionalMaintenanceData({
              primaryKey: 'executionDate',
              value: evt.target.value,
            })
          }
        />

        <Style.ButtonContainer>
          <Button label="Criar" onClick={handleCreateOccasionalMaintenance} />
          <Button label="Criar em progresso" onClick={handleCreateInProgressMaintenance} />
          <Button
            label="Criar finalizada"
            onClick={handleCreateOccasionalMaintenance}
            disable={new Date(occasionalMaintenanceData.executionDate) > new Date()}
          />
        </Style.ButtonContainer>
      </form>
    </Style.FormContainer>
  );
};

export default ModalSecondView;
