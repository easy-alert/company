// COMPONENTS
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { icon } from '../../../assets/icons';
import { IconButton } from '../../../components/Buttons/IconButton';
import { ReturnButton } from '../../../components/Buttons/ReturnButton';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { NotificationTable, NotificationTableContent } from './utils/components/NotificationTable';
import { ModalEditBuilding } from './utils/modals/ModalEditBuilding';
import { Image } from '../../../components/Image';
import { PopoverButton } from '../../../components/Buttons/PopoverButton';
import { ModalCreateNotificationConfiguration } from './utils/modals/ModalCreateNotificationConfiguration';
import { ModalEditNotificationConfiguration } from './utils/modals/ModalEditNotificationConfiguration';
import { ModalAddFiles } from './utils/modals/ModalAddFiles';

// FUNCTIONS
import {
  requestBuildingDetails,
  // requestResendEmailConfirmation,
  requestResendPhoneConfirmation,
  // insertMiddleEllipsis,
} from './utils/functions';
import {
  applyMask,
  capitalizeFirstLetter,
  convertToUrlString,
  dateFormatter,
  requestBuldingTypes,
} from '../../../utils/functions';

// STYLES
import * as Style from './styles';
import { theme } from '../../../styles/theme';

// TYPES
import { IBuildingDetail, INotificationConfiguration } from './utils/types';
import { IBuildingTypes } from '../../../utils/types';
import { Button } from '../../../components/Buttons/Button';

