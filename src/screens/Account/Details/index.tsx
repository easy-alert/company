// REACT
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// SERVICES
import { Api } from '@services/api';
import { sendPhoneConfirmation } from '@services/apis/sendPhoneConfirmation';
import { sendEmailConfirmation } from '@services/apis/sendEmailConfirmation';

// GLOBAL COMPONENTS
import { Image } from '@components/Image';
import { Tag } from '@components/Tag';
import { IconButton } from '@components/Buttons/IconButton';
import { ColorfulTable, ColorfulTableContent } from '@components/ColorfulTable';
import { PopoverButton } from '@components/Buttons/PopoverButton';
import TableCell from '@components/TableCell';

// GLOBAL UTILS
import { applyMask, catchHandler, dateFormatter, translateTicketType } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';
import IconEdit from '@assets/icons/IconEdit';
import IconEye from '@assets/icons/IconEye';
import IconPlus from '@assets/icons/IconPlus';
import IconTrash from '@assets/icons/IconTrash';

// GLOBAL TYPES
import { theme } from '@styles/theme';

// COMPONENTS
import { ModalEditCompany } from './ModalEditCompany';
import { ModalUpdateUser } from './ModalUpdateUser';
import { ModalCreateUser } from './ModalCreateUser';

// STYLES
import * as Style from './styles';

export interface ISelectedUser {
  id: string;
  image?: string;
  name: string;
  role?: string;
  email: string;
  phoneNumber: string;
  isBlocked: boolean;
  colorScheme?: string;
}

