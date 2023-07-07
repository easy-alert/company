/* eslint-disable no-alert */
// LIBS
import { useEffect, useState } from 'react';
import { useLocation, Location } from 'react-router-dom';

import { figure } from '../../assets/figures';

// COMPONENTS
import * as Style from './styles';
import { Card } from './components/Card';

// CONTENTS
import { WelcomeTutorial } from './contents/Welcome';
import { Modal } from '../../components/Modal';

interface IContent {
  title: string;
  content: JSX.Element | null;
}

interface IHistory extends Location {
  state: {
    from: string;
  };
}

const contents = [
  {
    title: 'Bem-vindo a Easy Alert!',
    description: 'Guia introdutório das funcionalidades e recursos.',
    content: <WelcomeTutorial />,
    figure: figure.web,
  },
];

export const Tutorials = () => {
  const history = useLocation() as IHistory;

  const [content, setContent] = useState<IContent>({
    title: contents[0].title,
    content: contents[0].content,
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (
      localStorage.getItem('viewedTutorial') === 'false' &&
      history.state &&
      history.state.from === 'login'
    ) {
      setModalOpen(true);
    }
  }, []);

  return (
    <>
      {modalOpen && content.content && (
        <Modal title={content.title} setModal={setModalOpen} bodyWidth="900px">
          {content.content}
        </Modal>
      )}
      <Style.Container>
        <Style.Header>
          <h2>Tutorial</h2>
        </Style.Header>

        <Style.TutorialsContainer>
          {contents.map((card) => (
            <Card
              key={content.title}
              onClick={() => {
                setContent({ title: card.title, content: card.content });
                setModalOpen(true);
              }}
              figure={card.figure}
              title={card.title}
              description={card.description}
            />
          ))}
        </Style.TutorialsContainer>
      </Style.Container>
    </>
  );
};
