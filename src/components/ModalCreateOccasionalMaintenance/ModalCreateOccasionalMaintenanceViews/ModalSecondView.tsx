// LIBS
import { endOfDay, format, isAfter } from 'date-fns';

// GLOBAL COMPONENTS
import { Select } from '@components/Inputs/Select';
import { Button } from '@components/Buttons/Button';
import { Input } from '@components/Inputs/Input';
import { CRUDInput } from '@components/Inputs/CRUDInput';

// STYLES
import * as Style from '../styles';

// TYPES
import type { IModalSecondView } from '../types';

const ModalSecondView = ({
  buildingsData,
  categoriesData,
  occasionalMaintenanceData,
  handleSetView,
  handleOccasionalMaintenanceDataChange,
  handleCreateOccasionalMaintenance,
}: IModalSecondView) => {
  const responsibleArray = [
    { id: '1', name: 'Equipe de manutenção local' },
    { id: '2', name: 'Equipe capacitada' },
    { id: '3', name: 'Equipe Especializada' },
  ];

  const today = format(endOfDay(new Date()), 'yyyy-MM-dd');
  const isAfterToday = isAfter(occasionalMaintenanceData.executionDate, today);

  const disableFinishedButton = isAfterToday;

  return (
    <Style.FormContainer>
      <Select
        label="Edificação *"
        value={occasionalMaintenanceData.buildingId}
        selectPlaceholderValue={occasionalMaintenanceData.buildingId}
        onChange={(e) =>
          handleOccasionalMaintenanceDataChange({ primaryKey: 'buildingId', value: e.target.value })
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

            handleOccasionalMaintenanceDataChange({
              primaryKey: 'categoryData',
              value: selectedCategory.id || '',
              secondaryKey: 'id',
            });

            handleOccasionalMaintenanceDataChange({
              primaryKey: 'categoryData',
              value: selectedCategory.name || '',
              secondaryKey: 'name',
            });
          },
        }}
        input={{
          placeholder: 'Digite o nome da categoria',
          getEvtValue: (value) =>
            handleOccasionalMaintenanceDataChange({
              primaryKey: 'categoryData',
              value,
              secondaryKey: 'name',
            }),
          onXClick: () =>
            handleOccasionalMaintenanceDataChange({
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
          handleOccasionalMaintenanceDataChange({
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
          handleOccasionalMaintenanceDataChange({
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
          handleOccasionalMaintenanceDataChange({
            primaryKey: 'responsible',
            value: e.target.value,
          })
        }
      >
        <option value="" disabled>
          Selecione
        </option>

        {responsibleArray.map((responsible) => (
          <option key={responsible.id} value={responsible.name}>
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
          handleOccasionalMaintenanceDataChange({
            primaryKey: 'executionDate',
            value: evt.target.value,
          })
        }
      />

      <Style.ButtonContainer>
        <Button
          label="Criar"
          onClick={() =>
            handleCreateOccasionalMaintenance({ occasionalMaintenanceType: 'pending' })
          }
        />
        <Button
          label="Criar em progresso"
          onClick={() => {
            handleCreateOccasionalMaintenance({
              occasionalMaintenanceType: 'pending',
              inProgress: true,
            });
          }}
        />
        <Button
          label="Criar finalizada"
          onClick={() => handleSetView(3)}
          disable={disableFinishedButton}
        />
      </Style.ButtonContainer>
    </Style.FormContainer>
  );
};

export default ModalSecondView;