export const AccountDetails = () => {
  const { account, setAccount } = useAuthContext();

  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState<ISelectedUser>();

  const [modalEditAccountOpen, setModalEditAccountOpen] = useState<boolean>(false);
  const [modalUpdateUserOpen, setModalUpdateUserOpen] = useState<boolean>(false);
  const [modalCreateUserOpen, setModalCreateUserOpen] = useState<boolean>(false);

  const [onQuery, setOnQuery] = useState(false);

  const phoneConfirmUrl = `${window.location.origin}/confirm/phone`;
  const emailConfirmUrl = `${window.location.origin}/confirm/email`;

  const handleModals = (modal: string, modalState: boolean) => {
    switch (modal) {
      case 'editAccount':
        setModalEditAccountOpen(modalState);
        break;
      case 'updateUser':
        setModalUpdateUserOpen(modalState);
        break;
      case 'createUser':
        setModalCreateUserOpen(modalState);
        break;
      default:
        break;
    }
  };

  const validateToken = async () => {
    await Api.get('/auth/validate/token')
      .then((res) => {
        setAccount(res.data);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  const requestDeleteUser = async (id: string) => {
    setOnQuery(true);
    await Api.delete(`/usercompany/delete/${id}`)
      .then((res) => {
        validateToken();
        toast.success(res.data.ServerMessage.message);
        setOnQuery(false);
      })
      .catch((err) => {
        setOnQuery(false);
        catchHandler(err);
      });
  };

  const handleSendPhoneConfirmation = async (userId: string) => {
    await sendPhoneConfirmation({ userId, link: phoneConfirmUrl });
  };

  const handleSendEmailConfirmation = async (userId: string) => {
    await sendEmailConfirmation({ userId, link: emailConfirmUrl });
  };

  const companyDetails = [
    { label: 'Nome', value: account?.Company.name },
    {
      label: 'Telefone',
      value: applyMask({ value: account?.Company.contactNumber!, mask: 'TEL' }).value,
    },
    {
      label: account?.Company.CPF ? 'CPF' : 'CNPJ',
      value: applyMask({
        value: account?.Company.CPF! || account?.Company.CNPJ!,
        mask: account?.Company.CPF ? 'CPF' : 'CNPJ',
      }).value,
    },
    { label: 'Data de cadastro', value: dateFormatter(account?.User.createdAt!) },
    {
      label: 'Abertura de chamados',
      value: translateTicketType(account?.Company.ticketType || 'platform'),
    },
    {
      label: `${translateTicketType(account?.Company.ticketType || 'platform')} para chamado`,
      value: account?.Company.ticketInfo,
    },
  ];

  const userDetails = [
    { label: 'Nome', value: account?.User.name },
    { label: 'Email', userId: account?.User.id, value: account?.User.email },
    {
      label: 'Telefone',
      userId: account?.User.id,
      value: account?.User?.phoneNumber
        ? applyMask({
            value: account?.User?.phoneNumber,
            mask: 'TEL',
          }).value
        : '-',
    },

    { label: 'Cargo', value: account?.User.role },
    { label: 'Data de cadastro', value: dateFormatter(account?.User.createdAt!) },
    { label: 'Último acesso', value: dateFormatter(account?.User.lastAccess!) },
  ];

  return (
    <>
      {modalEditAccountOpen && account && (
        <ModalEditCompany company={account.Company} handleModals={handleModals} />
      )}

      {modalCreateUserOpen && (
        <ModalCreateUser onThenRequest={validateToken} handleModals={handleModals} />
      )}

      {modalUpdateUserOpen && selectedUser && (
        <ModalUpdateUser selectedUser={selectedUser} handleModals={handleModals} />
      )}

      <Style.CardSection>
        <Style.Header>
          <h2>Detalhes da Empresa</h2>

          {account?.User.isCompanyOwner && (
            <IconButton
              hideLabelOnMedia
              icon={<IconEdit strokeColor="primary" />}
              label="Editar"
              onClick={() => setModalEditAccountOpen(true)}
            />
          )}
        </Style.Header>

        <Style.CardContainer>
          <Style.CardImageContainer>
            <Image img={account.Company.image} size="100%" radius="" />
          </Style.CardImageContainer>

          <Style.CardTextContainer>
            {companyDetails.map((detail) => {
              if (!detail.value) return null;

              return (
                <Style.CardText key={detail.label}>
                  <h6>{detail.label}</h6>
                  <p className="p2">{detail.value}</p>
                </Style.CardText>
              );
            })}
          </Style.CardTextContainer>
        </Style.CardContainer>
      </Style.CardSection>

      <Style.CardSection>
        <Style.Header>
          <h2>Detalhes do Usuário</h2>

          <div style={{ display: 'flex', gap: '10px' }}>
            {account?.User.isCompanyOwner && (
              <IconButton
                hideLabelOnMedia
                icon={<IconEye strokeColor="primary" />}
                label="Permissões"
                onClick={() => navigate(`/account/${account.User.id}/permissions`)}
              />
            )}

            <IconButton
              hideLabelOnMedia
              icon={<IconEdit strokeColor="primary" />}
              label="Editar"
              onClick={() => {
                setSelectedUser({
                  id: account?.User.id,
                  image: account?.User.image,
                  name: account?.User.name,
                  role: account?.User.role,
                  email: account?.User.email || '',
                  phoneNumber: account?.User.phoneNumber || '',
                  colorScheme: account?.User.colorScheme,
                  isBlocked: account?.User.isBlocked,
                });
                setModalUpdateUserOpen(true);
              }}
            />
          </div>
        </Style.Header>

        <Style.CardContainer>
          <Style.CardImageContainer>
            <Image img={account.User.image || icon.personPlaceholder} size="100%" radius="" />
          </Style.CardImageContainer>

          <Style.CardTextContainer>
            {userDetails.map((detail) => (
              <Style.CardText key={detail?.label}>
                <h6>{detail?.label}</h6>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <p className="p2">{detail?.value || '-'}</p>

                  {detail?.label === 'Email' && account?.User.emailIsConfirmed && (
                    <Image img={icon.checkedNoBg} size="16px" />
                  )}

                  {detail?.label === 'Email' && !account?.User.emailIsConfirmed && (
                    <PopoverButton
                      label="Reenviar"
                      hiddenIconButtonLabel
                      buttonIcon={icon.yellowAlert}
                      buttonIconSize="16px"
                      actionButtonBgColor="primary"
                      type="IconButton"
                      message={{
                        title: 'Deseja reenviar o e-mail de confirmação?',
                        content: '',
                        contentColor: theme.color.danger,
                      }}
                      actionButtonClick={() => handleSendEmailConfirmation(detail?.userId!)}
                    />
                  )}

                  {detail?.label === 'Telefone' && account?.User.phoneNumberIsConfirmed && (
                    <Image img={icon.checkedNoBg} size="16px" />
                  )}

                  {detail?.label === 'Telefone' && !account?.User.phoneNumberIsConfirmed && (
                    <PopoverButton
                      label="Reenviar"
                      hiddenIconButtonLabel
                      buttonIcon={icon.yellowAlert}
                      buttonIconSize="16px"
                      actionButtonBgColor="primary"
                      type="IconButton"
                      message={{
                        title: 'Deseja reenviar a mensagem de confirmação no WhatsApp?',
                        content: '',
                        contentColor: theme.color.danger,
                      }}
                      actionButtonClick={() => handleSendPhoneConfirmation(detail?.userId!)}
                    />
                  )}
                </div>
              </Style.CardText>
            ))}
          </Style.CardTextContainer>
        </Style.CardContainer>

        <Style.Footer />
      </Style.CardSection>

      {account?.User.isCompanyOwner && (
        <Style.UsersCard>
          <Style.UsersCardHeader>
            <h5>Usuários</h5>

            <IconButton
              hideLabelOnMedia
              icon={<IconPlus strokeColor="primary" />}
              label="Cadastrar"
              onClick={() => setModalCreateUserOpen(true)}
            />
          </Style.UsersCardHeader>

          {(account?.Company?.UserCompanies?.length || 0) > 0 ? (
            <ColorfulTable
              colsHeader={[
                { label: '', cssProps: { width: '1%' } },
                { label: 'Nome' },
                { label: 'Email' },
                { label: 'Telefone' },
                { label: 'Cargo' },
                { label: 'Último acesso', cssProps: { width: '130px', textAlign: 'center' } },
                { label: 'Data de cadastro', cssProps: { width: '150px', textAlign: 'center' } },
                { label: 'Status', cssProps: { width: '1px', textAlign: 'center' } },
                { label: '' },
              ]}
            >
              {account?.Company.UserCompanies.map(({ User }) => (
                <ColorfulTableContent
                  key={User.id}
                  colsBody={[
                    {
                      cell: <Image img={User.image || icon.personPlaceholder} size="36px" />,
                      cssProps: { padding: '5px' },
                    },
                    { cell: <TableCell value={User.name} /> },
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
                              actionButtonBgColor="primary"
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
                              actionButtonBgColor="primary"
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
                    { cell: <TableCell value={User.lastAccess} type="date" alignItems="center" /> },
                    { cell: <TableCell value={User.createdAt} type="date" alignItems="center" /> },
                    { cell: <Tag isInvalid={User.isBlocked} /> },
                    {
                      cell: (
                        <Style.TableButtons>
                          <IconButton
                            className="p4"
                            size="16px"
                            hideLabelOnMedia
                            icon={<IconEye strokeColor="primary" />}
                            fill="primary"
                            label="Permissões"
                            onClick={() => navigate(`/account/${User.id}/permissions`)}
                          />

                          <IconButton
                            className="p4"
                            size="16px"
                            hideLabelOnMedia
                            icon={<IconEdit strokeColor="primary" padding="4px" />}
                            fill="primary"
                            label="Editar"
                            onClick={() => {
                              setSelectedUser({
                                id: User.id,
                                image: User.image,
                                name: User.name,
                                role: User.role,
                                email: User.email || '',
                                phoneNumber: User.phoneNumber || '',
                                isBlocked: User.isBlocked,
                              });
                              setModalUpdateUserOpen(true);
                            }}
                          />

                          <PopoverButton
                            hideLabelOnMedia
                            disabled={onQuery}
                            buttonIconSize="16px"
                            iconButtonClassName="p4"
                            actionButtonBgColor="primary"
                            type="IconButton"
                            label="Excluir"
                            buttonIcon={
                              <IconTrash strokeColor="danger" size="18px" viewBox="0 0 24 24" />
                            }
                            message={{
                              title: 'Deseja excluir este usuário?',
                              content: 'Atenção, essa ação não poderá ser desfeita posteriormente.',
                              contentColor: theme.color.danger,
                            }}
                            actionButtonClick={() => {
                              requestDeleteUser(User.id);
                            }}
                          />
                        </Style.TableButtons>
                      ),
                    },
                  ]}
                />
              ))}
            </ColorfulTable>
          ) : (
            <h5>Nenhum usuário cadastrado</h5>
          )}
        </Style.UsersCard>
      )}
    </>
  );
};
