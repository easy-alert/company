import { useAuthContext } from '@contexts/Auth/UseAuthContext';
import { Image } from '@components/Image';

import * as Style from './styles';

function HomePage() {
  const { account } = useAuthContext();

  return (
    <Style.Container>
      <Image img={account?.Company.image} size="320px" radius="0" />

      <Style.Title>Bem vindo(a), {account?.User.name}!</Style.Title>
    </Style.Container>
  );
}

export default HomePage;
