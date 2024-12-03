// REACT
import { useEffect, useState } from 'react';

// GLOBAL COMPONENTS
import { IFrameModal } from '@components/IFrameModal/IFrameModal';

// GLOBAL UTILS
import { catchHandler } from '@utils/functions';

// GLOBAL TYPES
import type { ITutorial } from '@customTypes/ITutorial';

// COMPONENTS
import { getTutorials } from '@services/apis/getTutorials';

// STYLES
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import * as Style from './styles';

export const Tutorials = () => {
  const [tutorials, setTutorials] = useState<ITutorial[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [iFrameModal, setIFrameModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleIFrameModal = (modalState: boolean) => {
    setIFrameModal(modalState);
  };

  const handleSelectedIndex = (index: number) => {
    setSelectedIndex(index);
  };

  const handleGetTutorials = async () => {
    setLoading(true);

    try {
      const responseData = await getTutorials();

      setTutorials(responseData.tutorials);
    } catch (error) {
      catchHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTutorials();
  }, []);

  return (
    <>
      {iFrameModal && !selectedIndex && (
        <IFrameModal
          name={tutorials[selectedIndex].title}
          link={tutorials[selectedIndex].url}
          handleIFrameModal={handleIFrameModal}
        />
      )}

      <Style.Container>
        <Style.HeaderContainer>
          <h2>Tutoriais</h2>
        </Style.HeaderContainer>

        {loading && <DotSpinLoading />}

        {!loading && (
          <Style.Wrapper>
            {tutorials.length === 0 && (
              <Style.EmptyContainer>
                <h4>Nenhum tutorial encontrado</h4>
              </Style.EmptyContainer>
            )}

            {tutorials.map((tutorial, index) => (
              <Style.Card key={tutorial.id}>
                <Style.CardHeader>
                  <h5>{tutorial.title}</h5>
                </Style.CardHeader>

                <Style.CardImageContainer
                  onClick={() => {
                    handleSelectedIndex(index);
                    handleIFrameModal(true);
                  }}
                >
                  <img alt="" src={tutorial.thumbnail} />
                </Style.CardImageContainer>
              </Style.Card>
            ))}
          </Style.Wrapper>
        )}
      </Style.Container>
    </>
  );
};
