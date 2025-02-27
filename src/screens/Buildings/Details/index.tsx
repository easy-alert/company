// #region imports
// REACT
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// SERVICES
import { putBuildingsApartments } from '@services/apis/putBuildingsApartments';

// GLOBAL COMPONENTS
import TableCell from '@components/TableCell';
import { IconButton } from '@components/Buttons/IconButton';
import { ReturnButton } from '@components/Buttons/ReturnButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import { ImagePreview } from '@components/ImagePreview';
import { Image } from '@components/Image';
import { Button } from '@components/Buttons/Button';
import { InputCheckbox } from '@components/Inputs/InputCheckbox';
import { FileComponent, FolderComponent } from '@components/FileSystem';

// GLOBAL UTILS
import {
  applyMask,
  capitalizeFirstLetter,
  dateFormatter,
  requestBuildingTypes,
} from '@utils/functions';
import { handleToastify, handleToastifyMessage } from '@utils/toastifyResponses';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL TYPES
import type { IBuildingTypes } from '@utils/types';

// COMPONENTS
import { sendPhoneConfirmation } from '@services/apis/sendPhoneConfirmation';
import { sendEmailConfirmation } from '@services/apis/sendEmailConfirmation';
import { NotificationTable, NotificationTableContent } from './utils/components/NotificationTable';
import { ModalEditBuilding } from './utils/modals/ModalEditBuilding';
import { ModalCreateNotificationConfiguration } from './utils/modals/ModalCreateNotificationConfiguration';
import { ModalAddFiles } from './utils/modals/ModalAddFiles';
import { ModalPrintQRCode } from './utils/modals/ModalPrintQRCode';
import { ModalCreateFolder } from './utils/modals/ModalCreateFolder';
import { ModalEditFolder } from './utils/modals/ModalEditFolder';
import { ModalEditFile } from './utils/modals/ModalEditFile';
import { ModalChangeClientPassword } from './utils/modals/ModalChangeClientPassword';
import { ModalAddBanner } from './utils/modals/ModalAddBanner';
import { ModalUpdateBanner } from './utils/modals/ModalUpdateBanner';
import { ModalCreateApartments } from './utils/modals/ModalCreateApartments';

// UTILS
import {
  changeShowContactStatus,
  deleteBanner,
  requestBuildingDetails,
  requestDeleteFile,
  requestDeleteFolder,
  requestFolderDetails,
} from './utils/functions';

// STYLES
import * as Style from './styles';

// TYPES
import type {
  Folder,
  IBuildingDetail,
  File,
  IBanner,
  UserBuildingsPermissions,
} from './utils/types';

// #endregion

