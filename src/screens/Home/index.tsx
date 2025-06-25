import { useAuthContext } from '@contexts/Auth/UseAuthContext';
import { Image } from '@components/Image';

import * as Style from './styles';

function HomePage() {
  const { account } = useAuthContext();

  const infoCards = [
    {
      id: 'ref-sindico-1',
      title: 'Indique um síndico!',
      text: 'Se ele se tornar um cliente Easy, tanto você quanto ele terão a próxima mensalidade isenta!',
    },
    {
      id: 'dev-info-1',
      title: 'O que estamos desenvolvendo:',
      text: 'Melhorias no App, criação de um chat IA personalizado, controle de férias de colaboradores... e muito mais!',
    },
    {
      id: 'ref-sindico-2',
      title: 'Indique um síndico!',
      text: 'Se ele se tornar um cliente Easy, tanto você quanto ele terão a próxima mensalidade isenta!',
    },
    {
      id: 'dev-info-2',
      title: 'O que estamos desenvolvendo:',
      text: 'Melhorias no App, criação de um chat IA personalizado, controle de férias de colaboradores... e muito mais!',
    },
  ];

  return (
    <Style.Container>
      <Image img={account?.Company.image} size="240px" radius="0" />
      <h2 data-testid="page-home">Bem-vindo(a), {account?.User.name}!</h2>

      <Style.MainContent>
        <Style.InfoSection>
          {infoCards.map((card) => (
            <Style.InfoCard key={card.id}>
              <Image img="/src/assets/icons/logoRed.svg" size="32px" />
              <div>
                <strong>{card.title}</strong>
                <span>{card.text}</span>
              </div>
            </Style.InfoCard>
          ))}
        </Style.InfoSection>

        <Style.RightSection>
          <Style.RankingCard>
            <Image img="/src/assets/images/medalBronze.png" size="80px" />
            <div>
              <strong>Usuário Bronze</strong>
              <span>Top 50 Ranking Brasil</span>
              <p>usuários que mais fazem manutenção</p>
            </div>
          </Style.RankingCard>

          <Style.VideoHighlight>
            <h3>CLIQUE E VEJA AS ÚLTIMAS NOVIDADES DO SISTEMA</h3>
            <Style.VideoFrame src="https://www.youtube.com/embed/lI6M36t9pJg" />
          </Style.VideoHighlight>
        </Style.RightSection>
      </Style.MainContent>
    </Style.Container>
  );
}

export default HomePage;
