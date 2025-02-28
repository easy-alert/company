// REACT
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

// GLOBAL TYPES
import { theme } from '@styles/theme';

// COMPONENTS
import { ModalEditAccount } from './ModalEditAccount';
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
}

export const AccountDetails = () => {
  const { account, setAccount } = useAuthContext();

  const navigate = useNavigate();

  const [modalEditAccountOpen, setModalEditAccountOpen] = useState<boolean>(false);
  const [modalUpdateUserOpen, setModalUpdateUserOpen] = useState<boolean>(false);
  const [modalCreateUserOpen, setModalCreateUserOpen] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<ISelectedUser>();
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

  return (
    <>
      {modalEditAccountOpen && account && (
        <ModalEditAccount account={account} setAccount={setAccount} handleModals={handleModals} />
      )}

      {modalCreateUserOpen && (
        <ModalCreateUser onThenRequest={validateToken} handleModals={handleModals} />
      )}

      {modalUpdateUserOpen && selectedUser && (
        <ModalUpdateUser
          selectedUser={selectedUser}
          onThenRequest={validateToken}
          handleModals={handleModals}
        />
      )}

      <Style.Header>
        <h2>Configurações de conta</h2>
      </Style.Header>

      <Style.CardSection>
        <Style.Card>
          <h6>Logo</h6>
          <Image img={account?.Company.image} size="80px" />
        </Style.Card>

        <Style.Card>
          <h6>Nome do responsável</h6>
          <p className="p2">{account?.User.name}</p>
        </Style.Card>

        <Style.Card>
          <h6>E-mail</h6>
          <p className="p2">{account?.User.email}</p>
        </Style.Card>

        <Style.Card>
          <h6>Nome da empresa</h6>
          <p className="p2">{account?.Company.name}</p>
        </Style.Card>

        <Style.Card>
          <h6>Telefone</h6>
          <p className="p2">
            {applyMask({ value: account?.Company.contactNumber!, mask: 'TEL' }).value}
          </p>
        </Style.Card>

        {account?.Company.CPF && (
          <Style.Card>
            <h6>CPF</h6>
            <p className="p2">{applyMask({ value: account?.Company.CPF, mask: 'CPF' }).value}</p>
          </Style.Card>
        )}

        {account?.Company.CNPJ && (
          <Style.Card>
            <h6>CNPJ</h6>
            <p className="p2">{applyMask({ value: account?.Company.CNPJ, mask: 'CNPJ' }).value}</p>
          </Style.Card>
        )}

        <Style.Card>
          <h6>Data de cadastro</h6>
          <p className="p2">{dateFormatter(account?.User.createdAt!)}</p>
        </Style.Card>

        <Style.Card>
          <h6>Abertura de chamados</h6>
          <p className="p2">{translateTicketType(account?.Company.ticketType || 'platform')}</p>
        </Style.Card>

        {account?.Company.ticketInfo && (
          <Style.Card>
            <h6>{`${translateTicketType(
              account?.Company.ticketType || 'platform',
            )} para chamado`}</h6>
            <p className="p2">{account?.Company.ticketInfo}</p>
          </Style.Card>
        )}

        <Style.Card>
          <h6>Termos de uso</h6>
          <Link className="terms" to="/terms" target="_blank" rel="noopener noreferrer">
            Visualizar termos
          </Link>
        </Style.Card>
      </Style.CardSection>

      <Style.Footer>
        <IconButton
          hideLabelOnMedia
          icon={icon.edit}
          label="Editar"
          onClick={() => {
            setModalEditAccountOpen(true);
          }}
        />

        {account?.User.isCompanyOwner && (
          <IconButton
            hideLabelOnMedia
            icon={icon.eye}
            label="Permissões"
            onClick={() => navigate(`/account/${account.User.id}/permissions`)}
          />
        )}
      </Style.Footer>

      {account?.User.isCompanyOwner && (
        <Style.UsersCard>
          <Style.UsersCardHeader>
            <h5>Usuários</h5>

            <IconButton
              hideLabelOnMedia
              icon={icon.plusWithBg}
              label="Cadastrar"
              onClick={() => {
                setModalCreateUserOpen(true);
              }}
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
                    { cell: <TableCell value={User.lastAccess} type="date" alignItems="center" /> },
                    { cell: <TableCell value={User.createdAt} type="date" alignItems="center" /> },
                    { cell: <Tag isInvalid={User.isBlocked} /> },
                    {
                      cell: (
                        <Style.TableButtons>
                          <PopoverButton
                            hideLabelOnMedia
                            disabled={onQuery}
                            buttonIconSize="16px"
                            iconButtonClassName="p4"
                            actionButtonBgColor={theme.color.primary}
                            type="IconButton"
                            label="Excluir"
                            buttonIcon={icon.trash}
                            message={{
                              title: 'Deseja excluir este usuário?',
                              content: 'Atenção, essa ação não poderá ser desfeita posteriormente.',
                              contentColor: theme.color.danger,
                            }}
                            actionButtonClick={() => {
                              requestDeleteUser(User.id);
                            }}
                          />

                          <IconButton
                            className="p4"
                            size="16px"
                            hideLabelOnMedia
                            icon={icon.edit}
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

                          <IconButton
                            className="p4"
                            size="16px"
                            hideLabelOnMedia
                            icon={icon.eye}
                            label="Permissões"
                            onClick={() => navigate(`/account/${User.id}/permissions`)}
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
