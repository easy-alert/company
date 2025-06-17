import { Image } from '@components/Image';

import { icon } from '@assets/icons';

import * as Style from './styles';

interface IUserResponsible {
  title: string;
  users?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  }[];
}

const UserResponsible = ({ title, users }: IUserResponsible) => {
  if (!users) {
    return null;
  }

  return (
    <Style.UserResponsibleContainer>
      <Style.UserResponsibleTitle>{title}</Style.UserResponsibleTitle>

      <Style.UserResponsibleContentContainer>
        {users?.length === 0 && (
          <Style.UserResponsibleContent>
            <Style.UserResponsibleImageContent>
              <Image img={icon.personPlaceholder} size="64px" />
            </Style.UserResponsibleImageContent>

            <Style.UserResponsibleData>
              <Style.UserResponsibleDataRow>
                <p>Usuário</p>
                <span>Nenhum usuário encontrado</span>
              </Style.UserResponsibleDataRow>

              <Style.UserResponsibleDataRow>
                <p>Email</p>
                <span>Nenhum usuário encontrado</span>
              </Style.UserResponsibleDataRow>
            </Style.UserResponsibleData>
          </Style.UserResponsibleContent>
        )}

        {users?.map((user) => (
          <Style.UserResponsibleContent key={user.id}>
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
        ))}
      </Style.UserResponsibleContentContainer>
    </Style.UserResponsibleContainer>
  );
};

export default UserResponsible;
