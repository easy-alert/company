// REACT
import { useState } from 'react';

// LIBS
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';
import { ColorfulTable, ColorfulTableContent } from '@components/ColorfulTable';
import { Tag } from '@components/Tag';
import { PopoverButton } from '@components/Buttons/PopoverButton';

// GLOBAL UTILS
import {
  applyMask,
  catchHandler,
  dateFormatter,
  dateTimeFormatter,
  translateTicketType,
} from '@utils/functions';

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
  name: string;
  email: string;
  status: string;
  id: string;
}

export const AccountDetails = () => {
  const { account, setAccount } = useAuthContext();

  const [modalEditAccountOpen, setModalEditAccountOpen] = useState<boolean>(false);
  const [modalUpdateUserOpen, setModalUpdateUserOpen] = useState<boolean>(false);
  const [modalCreateUserOpen, setModalCreateUserOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ISelectedUser>();
  const [onQuery, setOnQuery] = useState(false);

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

  return (
    <>
      {modalEditAccountOpen && account && (
        <ModalEditAccount
          setModal={setModalEditAccountOpen}
          account={account}
          setAccount={setAccount}
        />
      )}

      {modalUpdateUserOpen && selectedUser && (
        <ModalUpdateUser
          setModal={setModalUpdateUserOpen}
          selectedUser={selectedUser}
          onThenRequest={validateToken}
        />
      )}

      {modalCreateUserOpen && (
        <ModalCreateUser onThenRequest={validateToken} setModal={setModalCreateUserOpen} />
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
          icon={icon.editWithBg}
          label="Editar"
          onClick={() => {
            setModalEditAccountOpen(true);
          }}
        />
      </Style.Footer>

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
              { label: 'Nome' },
              { label: 'Email' },
              { label: 'Status' },
              { label: 'Último acesso' },
              { label: 'Data de cadastro' },
              { label: '' },
            ]}
          >
            {account?.Company.UserCompanies.map(({ User }) => (
              <ColorfulTableContent
                key={User.id}
                colsBody={[
                  { cell: User.name },
                  { cell: User.email },
                  { cell: <Tag isInvalid={User.isBlocked} /> },
                  { cell: User.lastAccess ? dateTimeFormatter(User.lastAccess) : '-' },
                  { cell: dateTimeFormatter(User.createdAt) },
                  {
                    cell: (
                      <Style.TableButtons>
                        <PopoverButton
                          hideLabelOnMedia
                          disabled={onQuery}
                          buttonIconSize="16px"
                          iconButtonClassName="p4"
                          actionButtonBgColor={theme.color.actionDanger}
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
                              email: User.email,
                              name: User.name,
                              status: User.isBlocked ? 'blocked' : 'active',
                              id: User.id,
                            });
                            setModalUpdateUserOpen(true);
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
    </>
  );
};