export const BuildingDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const buildingId = state as string;

  const phoneConfirmUrl = `${window.location.origin}/confirm/phone`;
  // const emailConfirmUrl = `${window.location.origin}/confirm/email`;

  const [building, setBuilding] = useState<IBuildingDetail>();

  const [buildingTypes, setBuildingTypes] = useState<IBuildingTypes[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [usedMaintenancesCount, setUsedMaintenancesCount] = useState<number>(0);

  const [totalMaintenacesCount, setTotalMaintenacesCount] = useState<number>(0);

  const [modalEditBuildingOpen, setModalEditBuildingOpen] = useState<boolean>(false);

  const [modalCreateNotificationConfigurationOpen, setModalCreateNotificationConfigurationOpen] =
    useState<boolean>(false);

  const [modalEditNotificationConfigurationOpen, setModalEditNotificationConfigurationOpen] =
    useState<boolean>(false);

  const [modalAddFilesOpen, setModalAddFilesOpen] = useState<boolean>(false);

  const [selectedNotificationRow, setSelectedNotificationRow] =
    useState<INotificationConfiguration>();

  useEffect(() => {
    if (!state) {
      navigate('/buildings');
    } else {
      requestBuldingTypes({ setBuildingTypes });
      requestBuildingDetails({
        buildingId,
        setLoading,
        setBuilding,
        setUsedMaintenancesCount,
        setTotalMaintenacesCount,
      });
    }
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalEditBuildingOpen && building && (
        <ModalEditBuilding
          setModal={setModalEditBuildingOpen}
          building={building}
          setBuilding={setBuilding}
          buildingTypes={buildingTypes}
        />
      )}

      {modalCreateNotificationConfigurationOpen && building && (
        <ModalCreateNotificationConfiguration
          setModal={setModalCreateNotificationConfigurationOpen}
          buildingId={building.id}
          setBuilding={setBuilding}
        />
      )}

      {modalEditNotificationConfigurationOpen && selectedNotificationRow && building && (
        <ModalEditNotificationConfiguration
          setModal={setModalEditNotificationConfigurationOpen}
          buildingId={building.id}
          setBuilding={setBuilding}
          selectedNotificationRow={selectedNotificationRow}
        />
      )}

      {modalAddFilesOpen && <ModalAddFiles setModal={setModalAddFilesOpen} />}

      <Style.Header>
        <h2>Detalhes de edificação</h2>
        <ReturnButton path="/buildings" />
      </Style.Header>

      <Style.CardWrapper>
        {/* <Style.Card>
          <Style.CardHeader>
            <h5>Manutenções</h5>
          </Style.CardHeader>
          <Style.MaintenanceCardFooter>
            <Style.MaintenanceCardFooterInfo>
              <h5 className="pending">0</h5>
              <p className="p5">Pendentes</p>
            </Style.MaintenanceCardFooterInfo>
            <Style.MaintenanceCardFooterInfo>
              <h5 className="expired">0</h5>
              <p className="p5">Vencidas</p>
            </Style.MaintenanceCardFooterInfo>

            <Style.MaintenanceCardFooterInfo>
              <h5 className="delayed">0</h5>
              <p className="p5">Feitas em atraso</p>
            </Style.MaintenanceCardFooterInfo>

            <Style.MaintenanceCardFooterInfo>
              <h5 className="completed">0</h5>
              <p className="p5">Concluídas</p>
            </Style.MaintenanceCardFooterInfo>
          </Style.MaintenanceCardFooter>
        </Style.Card> */}

        <Style.Card>
          <Style.CardHeader>
            <h5>Dados da edificação</h5>
            <IconButton
              icon={icon.editWithBg}
              label="Editar"
              hideLabelOnMedia
              onClick={() => {
                setModalEditBuildingOpen(true);
              }}
            />
          </Style.CardHeader>
          <Style.BuildingCardWrapper>
            <Style.BuildingCardColumn>
              <Style.BuildingCardData>
                <p className="p3">Nome:</p>
                <p className="p3">{building?.name}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Tipo:</p>
                <p className="p3">{capitalizeFirstLetter(building?.BuildingType.name!)}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Entrega da edificação:</p>
                <p className="p3">
                  {building?.deliveryDate ? dateFormatter(building?.deliveryDate!) : ''}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Término da garantia:</p>
                <p className="p3">{dateFormatter(building?.warrantyExpiration!)}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Notificar após garantia?</p>
                <p className="p3">{building?.keepNotificationAfterWarrantyEnds ? 'Sim' : 'Não'}</p>
              </Style.BuildingCardData>
            </Style.BuildingCardColumn>

            <Style.BuildingCardColumn>
              <Style.BuildingCardData>
                <p className="p3">CEP:</p>
                <p className="p3">
                  {building?.cep ? applyMask({ mask: 'CEP', value: building?.cep }).value : '-'}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Local:</p>
                <p className="p3">
                  {!building?.city && !building?.state && '-'}
                  {building?.city}
                  {building?.city && building?.state ? `, ${building?.state}` : building?.state}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Bairro:</p>
                <p className="p3">{building?.neighborhood ?? '-'}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Logradouro:</p>
                <p className="p3">{building?.streetName ?? '-'}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Área:</p>
                <p className="p3">
                  {building?.area
                    ? `${applyMask({ mask: 'DEC', value: building?.area }).value} m²`
                    : '-'}
                </p>
              </Style.BuildingCardData>
            </Style.BuildingCardColumn>
          </Style.BuildingCardWrapper>
        </Style.Card>
        <Style.Card>
          <Style.CardHeader>
            <h5>Dados de notificação</h5>
            <IconButton
              icon={icon.plusWithBg}
              label="Cadastrar"
              hideLabelOnMedia
              onClick={() => {
                setModalCreateNotificationConfigurationOpen(true);
              }}
            />
          </Style.CardHeader>
          {building && building.NotificationsConfigurations.length > 0 ? (
            <NotificationTable
              colsHeader={[
                { label: 'Nome do responsável' },
                { label: 'E-mail' },
                { label: 'Função' },
                { label: 'WhatsApp' },
                { label: '' },
              ]}
            >
              {building?.NotificationsConfigurations.map((notificationRow) => (
                <NotificationTableContent
                  key={notificationRow.id}
                  onClick={() => {
                    //
                  }}
                  colsBody={[
                    {
                      cell: notificationRow.name,
                      cssProps: { width: '25%', borderBottomLeftRadius: theme.size.xxsm },
                    },
                    {
                      cell: (
                        <Style.TableDataWrapper>
                          {notificationRow.email ?? '-'}
                          {/* {notificationRow.isMain &&
                            notificationRow.email &&
                            (notificationRow.emailIsConfirmed ? (
                              <Image img={icon.checkedNoBg} size="16px" />
                            ) : (
                              <PopoverButton
                                label="Reenviar"
                                hiddenIconButtonLabel
                                buttonIcon={icon.yellowAlert}
                                buttonIconSize="16px"
                                actionButtonBgColor={theme.color.primary}
                                type="IconButton"
                                message={{
                                  title: 'Deseja reenviar o e-mail de confirmação?',
                                  content: '',
                                  contentColor: theme.color.danger,
                                }}
                                actionButtonClick={() => {
                                  requestResendEmailConfirmation({
                                    buildingNotificationConfigurationId: notificationRow.id,
                                    link: emailConfirmUrl,
                                  });
                                }}
                              />
                            ))} */}
                        </Style.TableDataWrapper>
                      ),
                      cssProps: { width: '25%' },
                    },
                    { cell: notificationRow.role, cssProps: { width: '20%' } },
                    {
                      cell: (
                        <Style.TableDataWrapper>
                          {notificationRow.contactNumber
                            ? applyMask({ mask: 'TEL', value: notificationRow.contactNumber }).value
                            : '-'}

                          {notificationRow.isMain &&
                            notificationRow.contactNumber &&
                            (notificationRow.contactNumberIsConfirmed ? (
                              <Image img={icon.checkedNoBg} size="16px" />
                            ) : (
                              <PopoverButton
                                label="Reenviar"
                                hiddenIconButtonLabel
                                buttonIcon={icon.yellowAlert}
                                buttonIconSize="16px"
                                actionButtonBgColor={theme.color.primary}
                                type="IconButton"
                                message={{
                                  title: 'Deseja reenviar a mensagem de confirmação no WhatsApp?',
                                  content: '',
                                  contentColor: theme.color.danger,
                                }}
                                actionButtonClick={() => {
                                  requestResendPhoneConfirmation({
                                    buildingNotificationConfigurationId: notificationRow.id,
                                    link: phoneConfirmUrl,
                                  });
                                }}
                              />
                            ))}
                        </Style.TableDataWrapper>
                      ),
                      cssProps: { width: '20%' },
                    },
                    {
                      cell: (
                        <Style.ButtonWrapper>
                          {notificationRow.isMain && (
                            <Style.MainContactTag>
                              <p className="p5">Contato principal</p>
                            </Style.MainContactTag>
                          )}
                          <IconButton
                            size="16px"
                            icon={icon.edit}
                            label="Editar"
                            onClick={() => {
                              setSelectedNotificationRow(notificationRow);
                              setModalEditNotificationConfigurationOpen(true);
                            }}
                          />
                        </Style.ButtonWrapper>
                      ),
                      cssProps: { width: '10%', borderBottomRightRadius: theme.size.xxsm },
                    },
                  ]}
                />
              ))}
            </NotificationTable>
          ) : (
            <Style.NoDataContainer>
              <h5>Nenhum dado cadastrado.</h5>
            </Style.NoDataContainer>
          )}
        </Style.Card>
        <Style.Card>
          <Style.CardHeader>
            <h5>
              Manutenções a serem realizadas ({usedMaintenancesCount}/{totalMaintenacesCount})
            </h5>
            <IconButton
              icon={icon.editWithBg}
              label="Editar"
              hideLabelOnMedia
              onClick={() => {
                navigate(
                  `/buildings/details/${convertToUrlString(building!.name)}/maintenances/manage`,
                  {
                    state: buildingId,
                  },
                );
              }}
            />
          </Style.CardHeader>
          <Button
            label="Visualizar"
            onClick={() => {
              navigate(
                `/buildings/details/${convertToUrlString(building!.name)}/maintenances/list`,
                {
                  state: buildingId,
                },
              );
            }}
          />
        </Style.Card>
        {/* <Style.Card>
          <Style.CardHeader>
            <h5>Anexos</h5>
            <IconButton
              icon={icon.plusWithBg}
              label="Cadastrar"
              hideLabelOnMedia
              onClick={() => {
                setModalAddFilesOpen(true);
              }}
            />
          </Style.CardHeader>
          <Style.MatrixTagWrapper>
            <Style.Tag>
              <Image size="16px" img={icon.paperBlack} />
              <p title="arquivo de manutenção de coisas.jpg" className="p3">
                {insertMiddleEllipsis('arquivo de manutenção de coisas.jpg')}
              </p>
              <IconButton
                size="16px"
                icon={icon.xBlack}
                onClick={() => {
                  //
                }}
              />
            </Style.Tag>
          </Style.MatrixTagWrapper>

          <Style.NoDataContainer>
            <h5>Nenhum anexo cadastrado.</h5>
          </Style.NoDataContainer>
        </Style.Card> */}
      </Style.CardWrapper>
    </>
  );
};
