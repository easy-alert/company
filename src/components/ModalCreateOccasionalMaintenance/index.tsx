// REACT
import { useEffect, useState } from 'react';

// LIBS
import { useDropzone } from 'react-dropzone';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// SERVICES
import { getBuildingsAndCategories } from '@services/apis/getBuildingsAndCategories';
import { createOccasionalMaintenance } from '@services/apis/createOccasionalMaintenance';

// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';

// GLOBAL UTILS
import { uploadManyFiles } from '@utils/functions';

// GLOBAL TYPES
import type { IBuilding } from '@customTypes/IBuilding';
import type { ICategory } from '@customTypes/ICategory';

// COMPONENTS
import ModalLoading from './ModalCreateOccasionalMaintenanceViews/ModalLoading';
import ModalFirstView from './ModalCreateOccasionalMaintenanceViews/ModalFirstView';
import ModalSecondView from './ModalCreateOccasionalMaintenanceViews/ModalSecondView';

// TYPES
import type {
  IOccasionalMaintenanceData,
  IModalCreateOccasionalMaintenance,
  IHandleSetOccasionalMaintenanceData,
} from './types';

export const ModalCreateOccasionalMaintenance = ({
  handleModalCreateOccasionalMaintenance,
  handleGetCalendarData,
  checklistTitle,
  checklistBuildingId,
}: IModalCreateOccasionalMaintenance) => {
  const { account } = useAuthContext();

  const [occasionalMaintenanceData, setOccasionalMaintenanceData] =
    useState<IOccasionalMaintenanceData>({
      buildingId: checklistBuildingId || '',

      element: '',
      activity: checklistTitle || '',
      responsible: '',
      executionDate: '',
      inProgress: false,

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

  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onFileQuery, setOnFileQuery] = useState<boolean>(false);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);

  const [view, setView] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
  //   disabled: onFileQuery || data.inProgress,
  // });

  // MODAL CRIAR MANUTENÇÃO AVULSA

  // const {
  //   acceptedFiles: acceptedImages,
  //   getRootProps: getRootPropsImages,
  //   getInputProps: getInputPropsImages,
  // } = useDropzone({
  //   accept: {
  //     'image/png': ['.png'],
  //     'image/jpg': ['.jpg'],
  //     'image/jpeg': ['.jpeg'],
  //     'audio/flac': ['.flac'], // Colocado isso pro celular abrir as opções de camera corretamente.
  //   },
  //   disabled: onImageQuery || data.inProgress,
  // });

  const handleSetView = (viewSate: number) => {
    setView(viewSate);
  };

  const handleSetOccasionalMaintenanceData = ({
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

  const handleCreateOccasionalMaintenance = async () => {
    setLoading(true);

    const response = await createOccasionalMaintenance({
      occasionalMaintenanceData,
      origin: account?.origin || 'Company',
    });

    if (response?.ServerMessage.statusCode === 200) {
      handleGetCalendarData();
      handleModalCreateOccasionalMaintenance(false);
      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetBuildingsAndCategories();
  }, []);

  // useEffect(() => {
  //   if (acceptedFiles.length > 0) {
  //     const uploadAcceptedFiles = async () => {
  //       setOnFileQuery(true);

  //       const uploadedFiles = await uploadManyFiles(acceptedFiles);

  //       const formattedFiles = uploadedFiles.map((file) => ({
  //         name: file.originalname,
  //         originalName: file.originalname,
  //         url: file.Location,
  //       }));

  //       setData((prevState) => ({
  //         ...prevState,
  //         reportData: {
  //           ...prevState.reportData,
  //           files: [...prevState.reportData.files, ...formattedFiles],
  //         },
  //       }));
  //       setOnFileQuery(false);
  //     };

  //     uploadAcceptedFiles();
  //   }

  // }, [acceptedFiles]);

  // useEffect(() => {
  //   if (acceptedImages.length > 0) {
  //     const uploadAcceptedImages = async () => {
  //       setOnImageQuery(true);

  //       const uploadedImages = await uploadManyFiles(acceptedImages);

  //       const formattedImages = uploadedImages.map((file) => ({
  //         name: file.originalname,
  //         originalName: file.originalname,
  //         url: file.Location,
  //       }));

  //       setData((prevState) => ({
  //         ...prevState,
  //         reportData: {
  //           ...prevState.reportData,
  //           images: [...prevState.reportData.images, ...formattedImages],
  //         },
  //       }));

  //       setOnImageQuery(false);
  //     };

  //     uploadAcceptedImages();
  //   }
  // }, [acceptedImages]);

  return (
    <Modal title="Manutenção avulsa" setModal={handleModalCreateOccasionalMaintenance}>
      {loading ? (
        <ModalLoading />
      ) : (
        <>
          {view === 1 && <ModalFirstView handleSetView={handleSetView} />}

          {view === 2 && (
            <ModalSecondView
              buildingsData={buildingsData}
              categoriesData={categoriesData}
              occasionalMaintenanceData={occasionalMaintenanceData}
              handleSetOccasionalMaintenanceData={handleSetOccasionalMaintenanceData}
              handleCreateOccasionalMaintenance={handleCreateOccasionalMaintenance}
            />
          )}
        </>
      )}
    </Modal>
  );
};