export const BuildingDetails = () => {
  // #region states
  const { account } = useAuthContext();

  const navigate = useNavigate();
  const { buildingId } = useParams();

  const { search } = window.location;

  const [building, setBuilding] = useState<IBuildingDetail>();

  const [apartmentNumber, setApartmentNumber] = useState<string>('');
  const [buildingTypes, setBuildingTypes] = useState<IBuildingTypes[]>([]);

  const [showIsMainContactLoading, setShowIsMainContactLoading] = useState<boolean>(false);
  const [showContactLoading, setShowContactLoading] = useState<boolean>(false);

  const [usedMaintenancesCount, setUsedMaintenancesCount] = useState<number>(0);

  const [totalMaintenancesCount, setTotalMaintenancesCount] = useState<number>(0);

  const [passwordType, setPasswordType] = useState<'resident' | 'responsible'>('resident');
  const [selectedBanner, setSelectedBanner] = useState<IBanner>();

  const [modalAddFilesOpen, setModalAddFilesOpen] = useState<boolean>(false);
  const [modalAddBannerOpen, setModalAddBannerOpen] = useState<boolean>(false);
  const [modalUpdateBannerOpen, setModalUpdateBannerOpen] = useState<boolean>(false);
  const [modalCreateFolderOpen, setModalCreateFolderOpen] = useState<boolean>(false);
  const [modalEditFolderOpen, setModalEditFolderOpen] = useState<boolean>(false);
  const [modalEditFileOpen, setModalEditFileOpen] = useState<boolean>(false);
  const [modalPrintQRCodeOpen, setModalPrintQRCodeOpen] = useState<boolean>(false);
  const [modalCreateApartmentOpen, setModalCreateApartmentOpen] = useState<boolean>(false);
  const [modalEditBuildingOpen, setModalEditBuildingOpen] = useState<boolean>(false);
  const [modalCreateNotificationConfigurationOpen, setModalCreateNotificationConfigurationOpen] =
    useState<boolean>(false);
  const [modalChangeClientPasswordOpen, setModalChangeClientPasswordOpen] =
    useState<boolean>(false);

  const [folderId, setFolderId] = useState<string | null>(null);
  const [rootFolder, setRootFolder] = useState<Folder>({ id: '', name: '' });
  const [folderToEdit, setFolderToEdit] = useState<Folder>();
  const [fileToEdit, setFileToEdit] = useState<File>();

  const [breadcrumb, setBreadcrumb] = useState<Folder[]>([{ id: '', name: 'Início' }]);

  const [loading, setLoading] = useState<boolean>(true);
  const [onQuery, setOnQuery] = useState<boolean>(false);
  // #endregion

  const phoneConfirmUrl = `${window.location.origin}/confirm/phone`;
  const emailConfirmUrl = `${window.location.origin}/confirm/email`;

  const nextMaintenanceCreationBasisLabel = {
    executionDate: 'Data de execução',
    notificationDate: 'Data de notificação',
  };

  // #region modal functions
  const handleCreateApartmentModal = (state: boolean) => {
    setModalCreateApartmentOpen(state);
  };
  // #endregion

  // #region functions
  const handleChangeApartment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApartmentNumber(e.target.value);
  };

  const handleRemoveApartment = (index: number) => {
    const prevApartments = structuredClone(building?.BuildingApartments) || [];

    prevApartments.splice(index, 1);
    setBuilding((prevBuilding) => {
      if (prevBuilding) {
        return {
          ...prevBuilding,
          BuildingApartments: prevApartments,
        };
      }
      return prevBuilding;
    });
  };

  const handleAddApartment = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!building) {
        return;
      }

      if (!apartmentNumber) {
        handleToastifyMessage({
          message: 'Informe o número do apartamento.',
          type: 'error',
        });

        return;
      }

      if (building.BuildingApartments?.some((apartment) => apartment.number === apartmentNumber)) {
        handleToastifyMessage({
          message: 'O número do apartamento já foi cadastrado.',
          type: 'error',
        });

        return;
      }

      const prevApartments = structuredClone(building.BuildingApartments) || [];

      prevApartments?.push({
        id: '',
        number: apartmentNumber,
        floor: '',
      });

      prevApartments.sort((a, b) => a.number.localeCompare(b.number));

      setBuilding((prevBuilding) => {
        if (prevBuilding) {
          return {
            ...prevBuilding,
            BuildingApartments: prevApartments,
          };
        }
        return prevBuilding;
      });

      setApartmentNumber('');
    }
  };
  // #endregion

  // #region api functions
  const handleCreateApartment = async () => {
    setOnQuery(true);

    try {
      await putBuildingsApartments({
        buildingId: buildingId!,
        apartments: building?.BuildingApartments || [],
      });
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setOnQuery(false);
      handleCreateApartmentModal(false);
    }
  };

  const handleSendPhoneConfirmation = async (userId: string) => {
    await sendPhoneConfirmation({ userId, link: phoneConfirmUrl });
  };

  const handleSendEmailConfirmation = async (userId: string) => {
    await sendEmailConfirmation({ userId, link: emailConfirmUrl });
  };

  // #endregion

  // #region useEffects
  useEffect(() => {
    requestBuildingTypes({ setBuildingTypes }).then(() => {
      requestBuildingDetails({
        buildingId: buildingId!,
        setLoading,
        setBuilding,
        setUsedMaintenancesCount,
        setTotalMaintenancesCount,
        setRootFolder,
      });
    });
  }, []);

  useEffect(() => {
    if (folderId) {
      requestFolderDetails({
        folderId,
        setBuilding,
        setBreadcrumb,
        rootFolder,
      });
    }
  }, [folderId]);
  // #endregion

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      <>
        {modalEditBuildingOpen && building && (
          <ModalEditBuilding
            setModal={setModalEditBuildingOpen}
            building={building}
            buildingTypes={buildingTypes}
            requestBuildingDetailsCall={async () => {
              requestBuildingDetails({
                buildingId: buildingId!,
                setLoading,
                setBuilding,
                setUsedMaintenancesCount,
                setTotalMaintenancesCount,
                setRootFolder,
              });
            }}
          />
        )}

        {modalCreateNotificationConfigurationOpen && building && (
          <ModalCreateNotificationConfiguration
            setModal={setModalCreateNotificationConfigurationOpen}
            buildingId={building.id}
            emailConfirmUrl={emailConfirmUrl}
            phoneConfirmUrl={phoneConfirmUrl}
            requestBuildingDetailsCall={async () => {
              requestBuildingDetails({
                buildingId: buildingId!,
                setLoading,
                setBuilding,
                setUsedMaintenancesCount,
                setTotalMaintenancesCount,
                setRootFolder,
              });
            }}
          />
        )}

        {/* {modalEditNotificationConfigurationOpen && selectedNotificationRow && building && (
          <ModalEditNotificationConfiguration
            buildingId={building.id}
            selectedNotificationRow={selectedNotificationRow}
            setModal={setModalEditNotificationConfigurationOpen}
            emailConfirmUrl={emailConfirmUrl}
            phoneConfirmUrl={phoneConfirmUrl}
            requestBuildingDetailsCall={async () => {
              requestBuildingDetails({
                buildingId: buildingId!,
                setLoading,
                setBuilding,
                setUsedMaintenancesCount,
                setTotalMaintenancesCount,
                setRootFolder,
              });
            }}
          />
        )} */}

        {modalAddFilesOpen && building && rootFolder && (
          <ModalAddFiles
            setModal={setModalAddFilesOpen}
            setBuilding={setBuilding}
            folderId={folderId || building?.Folders.id}
          />
        )}

        {modalCreateFolderOpen && building && rootFolder && (
          <ModalCreateFolder
            setModal={setModalCreateFolderOpen}
            buildingId={building.id}
            setBuilding={setBuilding}
            parentId={folderId || building?.Folders.id}
          />
        )}

        {modalEditFolderOpen && building && folderToEdit && (
          <ModalEditFolder
            setModal={setModalEditFolderOpen}
            setBuilding={setBuilding}
            folder={folderToEdit}
          />
        )}

        {modalEditFileOpen && building && fileToEdit && (
          <ModalEditFile
            setModal={setModalEditFileOpen}
            setBuilding={setBuilding}
            file={fileToEdit}
          />
        )}

        {modalAddBannerOpen && building && (
          <ModalAddBanner
            setModal={setModalAddBannerOpen}
            onThenRequest={async () => {
              requestBuildingDetails({
                buildingId: buildingId!,
                setLoading,
                setBuilding,
                setUsedMaintenancesCount,
                setTotalMaintenancesCount,
                setRootFolder,
              });
            }}
          />
        )}

        {modalUpdateBannerOpen && selectedBanner && building && (
          <ModalUpdateBanner
            setModal={setModalUpdateBannerOpen}
            selectedBanner={selectedBanner}
            onThenRequest={async () => {
              requestBuildingDetails({
                buildingId: buildingId!,
                setLoading,
                setBuilding,
                setUsedMaintenancesCount,
                setTotalMaintenancesCount,
                setRootFolder,
              });
            }}
          />
        )}

        {modalPrintQRCodeOpen && building && (
          <ModalPrintQRCode
            setModal={setModalPrintQRCodeOpen}
            buildingName={building?.name}
            buildingNanoId={building.nanoId}
            notificationsConfigurations={building.NotificationsConfigurations.map((syndic) => ({
              name: syndic.name,
              nanoId: syndic.nanoId,
            }))}
          />
        )}

        {modalChangeClientPasswordOpen && building && (
          <ModalChangeClientPassword
            setModal={setModalChangeClientPasswordOpen}
            type={passwordType}
            onThen={async () => {
              requestBuildingDetails({
                buildingId: buildingId!,
                setLoading,
                setBuilding,
                setUsedMaintenancesCount,
                setTotalMaintenancesCount,
                setRootFolder,
              });
            }}
          />
        )}

        {modalCreateApartmentOpen && building && (
          <ModalCreateApartments
            apartments={building.BuildingApartments}
            apartmentNumber={apartmentNumber}
            onQuery={onQuery}
            handleChangeApartment={handleChangeApartment}
            handleAddApartment={handleAddApartment}
            handleRemoveApartment={handleRemoveApartment}
            handleCreateApartment={handleCreateApartment}
            handleCreateApartmentModal={handleCreateApartmentModal}
          />
        )}
      </>

      <Style.Header>
        <h2>Detalhes de edificação - {building?.name}</h2>
        <ReturnButton path={`/buildings${search}`} />
      </Style.Header>

      <Style.CardWrapper>
        {building?.MaintenancesCount && (
          <Style.FirstCard>
            <Style.CardHeaderLeftSide>
              <h5>Manutenções</h5>

              <Style.MaintenanceCardFooter>
                {/* Não fiz .map pra facilitar a estilização */}
                <Style.MaintenanceCardFooterInfo>
                  <h5 className="completed">{building?.MaintenancesCount[0].count}</h5>
                  <p className="p5">
                    {building?.MaintenancesCount[0].count > 1
                      ? capitalizeFirstLetter(building?.MaintenancesCount[0].pluralLabel)
                      : capitalizeFirstLetter(building?.MaintenancesCount[0].singularLabel)}
                  </p>
                </Style.MaintenanceCardFooterInfo>

                <Style.MaintenanceCardFooterInfo>
                  <h5 className="pending">{building?.MaintenancesCount[1].count}</h5>
                  <p className="p5">
                    {building?.MaintenancesCount[1].count > 1
                      ? capitalizeFirstLetter(building?.MaintenancesCount[1].pluralLabel)
                      : capitalizeFirstLetter(building?.MaintenancesCount[1].singularLabel)}
                  </p>
                </Style.MaintenanceCardFooterInfo>

                <Style.MaintenanceCardFooterInfo>
                  <h5 className="expired">{building?.MaintenancesCount[2].count}</h5>
                  <p className="p5">
                    {building?.MaintenancesCount[2].count > 1
                      ? capitalizeFirstLetter(building?.MaintenancesCount[2].pluralLabel)
                      : capitalizeFirstLetter(building?.MaintenancesCount[2].singularLabel)}
                  </p>
                </Style.MaintenanceCardFooterInfo>
              </Style.MaintenanceCardFooter>
            </Style.CardHeaderLeftSide>
            <Style.ButtonWrapper>
              <Button
                label="Tela do Morador"
                onClick={() =>
                  window.open(
                    `${import.meta.env.VITE_CLIENT_URL ?? 'http://localhost:3001'}/home/${
                      building.nanoId
                    }?userId=${account?.User.id}`,
                    '_blank',
                  )
                }
              />

              <Button label="QR Code" onClick={() => setModalPrintQRCodeOpen(true)} />
            </Style.ButtonWrapper>
          </Style.FirstCard>
        )}

        <Style.Card>
          <Style.CardHeader>
            <h5>Dados da edificação</h5>

            <Style.CardHeaderButtonsContainer>
              <IconButton
                icon={icon.editWithBg}
                label="Editar"
                permToCheck="buildings:update"
                hideLabelOnMedia
                onClick={() => setModalEditBuildingOpen(true)}
              />

              <IconButton
                icon={icon.plusWithBg}
                label="Apartamentos"
                permToCheck="buildings:update"
                hideLabelOnMedia
                onClick={() => handleCreateApartmentModal(true)}
              />
            </Style.CardHeaderButtonsContainer>
          </Style.CardHeader>

          <Style.BuildingCardWrapper>
            <Style.BuildingCardColumn>
              <Style.BuildingCardData>
                <p className="p3">Nome:</p>
                <p className="p3">{building?.name}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Tipo:</p>
                <p className="p3">
                  {building?.BuildingType.name
                    ? capitalizeFirstLetter(building.BuildingType.name)
                    : '-'}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Data de início:</p>
                <p className="p3">
                  {building?.deliveryDate ? dateFormatter(building?.deliveryDate!) : ''}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Término da garantia:</p>
                <p className="p3">
                  {building?.warrantyExpiration ? dateFormatter(building.warrantyExpiration) : '-'}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Notificar após garantia?</p>
                <p className="p3">{building?.keepNotificationAfterWarrantyEnds ? 'Sim' : 'Não'}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Próxima manutenção baseada em:</p>
                <p className="p3">
                  {building
                    ? nextMaintenanceCreationBasisLabel[building?.nextMaintenanceCreationBasis]
                    : '-'}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Convidado pode concluir manutenção:</p>
                <p className="p3">{building?.guestCanCompleteMaintenance ? 'Sim' : 'Não'}</p>
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
                <p className="p3">Comprovantes de relato obrigatórios?</p>
                <p className="p3">{building?.mandatoryReportProof ? 'Sim' : 'Não'}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Tornar logs de atividade público?</p>
                <p className="p3">{building?.isActivityLogPublic ? 'Sim' : 'Não'}</p>
              </Style.BuildingCardData>
            </Style.BuildingCardColumn>
          </Style.BuildingCardWrapper>
        </Style.Card>

        <Style.Card>
          <Style.CardHeader>
            <h5>Usuário responsáveis</h5>

            {/* <IconButton
              icon={icon.plusWithBg}
              label="Cadastrar"
              hideLabelOnMedia
              onClick={() => {
                setModalCreateNotificationConfigurationOpen(true);
              }}
            /> */}
          </Style.CardHeader>

          {building && building.UserBuildingsPermissions.length > 0 ? (
            <NotificationTable
              colsHeader={[
                { label: 'Nome do responsável' },
                { label: 'E-mail' },
                { label: 'Telefone' },
                { label: 'Função' },
                {
                  label: 'Exibir',
                  cssProps: {
                    width: '1%',
                    textAlign: 'center',
                  },
                },
                {
                  label: 'Principal',
                  cssProps: {
                    width: '1%',
                    textAlign: 'center',
                  },
                },
              ]}
            >
              {building?.UserBuildingsPermissions.map(
                ({ User, isMainContact, showContact }, i: number) => (
                  <NotificationTableContent
                    key={User.id}
                    onClick={() => {
                      //
                    }}
                    colsBody={[
                      {
                        cell: <TableCell value={User.name} textSize="csm" />,
                        cssProps: {
                          borderBottomLeftRadius:
                            i + 1 === building?.UserBuildingsPermissions.length
                              ? theme.size.xsm
                              : 0,
                        },
                      },
                      {
                        cell: (
                          <Style.TableDataWrapper>
                            <TableCell value={User.email} />

                            {User.email && User.emailIsConfirmed && (
                              <Image img={icon.checkedNoBg} size="16px" />
                            )}

                            {User.email && !User.emailIsConfirmed && (
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
                                actionButtonClick={() => handleSendEmailConfirmation(User.id)}
                              />
                            )}
                          </Style.TableDataWrapper>
                        ),
                      },
                      {
                        cell: (
                          <Style.TableDataWrapper>
                            <TableCell value={User.phoneNumber} type="phone" />

                            {User.phoneNumber && User.phoneNumberIsConfirmed && (
                              <Image img={icon.checkedNoBg} size="16px" />
                            )}

                            {User.phoneNumber && !User.phoneNumberIsConfirmed && (
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
                                actionButtonClick={() => handleSendPhoneConfirmation(User.id)}
                              />
                            )}
                          </Style.TableDataWrapper>
                        ),
                      },
                      { cell: <TableCell value={User.role} /> },

                      {
                        cell: (
                          <InputCheckbox
                            type="checkbox"
                            checked={showContact}
                            disabled={showContactLoading}
                            justifyContent="center"
                            onChange={async () => {
                              setShowContactLoading(true);

                              try {
                                await changeShowContactStatus({
                                  userId: User.id,
                                  buildingId: building.id,
                                  showContact: !showContact,
                                });

                                const prevBuilding = structuredClone(building);

                                prevBuilding.UserBuildingsPermissions[i].showContact = !showContact;

                                setBuilding(prevBuilding);
                              } finally {
                                setShowContactLoading(false);
                              }
                            }}
                          />
                        ),
                        cssProps: {
                          textAlign: 'center',
                        },
                      },
                      {
                        cell: (
                          <InputCheckbox
                            type="checkbox"
                            checked={isMainContact}
                            disabled={showIsMainContactLoading}
                            justifyContent="center"
                            onChange={async () => {
                              setShowIsMainContactLoading(true);

                              try {
                                await changeShowContactStatus({
                                  userId: User.id,
                                  buildingId: building.id,
                                  isMainContact: !isMainContact,
                                });

                                const prevBuilding = structuredClone(building);

                                prevBuilding.UserBuildingsPermissions[i].isMainContact =
                                  !isMainContact;

                                setBuilding(prevBuilding);
                              } finally {
                                setShowIsMainContactLoading(false);
                              }
                            }}
                          />
                        ),
                        cssProps: {
                          textAlign: 'center',
                        },
                      },
                      // {
                      //   cell: (
                      //     <Style.ButtonWrapper>
                      //       {isMainContact && (
                      //         <Style.MainContactTag title="Apenas o contato principal receberá notificações por WhatsApp.">
                      //           <p className="p5">Contato principal</p>
                      //         </Style.MainContactTag>
                      //       )}

                      //       <IconButton
                      //         size="16px"
                      //         className="p4"
                      //         icon={icon.edit}
                      //         label="Editar"
                      //         onClick={() => {
                      //           setSelectedNotificationRow(User);
                      //           setModalEditNotificationConfigurationOpen(true);
                      //         }}
                      //       />
                      //     </Style.ButtonWrapper>
                      //   ),
                      //   cssProps: {
                      //     width: '10%',
                      //     borderBottomRightRadius:
                      //       i + 1 === building?.NotificationsConfigurations.length
                      //         ? theme.size.xxsm
                      //         : 0,
                      //   },
                      // },
                    ]}
                  />
                ),
              )}
            </NotificationTable>
          ) : (
            <Style.NoDataContainer>
              <h5>Nenhum dado cadastrado.</h5>
            </Style.NoDataContainer>
          )}
        </Style.Card>

        <Style.CardGrid>
          <Style.AnnexCard>
            <Style.AnnexCardTitle>
              <Style.AnnexCardHeader>
                <h5>Senhas de acesso</h5>
              </Style.AnnexCardHeader>
            </Style.AnnexCardTitle>

            {building ? (
              <NotificationTable
                colsHeader={[{ label: 'Acesso' }, { label: 'Status' }, { label: '' }]}
              >
                <NotificationTableContent
                  onClick={() => {
                    //
                  }}
                  colsBody={[
                    {
                      cell: 'Morador',
                    },
                    {
                      cell: building.residentPassword ? 'Cadastrada' : 'Não cadastrada',
                    },
                    {
                      cell: (
                        <Style.PasswordDiv>
                          <IconButton
                            size="16px"
                            icon={icon.edit}
                            label="Editar"
                            className="p4"
                            onClick={() => {
                              setPasswordType('resident');
                              setModalChangeClientPasswordOpen(true);
                            }}
                          />
                        </Style.PasswordDiv>
                      ),
                    },
                  ]}
                />
                <NotificationTableContent
                  onClick={() => {
                    //
                  }}
                  colsBody={[
                    {
                      cell: 'Responsável',
                      cssProps: {
                        borderBottomLeftRadius: theme.size.xsm,
                      },
                    },
                    {
                      cell: building.syndicPassword ? 'Cadastrada' : 'Não cadastrada',
                    },
                    {
                      cell: (
                        <Style.PasswordDiv>
                          <IconButton
                            size="16px"
                            icon={icon.edit}
                            label="Editar"
                            className="p4"
                            onClick={() => {
                              setPasswordType('responsible');
                              setModalChangeClientPasswordOpen(true);
                            }}
                          />
                        </Style.PasswordDiv>
                      ),
                      cssProps: {
                        borderBottomRightRadius: theme.size.xsm,
                      },
                    },
                  ]}
                />
              </NotificationTable>
            ) : (
              <Style.NoDataContainer>
                <h5>Nenhum dado cadastrado.</h5>
              </Style.NoDataContainer>
            )}
          </Style.AnnexCard>

          <Style.AnnexCard>
            <Style.AnnexCardTitle>
              <Style.AnnexCardHeader>
                <h5>Plano de manutenção</h5>
              </Style.AnnexCardHeader>

              <Style.AnnexCardButtons>
                <IconButton
                  icon={icon.listWithBg}
                  label="Visualizar"
                  hideLabelOnMedia
                  onClick={() => {
                    if (building?.id)
                      navigate(`/buildings/details/${building?.id}/maintenances/list${search}`);
                  }}
                />

                <IconButton
                  icon={icon.editWithBg}
                  label="Editar"
                  permToCheck="maintenances:plan"
                  hideLabelOnMedia
                  onClick={() => {
                    if (building?.id)
                      navigate(`/buildings/details/${building?.id}/maintenances/manage${search}`);
                  }}
                />
              </Style.AnnexCardButtons>
            </Style.AnnexCardTitle>
            <Style.CountDiv>
              <h3>{usedMaintenancesCount}</h3>
              <h4>/</h4>
              <h5>({totalMaintenancesCount} disponíveis)</h5>
            </Style.CountDiv>
          </Style.AnnexCard>
        </Style.CardGrid>

        <Style.CardGrid>
          <Style.AnnexCard>
            <Style.AnnexCardTitle>
              <Style.AnnexCardHeader>
                <h5>Documentos</h5>
                <Style.BreadcrumbWrapper>
                  {breadcrumb.map((element, i) => (
                    <React.Fragment key={element.id}>
                      <button type="button" onClick={() => setFolderId(element.id)}>
                        {element.name}
                      </button>

                      {i === 0 && breadcrumb.length > 1 && <p className="p3">/</p>}

                      {i > 0 && breadcrumb.length > 1 && i + 1 !== breadcrumb.length && (
                        <p className="p3">{'>'}</p>
                      )}
                    </React.Fragment>
                  ))}
                </Style.BreadcrumbWrapper>
              </Style.AnnexCardHeader>

              <Style.AnnexCardButtons>
                <IconButton
                  icon={icon.plusWithBg}
                  label="Pasta"
                  size="24px"
                  hideLabelOnMedia
                  onClick={() => setModalCreateFolderOpen(true)}
                />

                <IconButton
                  icon={icon.addFileV2}
                  label="Arquivos"
                  size="24px"
                  hideLabelOnMedia
                  onClick={() => setModalAddFilesOpen(true)}
                />
              </Style.AnnexCardButtons>
            </Style.AnnexCardTitle>
            {building &&
            (building?.Folders?.Files?.length > 0 || building?.Folders?.Folders?.length > 0) ? (
              <Style.TagWrapper>
                {building?.Folders?.Folders?.map((element) => (
                  <FolderComponent
                    key={element.id}
                    name={element.name}
                    onFolderClick={() => setFolderId(element.id)}
                    onEditClick={() => {
                      setFolderToEdit(element);
                      setModalEditFolderOpen(true);
                    }}
                    onDeleteClick={() => requestDeleteFolder({ folderId: element.id, setBuilding })}
                  />
                ))}
                {building?.Folders?.Files?.map((element) => (
                  <FileComponent
                    key={element.id}
                    name={element.name}
                    url={element.url}
                    onEditClick={() => {
                      setFileToEdit(element);
                      setModalEditFileOpen(true);
                    }}
                    onDeleteClick={() =>
                      requestDeleteFile({
                        folderId: element.id,
                        setBuilding,
                      })
                    }
                  />
                ))}
              </Style.TagWrapper>
            ) : (
              <Style.NoAnnexes className="bottom">
                <h5>Nenhum anexo cadastrado.</h5>
              </Style.NoAnnexes>
            )}
          </Style.AnnexCard>

          <Style.AnnexCard>
            <Style.CardHeader>
              <h5>Banners</h5>
              <IconButton
                icon={icon.plusWithBg}
                label="Cadastrar"
                size="24px"
                hideLabelOnMedia
                onClick={() => setModalAddBannerOpen(true)}
              />
            </Style.CardHeader>
            {building && building?.Banners.length > 0 ? (
              <Style.BannerWrapper>
                {building.Banners.map((element) => (
                  <ImagePreview
                    key={element.url}
                    width="auto"
                    height="97px"
                    downloadUrl={element.url}
                    src={element.url}
                    imageCustomName={element.originalName}
                    onTrashClick={async () => {
                      await deleteBanner(element.id);
                      requestBuildingDetails({
                        buildingId: buildingId!,
                        setLoading,
                        setBuilding,
                        setUsedMaintenancesCount,
                        setTotalMaintenancesCount,
                        setRootFolder,
                      });
                    }}
                    onUpdateClick={() => {
                      setSelectedBanner({ ...element, redirectUrl: element.redirectUrl || '' });
                      setModalUpdateBannerOpen(true);
                    }}
                  />
                ))}
              </Style.BannerWrapper>
            ) : (
              <Style.NoBanners className="bottom">
                <h5>Nenhum banner cadastrado.</h5>
              </Style.NoBanners>
            )}
          </Style.AnnexCard>
        </Style.CardGrid>
      </Style.CardWrapper>
    </>
  );
};
