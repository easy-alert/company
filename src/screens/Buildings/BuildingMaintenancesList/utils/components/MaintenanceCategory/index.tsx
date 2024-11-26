/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */

// LIBS
import { useState } from 'react';
import { icon } from '../../../../../../assets/icons';

// COMPONENTS
import * as Style from './styles';
import { Image } from '../../../../../../components/Image';
import { MaintenanceCard } from '../MaintenanceCard';

// FUNCTIONS
import { alphabeticalOrder, numericalOrder } from './utils/functions';

// TYPES
import { IMaintenanceCategory, ISortType } from './utils/types';
import { ModalPrintCategoryQRCode } from '../ModalPrintCategoryQRCode';
import { IconButton } from '../../../../../../components/Buttons/IconButton';

export const MaintenanceCategory = ({ data }: IMaintenanceCategory) => {
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [sortType, setSortType] = useState<ISortType>({ type: 'element' });
  const [modalPrintCategoryQrCodeOpen, setModalPrintCategoryQrCodeOpen] = useState<boolean>(false);

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

      <Style.Background>
        <Style.HeaderCategory>
          <Style.HeaderTitle>
            <Style.Container>
              <h5>{data.Category.name}</h5>
              <IconButton
                icon={icon.qrcode}
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
            <MaintenanceCard maintenance={maintenance} key={maintenance.Maintenance.id} />
          ))}
        </Style.MaintenancesContainer>
      </Style.Background>
    </>
  );
};
