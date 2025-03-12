// REACT
import { useState } from 'react';

// SERVICES
import { updateMaintenanceAdditionalInformation } from '@services/apis/updateMaintenanceAdditionalInformation';

// GLOBAL COMPONENTS
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import { IUser } from '@customTypes/IUser';

// COMPONENTS
import IconQrcode from '@assets/icons/IconQrcode';
import { ModalPrintCategoryQRCode } from '../ModalPrintCategoryQRCode';
import { ModalAdditionalInformation } from '../ModalAdditionalInformation';
import { MaintenanceCard } from '../MaintenanceCard';

// STYLES
import * as Style from './styles';

// UTILS
import { alphabeticalOrder, numericalOrder } from './utils/functions';

// TYPES
import type { IMaintenanceCategory, ISortType } from './utils/types';
import type { IHandleModals } from '../../types';

export const MaintenanceCategory = ({
  data,
  usersResponsible,
  handleRefresh,
}: IMaintenanceCategory) => {
  const [selectedMaintenance, setSelectedMaintenance] = useState<{
    buildingId: string;
    maintenanceId: string;
    userResponsible?: IUser;
    additionalInfo: string;
  }>({
    buildingId: data.buildingId,
    maintenanceId: '',
    userResponsible: undefined,
    additionalInfo: '',
  });

  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [sortType, setSortType] = useState<ISortType>({ type: 'element' });

  const [modalPrintCategoryQrCodeOpen, setModalPrintCategoryQrCodeOpen] = useState<boolean>(false);
  const [modalAdditionalInformation, setModalAdditionalInformation] = useState<boolean>(false);

  const handleModals = ({ modal, modalState }: IHandleModals) => {
    switch (modal) {
      case 'printCategoryQrCode':
        setModalPrintCategoryQrCodeOpen(modalState);
        break;
      case 'additionalInformation':
        setModalAdditionalInformation(modalState);
        break;
      default:
        break;
    }
  };

  const handleSelectedMaintenance = ({
    maintenanceId,
    userResponsible,
    additionalInformation,
  }: {
    maintenanceId: string;
    userResponsible?: IUser;
    additionalInformation: string;
  }) => {
    setSelectedMaintenance({
      buildingId: data.buildingId,
      maintenanceId,
      userResponsible: userResponsible || undefined,
      additionalInfo: additionalInformation,
    });
  };

  const handleUpdateAdditionalInformation = async (
    additionalInfo: string,
    userResponsible: IUser,
  ) => {
    await updateMaintenanceAdditionalInformation({
      buildingId: data.buildingId,
      maintenanceId: selectedMaintenance.maintenanceId,
      additionalInfo,
      userResponsibleId: userResponsible.id,
    });

    setModalAdditionalInformation(false);
    handleRefresh();
  };

  return (
    <>
      {modalPrintCategoryQrCodeOpen && (
        <ModalPrintCategoryQRCode
          categoryId={data.Category.id}
          buildingName={data.Building.name}
          buildingNanoId={data.Building.nanoId}
          categoryName={data.Category.name}
          setModal={setModalPrintCategoryQrCodeOpen}
        />
      )}

      {modalAdditionalInformation && (
        <ModalAdditionalInformation
          selectedMaintenance={selectedMaintenance}
          usersResponsible={usersResponsible}
          handleUpdateAdditionalInformation={handleUpdateAdditionalInformation}
          handleModals={handleModals}
        />
      )}

      <Style.Background>
        <Style.HeaderCategory>
          <Style.HeaderTitle>
            <Style.Container>
              <h5>{data.Category.name}</h5>

              <IconButton
                icon={<IconQrcode strokeColor="primary" />}
                fill="primary"
                size="18px"
                onClick={() => {
                  setModalPrintCategoryQrCodeOpen(true);
                }}
              />
            </Style.Container>
          </Style.HeaderTitle>
        </Style.HeaderCategory>

        <Style.MaintenancesContainer>
          {data.Maintenances.length ? (
            <Style.MaintenancesHeader>
              <Style.MaintenancesGrid>
                <Style.SortHeader
                  highlighted={sortType.type === 'element'}
                  onClick={() => {
                    setSortType({ type: 'element' });
                    alphabeticalOrder({
                      category: data.Maintenances,
                      isSorted,
                      setIsSorted,
                      toSortString: 'element',
                      defaultSortedColumn: true,
                    });
                  }}
                >
                  <p className="p2">Elemento</p>
                  <Image
                    img={
                      (isSorted && sortType.type === 'element') || sortType.type !== 'element'
                        ? icon.upTriangle
                        : icon.downTriangle
                    }
                    size="8px"
                  />
                </Style.SortHeader>

                <Style.SortHeader
                  highlighted={sortType.type === 'activity'}
                  onClick={() => {
                    setSortType({ type: 'activity' });
                    alphabeticalOrder({
                      category: data.Maintenances,
                      isSorted,
                      setIsSorted,
                      toSortString: 'activity',
                    });
                  }}
                >
                  <p className="p2">Atividade</p>

                  <Image
                    img={
                      isSorted && sortType.type === 'activity' ? icon.downTriangle : icon.upTriangle
                    }
                    size="8px"
                  />
                </Style.SortHeader>

                <Style.SortHeader
                  highlighted={sortType.type === 'frequency'}
                  onClick={() => {
                    setSortType({ type: 'frequency' });
                    numericalOrder({
                      category: data.Maintenances,
                      isSorted,
                      setIsSorted,
                      toSortString: 'frequency',
                    });
                  }}
                >
                  <p className="p2">Periodicidade</p>

                  <Image
                    img={
                      isSorted && sortType.type === 'frequency'
                        ? icon.downTriangle
                        : icon.upTriangle
                    }
                    size="8px"
                  />
                </Style.SortHeader>

                <Style.SortHeader
                  highlighted={sortType.type === 'responsible'}
                  onClick={() => {
                    setSortType({ type: 'responsible' });
                    alphabeticalOrder({
                      category: data.Maintenances,
                      isSorted,
                      setIsSorted,
                      toSortString: 'responsible',
                    });
                  }}
                >
                  <p className="p2">Responsável</p>

                  <Image
                    img={
                      isSorted && sortType.type === 'responsible'
                        ? icon.downTriangle
                        : icon.upTriangle
                    }
                    size="8px"
                  />
                </Style.SortHeader>

                <Style.SortHeader
                  highlighted={sortType.type === 'source'}
                  onClick={() => {
                    setSortType({ type: 'source' });
                    alphabeticalOrder({
                      category: data.Maintenances,
                      isSorted,
                      setIsSorted,
                      toSortString: 'source',
                    });
                  }}
                >
                  <p className="p2">Fonte</p>
                  <Image
                    img={
                      isSorted && sortType.type === 'source' ? icon.downTriangle : icon.upTriangle
                    }
                    size="8px"
                  />
                </Style.SortHeader>
              </Style.MaintenancesGrid>
            </Style.MaintenancesHeader>
          ) : (
            <p className="p2" style={{ opacity: 0.7 }}>
              Nenhuma manutenção cadastrada.
            </p>
          )}

          {data.Maintenances.map((maintenance) => (
            <MaintenanceCard
              key={maintenance.Maintenance.id}
              maintenance={maintenance}
              handleSelectedMaintenance={handleSelectedMaintenance}
              handleModals={handleModals}
            />
          ))}
        </Style.MaintenancesContainer>
      </Style.Background>
    </>
  );
};
