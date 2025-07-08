// REACT
import { useEffect, useState } from 'react';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';
import { useUsersForSelect } from '@hooks/useUsersForSelect';

// SERVICES
import { getBuildingsAndCategories } from '@services/apis/getBuildingsAndCategories';
import { createOccasionalMaintenance } from '@services/apis/createOccasionalMaintenance';
import { getPriority } from '@services/apis/getPriority';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';
import { normalizeString } from '@utils/normalizeString';
import { convertToFormikDate } from '@utils/functions';

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

  const [occasionalMaintenanceData, setOccasionalMaintenanceData] =
    useState<IOccasionalMaintenanceData>({
      buildingId: externalBuildingId || '',

      element: '',
      activity: checklistActivity || '',
      responsible: 'Equipe de manutenção local',
      executionDate: convertToFormikDate(new Date()),
      inProgress: false,
      priorityName: 'medium',

      usersId: [],

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

  const { usersForSelect } = useUsersForSelect({
    buildingId: occasionalMaintenanceData.buildingId,
  });

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

    const { categories } = await getBuildingsAndCategories();

    setCategoriesData(categories);
    setLoading(false);
  };

  const handleCreateOccasionalMaintenance = async ({
    occasionalMaintenanceType,
    inProgress = false,
  }: IHandleCreateOccasionalMaintenance) => {
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

  useEffect(() => {
    if (externalBuildingId) {
      setOccasionalMaintenanceData((prevState) => ({
        ...prevState,
        buildingId: externalBuildingId,
      }));
    }
  }, [externalBuildingId]);

  useEffect(() => {
    if (occasionalMaintenanceData.buildingId && usersForSelect.length > 0) {
      const userInBuilding = usersForSelect.some((user) => user.id === account.User.id);

      if (userInBuilding) {
        setOccasionalMaintenanceData((prevState) => ({
          ...prevState,
          usersId: [account.User.id],
        }));
      } else {
        setOccasionalMaintenanceData((prevState) => ({
          ...prevState,
          usersId: [],
        }));
      }
    }
  }, [occasionalMaintenanceData.buildingId, usersForSelect, account.User.id]);

  useEffect(() => {
    if (!occasionalMaintenanceData.buildingId) return;

    const selectedBuildingName = buildingsForSelect.find(
      (building: IBuilding) => building.id === occasionalMaintenanceData.buildingId,
    )?.name;
    if (!selectedBuildingName) return;


    const buildingWords = normalizeString(selectedBuildingName).split(/\s+/).filter(Boolean);

    let bestCategory: ICategory | null = null;
    let bestScore = 0;

    categoriesData.forEach((category) => {
      if (!category.name) return;

      const normalizedCategory = normalizeString(category.name);
      const categoryWords = normalizedCategory.split(/\s+/).filter(Boolean);
      const score = buildingWords.reduce(
        (acc, word) => acc + (categoryWords.includes(word) ? 1 : 0),
        0,
      );

      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    });

    if (bestCategory && bestScore > 0) {
      setOccasionalMaintenanceData((prevState) => ({
        ...prevState,
        categoryData: {
          id: (bestCategory as ICategory).id || '',
          name: (bestCategory as ICategory).name || '',
        },
      }));
    } else {
      setOccasionalMaintenanceData((prevState) => ({
        ...prevState,
        categoryData: {
          id: '',
          name: '',
        },
      }));
    }
  }, [buildingsForSelect, categoriesData, occasionalMaintenanceData.buildingId]);

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
              usersForSelect={usersForSelect}
              categoriesData={categoriesData}
              priorityData={priorityData}
              checklistActivity={checklistActivity}
              externalBuildingId={externalBuildingId}
              occasionalMaintenanceData={occasionalMaintenanceData}
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
