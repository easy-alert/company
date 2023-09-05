// LIBS
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/Auth/UseAuthContext';

// COMPONENTS
import * as Style from './styles';
import { Image } from '../../../components/Image';
import { IconButton } from '../../../components/Buttons/IconButton';
import { icon } from '../../../assets/icons';

// FUNCTIONS
import { applyMask, dateFormatter } from '../../../utils/functions';

// MODALS
import { ModalEditAccount } from './utils/ModalEditAccount';

export const AccountDetails = () => {
  const { account, setAccount } = useAuthContext();
  const [modalEditAccountOpen, setModalEditAccountOpen] = useState<boolean>(false);

  return (
    <>
      {modalEditAccountOpen && (
        <ModalEditAccount
          setModal={setModalEditAccountOpen}
          account={account!}
          setAccount={setAccount}
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
          <h6>Link para chamado</h6>
          <p className="p2 link">
            {account?.Company.supportLink ? (
              <a href={account?.Company.supportLink} target="_blank" rel="noreferrer">
                {account?.Company.supportLink}
              </a>
            ) : (
              '-'
            )}
          </p>
        </Style.Card>

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
    </>
  );
};
