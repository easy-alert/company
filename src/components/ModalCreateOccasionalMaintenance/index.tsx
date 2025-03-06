// REACT
import { useEffect, useState } from 'react';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// SERVICES
import { getBuildingsAndCategories } from '@services/apis/getBuildingsAndCategories';
import { createOccasionalMaintenance } from '@services/apis/createOccasionalMaintenance';
import { getPriority } from '@services/apis/getPriority';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { IBuilding } from '@customTypes/IBuilding';
import type { ICategory } from '@customTypes/ICategory';
import type { IPriority } from '@customTypes/IPriority';

// COMPONENTS
import ModalLoading from './ModalCreateOccasionalMaintenanceViews/ModalLoading';
import ModalSecondView from './ModalCreateOccasionalMaintenanceViews/ModalSecondView';
import ModalThirdView from './ModalCreateOccasionalMaintenanceViews/ModalThirdView';

// TYPES
import type {
  IOccasionalMaintenanceData,
  IModalCreateOccasionalMaintenance,
  IHandleSetOccasionalMaintenanceData,
  IHandleCreateOccasionalMaintenance,
} from './types';

export const ModalCreateOccasionalMaintenance = ({
  buildingsForSelect,
  externalBuildingId,
  checklistActivity,
  ticketsIds,
  ticketsToAnswer,
  handleGetBackgroundData,
  handleMaintenanceHistoryIdChange,
  handleResetTickets,
  handleModalCreateOccasionalMaintenance,
  handleModalMaintenanceDetails,
  handleModalSendMaintenanceReport,
}: IModalCreateOccasionalMaintenance) => {
  const { account } = useAuthContext();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFields = (occasionalMaintenanceData: IOccasionalMaintenanceData) => {
    const newErrors: Record<string, string> = {};

    if (!occasionalMaintenanceData.buildingId) {
      newErrors.buildingId = 'A edificação deve ser preenchida.';
    }
    if (!occasionalMaintenanceData.categoryData.name) {
      newErrors.category = 'A categoria deve ser preenchida.';
    }
    if (!occasionalMaintenanceData.element) {
      newErrors.element = 'O elemento deve ser preenchido.';
    }
    if (!occasionalMaintenanceData.activity) {
      newErrors.activity = 'A atividade deve ser preenchida.';
    }
    if (!occasionalMaintenanceData.responsible) {
      newErrors.responsible = 'O responsável deve ser preenchido.';
    }
    if (!occasionalMaintenanceData.priorityName) {
      newErrors.priority = 'A prioridade deve ser preenchida.';
    }
    if (!occasionalMaintenanceData.executionDate) {
      newErrors.executionDate = 'A data de execução deve ser preenchida.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const [occasionalMaintenanceData, setOccasionalMaintenanceData] =
    useState<IOccasionalMaintenanceData>({
      buildingId: externalBuildingId || '',

      element: '',
      activity: checklistActivity || '',
      responsible: '',
      executionDate: '',
      inProgress: false,
      priorityName: '',

      categoryData: {
        id: '',
        name: '',
      },

      reportData: {
        cost: 'R$ 0,00',
        observation: '',
        files: [],
        images: [],
      },
    });

  const [buildingsData, setBuildingsData] = useState<IBuilding[]>([]);
  const [categoriesData, setCategoriesData] = useState<ICategory[]>([]);
  const [priorityData, setPriorityData] = useState<IPriority[]>([]);

  const [view, setView] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSetView = (viewSate: number) => {
    setView(viewSate);
  };

  const handleOccasionalMaintenanceDataChange = ({
    primaryKey,
    value,
    secondaryKey,
  }: IHandleSetOccasionalMaintenanceData) => {
    if (secondaryKey) {
      setOccasionalMaintenanceData((prevState) => {
        const primaryData =
          typeof prevState[primaryKey] === 'object' && prevState[primaryKey] !== null
            ? prevState[primaryKey]
            : {};

        return {
          ...prevState,
          [primaryKey]: {
            ...primaryData,
            [secondaryKey]: value,
          },
        };
      });

      return;
    }

    setOccasionalMaintenanceData((prevState) => ({
      ...prevState,
      [primaryKey]: value,
    }));
  };

  const handleGetBuildingsAndCategories = async () => {
    setLoading(true);

    const { buildings, categories } = await getBuildingsAndCategories();

    setBuildingsData(buildings);
    setCategoriesData(categories);
    setLoading(false);
  };

  const handleCreateOccasionalMaintenance = async ({
    occasionalMaintenanceType,
    inProgress = false,
  }: IHandleCreateOccasionalMaintenance) => {
    if (!validateFields(occasionalMaintenanceData)) {
      return;
    }

    setLoading(true);

    const reportDataBody =
      occasionalMaintenanceType === 'finished'
        ? occasionalMaintenanceData.reportData
        : {
            cost: 'R$ 0,00',
            observation: '',
            files: [],
            images: [],
          };

    const occasionalMaintenanceBody = {
      ...occasionalMaintenanceData,
      reportData: reportDataBody,
      inProgress,
    };

    const response = await createOccasionalMaintenance({
      origin: account?.origin || 'Company',
      occasionalMaintenanceType,
      occasionalMaintenanceBody,
      ticketsIds,
    });

    if (response?.maintenance?.id) {
      if (handleMaintenanceHistoryIdChange) {
        handleMaintenanceHistoryIdChange(response.maintenance.id);
      }

      if (handleResetTickets) {
        handleResetTickets();
      }

      if (handleGetBackgroundData) {
        await handleGetBackgroundData();
      }

      setTimeout(() => {
        if (occasionalMaintenanceType === 'finished' && handleModalMaintenanceDetails) {
          handleModalMaintenanceDetails(true);
        } else if (occasionalMaintenanceType === 'pending' && handleModalSendMaintenanceReport) {
          handleModalSendMaintenanceReport(true);
        }

        handleModalCreateOccasionalMaintenance(false);
        setLoading(false);
      }, 1000);

      return;
    }

    setLoading(false);
  };

  const handleGetPriorityNames = async () => {
    try {
      const responseData = await getPriority();
      setPriorityData(responseData);
    } catch (error: any) {
      handleToastify(error.response.data.ServerMessage);
    }
  };

  useEffect(() => {
    handleGetPriorityNames();
    handleGetBuildingsAndCategories();
  }, []);

  if (!handleModalCreateOccasionalMaintenance) return null;

  return (
    <Modal title="Manutenção avulsa" setModal={handleModalCreateOccasionalMaintenance}>
      {loading ? (
        <ModalLoading />
      ) : (
        <>
          {view === 2 && (
            <ModalSecondView
              buildingsForSelect={buildingsForSelect}
              categoriesData={categoriesData}
              priorityData={priorityData}
              checklistActivity={checklistActivity}
              externalBuildingId={externalBuildingId}
              occasionalMaintenanceData={occasionalMaintenanceData}
              errors={errors}
              handleSetView={handleSetView}
              handleOccasionalMaintenanceDataChange={handleOccasionalMaintenanceDataChange}
              handleCreateOccasionalMaintenance={handleCreateOccasionalMaintenance}
            />
          )}

          {view === 3 && (
            <ModalThirdView
              occasionalMaintenanceData={occasionalMaintenanceData}
              handleOccasionalMaintenanceDataChange={handleOccasionalMaintenanceDataChange}
              handleSetView={handleSetView}
              handleCreateOccasionalMaintenance={handleCreateOccasionalMaintenance}
            />
          )}
        </>
      )}
    </Modal>
  );
};
