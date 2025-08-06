// REACT
import { useEffect, useState } from 'react';

// CONTEXT
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// SERVICES
import { getHomeFeedItems } from '@services/apis/getHomeFeedItems';
import { getCompanyCompletedMaintenanceRank } from '@services/apis/getCompanyCompletedMaintenanceRank';
import { getLastFeatureVideo } from '@services/apis/getLastFeatureVideo';

// GLOBAL COMPONENTS
import { Image } from '@components/Image';
import { DotLoading } from '@components/Loadings/DotLoading';

// GLOBAL ASSETS
import { image } from '@assets/images';

// GLOBAL TYPES
import type { IFeedItem } from '@customTypes/IFeedItem';
import type { IPlatformVideo } from '@customTypes/IPlatformVideo';

// STYLES
import { icon } from '@assets/icons';
import * as Style from './styles';

function HomePage() {
  const { account } = useAuthContext();

  const [feedItems, setFeedItems] = useState<IFeedItem[]>([]);
  const [companyCompletedMaintenancesRank, setCompanyCompletedMaintenancesRank] = useState<{
    completedMaintenanceScoreRank: number;
    completedMaintenanceScore: number;
  }>({
    completedMaintenanceScoreRank: 0,
    completedMaintenanceScore: 0,
  });
  const [platformVideo, setPlatformVideo] = useState<IPlatformVideo>({});

  const [homeLoadings, setHomeLoadings] = useState({
    feedLoading: false,
    rankingLoading: false,
    videoLoading: false,
  });

  const handleRankMedal = (rank: number) => {
    switch (true) {
      case rank <= 20:
        return { medal: 'Empresa Ouro', image: image.goldMedal };
      case rank <= 40:
        return { medal: 'Empresa Prata', image: image.silverMedal };
      default:
        return { medal: 'Empresa Bronze', image: image.bronzeMedal };
    }
  };

  const handlePlatformVideoUrl = (video: IPlatformVideo) => {
    if (video.youtubeId) {
      return `https://www.youtube.com/embed/${video.youtubeId}`;
    }
    return video.url || '';
  };

  // #region API Calls
  const handleGetHomeFeedItems = async () => {
    setHomeLoadings((prev) => ({ ...prev, feedLoading: true }));

    try {
      const responseData = await getHomeFeedItems();

      setFeedItems(responseData);
    } finally {
      setHomeLoadings((prev) => ({ ...prev, feedLoading: false }));
    }
  };

  const handleGetCompanyCompletedMaintenanceRank = async () => {
    setHomeLoadings((prev) => ({ ...prev, rankingLoading: true }));

    try {
      const responseData = await getCompanyCompletedMaintenanceRank();

      setCompanyCompletedMaintenancesRank({
        completedMaintenanceScoreRank: responseData.completedMaintenanceScoreRank,
        completedMaintenanceScore: responseData.completedMaintenanceScore,
      });
    } finally {
      setHomeLoadings((prev) => ({ ...prev, rankingLoading: false }));
    }
  };

  const handleGetLastFeatureVideo = async () => {
    setHomeLoadings((prev) => ({ ...prev, videoLoading: true }));

    try {
      const responseData = await getLastFeatureVideo();

      setPlatformVideo(responseData);
    } finally {
      setHomeLoadings((prev) => ({ ...prev, videoLoading: false }));
    }
  };
  // #endregion

  useEffect(() => {
    handleGetHomeFeedItems();
    handleGetCompanyCompletedMaintenanceRank();
    handleGetLastFeatureVideo();
  }, []);

  return (
    <Style.Container>
      <Style.ImageContainer>
        <img src={account?.Company.image} alt="Logo" />
        <h2 data-testid="page-home">Olá {account?.User.name}!</h2>
      </Style.ImageContainer>

      <Style.MainContent>
        <Style.InfoSection>
          <h2>Feed de notícias</h2>

          {homeLoadings.feedLoading && (
            <Style.LoadingContainer>
              <DotLoading label="Carregando feed" />
            </Style.LoadingContainer>
          )}

          {!homeLoadings.feedLoading && feedItems.length === 0 && (
            <Style.LoadingContainer>
              <Image img={icon.logoRed} size="32px" />
              <Style.LoadingText>Nenhum item no feed</Style.LoadingText>
            </Style.LoadingContainer>
          )}

          {!homeLoadings.feedLoading &&
            feedItems.length > 0 &&
            feedItems.map((feedItem) => (
              <Style.InfoCard key={feedItem.id} highlight={feedItem.isPinned}>
                <Image img={icon.logoRed} size="32px" />
                <div>
                  <strong>{feedItem.title}</strong>
                  <pre>{feedItem.description}</pre>
                </div>
              </Style.InfoCard>
            ))}
        </Style.InfoSection>

        <Style.RightSection>
          {homeLoadings.rankingLoading ? (
            <Style.LoadingContainer>
              <DotLoading label="Carregando rank" />
            </Style.LoadingContainer>
          ) : (
            <Style.RankingCard>
              {companyCompletedMaintenancesRank.completedMaintenanceScore !== 0 && (
                <Image
                  img={
                    handleRankMedal(companyCompletedMaintenancesRank.completedMaintenanceScoreRank)
                      .image
                  }
                  size="80px"
                />
              )}
              <div>
                <strong>
                  {companyCompletedMaintenancesRank.completedMaintenanceScore !== 0
                    ? handleRankMedal(
                        companyCompletedMaintenancesRank.completedMaintenanceScoreRank,
                      ).medal
                    : 'Sem classificação'}
                </strong>
                <span>
                  {companyCompletedMaintenancesRank.completedMaintenanceScore !== 0
                    ? `Top ${companyCompletedMaintenancesRank.completedMaintenanceScoreRank} Ranking Brasil`
                    : ''}
                </span>
                {companyCompletedMaintenancesRank.completedMaintenanceScore !== 0 ? (
                  <p>empresas que mais fazem manutenção</p>
                ) : (
                  <p>sua empresa ainda não concluiu nenhuma manutenção esse mês</p>
                )}
              </div>
            </Style.RankingCard>
          )}

          <Style.VideoHighlight>
            {homeLoadings.videoLoading && (
              <Style.LoadingContainer>
                <DotLoading label="Carregando vídeo" />
              </Style.LoadingContainer>
            )}

            {homeLoadings.videoLoading && (!platformVideo.url || !platformVideo.youtubeId) && (
              <Style.LoadingContainer>
                <Image img={icon.logoRed} size="32px" />
                <Style.LoadingText>Nenhum vídeo destacado</Style.LoadingText>
              </Style.LoadingContainer>
            )}

            {!homeLoadings.videoLoading && (platformVideo.url || platformVideo.youtubeId) && (
              <>
                <h3>Veja as últimas novidades do sistema</h3>
                <Style.VideoFrame src={handlePlatformVideoUrl(platformVideo)} />
              </>
            )}
          </Style.VideoHighlight>
        </Style.RightSection>
      </Style.MainContent>
    </Style.Container>
  );
}

export default HomePage;
