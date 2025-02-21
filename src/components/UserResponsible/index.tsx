import { Image } from '@components/Image';

import { icon } from '@assets/icons';

import type { IUser } from '@customTypes/IUser';

import * as Style from './styles';

interface IUserResponsible {
  user: IUser;
}

const UserResponsible = ({ user }: IUserResponsible) => (
  <Style.UserResponsibleContainer>
    <h3>Usuário Responsável</h3>

    <Style.UserResponsibleContent>
      <Style.UserResponsibleImageContent>
        <Image img={user?.image || icon.personPlaceholder} size="64px" />
      </Style.UserResponsibleImageContent>

      <Style.UserResponsibleData>
        <Style.UserResponsibleDataRow>
          <p>Usuário</p>
          <span>{user?.name}</span>
        </Style.UserResponsibleDataRow>

        <Style.UserResponsibleDataRow>
          <p>Email</p>
          <span>{user?.email}</span>
        </Style.UserResponsibleDataRow>
      </Style.UserResponsibleData>
    </Style.UserResponsibleContent>
  </Style.UserResponsibleContainer>
);

export default UserResponsible;
