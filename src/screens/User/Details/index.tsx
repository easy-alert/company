// COMPONENTS
import * as Style from './styles';
import { Image } from '../../../components/Image';
import { Tag } from '../../../components/Tag';
import { IconButton } from '../../../components/Buttons/IconButton';
import { icon } from '../../../assets/icons';

// FUNCTIONS
import { applyMask, dateFormatter } from '../../../utils/functions';

export const UserDetails = () => {
  const user = {
    image: 'https://larguei.s3.us-west-2.amazonaws.com/9-mega-1663877182857.png',
    name: 'Jorge Andrade',
    email: 'jorge@gmail.com',
    companyName: 'Ada',
    phoneNumber: '48999283494',
    CPF: '11122233344',
    CNPJ: '',
    isBlocked: false,
    createdAt: String(new Date()),
    lastAccess: String(new Date()),
  };

  return (
    <>
      <Style.Header>
        <h2>Configurações de conta</h2>
      </Style.Header>

      <Style.CardSection>
        <Style.Card>
          <h6>Logo</h6>
          <Image img={user.image} size="80px" />
        </Style.Card>

        <Style.Card>
          <h6>Nome do responsável</h6>
          <p className="p2">{user.name}</p>
        </Style.Card>

        <Style.Card>
          <h6>E-mail</h6>
          <p className="p2">{user.email}</p>
        </Style.Card>

        <Style.Card>
          <h6>Nome da empresa</h6>
          <p className="p2">{user.companyName}</p>
        </Style.Card>

        <Style.Card>
          <h6>Telefone</h6>
          <p className="p2">{applyMask({ value: user.phoneNumber, mask: 'TEL' }).value}</p>
        </Style.Card>

        {user.CPF && (
          <Style.Card>
            <h6>CPF</h6>
            <p className="p2">{applyMask({ value: user.CPF, mask: 'CPF' }).value}</p>
          </Style.Card>
        )}

        {user.CNPJ && (
          <Style.Card>
            <h6>CNPJ</h6>
            <p className="p2">{applyMask({ value: user.CNPJ, mask: 'CNPJ' }).value}</p>
          </Style.Card>
        )}

        <Style.Card>
          <h6>Status</h6>
          <Tag isInvalid={user.isBlocked} />
        </Style.Card>

        <Style.Card>
          <h6>Data de cadastro</h6>
          <p className="p2">{dateFormatter(user.createdAt)}</p>
        </Style.Card>

        <Style.Card>
          <h6>Último acesso</h6>
          <p className="p2">{user.lastAccess ? dateFormatter(user.lastAccess) : '-'}</p>
        </Style.Card>
      </Style.CardSection>

      <Style.Footer>
        <IconButton
          hideLabelOnMedia
          icon={icon.editWithBg}
          label="Editar"
          onClick={() => {
            // setEditModalCreateCompanyAndOwnerIsOpen(true);
          }}
        />
      </Style.Footer>
    </>
  );
};
