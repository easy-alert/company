import { useState } from 'react';
import { icon } from '../../assets/icons';
import * as Style from './styles';
import { IFrameModal } from './IFrameModal';

export const Tutorials = () => {
  const [iframeModalOpen, setIframeModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const videos = [
    {
      thumbnail: icon.paper,
      link: 'https://youtu.be/ZmAId85nywI',
      name: 'Bem-vindo à Easy Alert!',
    },
    {
      thumbnail: icon.paper,
      link: 'https://youtu.be/PEulFq2tE3o',
      name: 'Introdução plataforma',
    },
    {
      thumbnail: icon.paper,
      link: 'https://youtu.be/8VNDmvTYHFE',
      name: 'Cadastro de edificação',
    },
    {
      thumbnail: icon.paper,
      link: 'https://youtu.be/_L1f4AYAuWg',
      name: 'Como usar os QRCodes',
    },
    {
      thumbnail: icon.paper,
      link: 'https://youtu.be/SeXoANy7Atk',
      name: 'Como usar os checklists',
    },
    {
      thumbnail: icon.paper,
      link: 'https://youtu.be/hOp3MlaJm6M',
      name: 'Abertura de chamado',
    },
    {
      thumbnail: icon.paper,
      link: 'https://youtu.be/LUCUx4oeZcQ',
      name: 'Dashboard',
    },
    {
      thumbnail: icon.paper,
      link: 'https://youtu.be/JUWu0JbJu8c',
      name: 'Como responder manutenção',
    },
  ];

  videos.forEach((video) => {
    const splittedUrl = video.link.split('/');
    const videoId = splittedUrl[splittedUrl.length - 1];

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    // eslint-disable-next-line no-param-reassign
    video.thumbnail = thumbnailUrl;
  });

  return (
    <>
      {iframeModalOpen && selectedIndex !== null && (
        <IFrameModal
          setModal={setIframeModalOpen}
          name={videos[selectedIndex].name}
          link={videos[selectedIndex].link}
        />
      )}
      <Style.Container>
        <h2>Tutoriais</h2>
        <Style.Wrapper>
          {videos.map((video, index) => (
            <Style.Card
              key={video.link}
              onClick={() => {
                setSelectedIndex(index);
                setIframeModalOpen(true);
              }}
            >
              <h5>{video.name}</h5>
              <img alt="" src={video.thumbnail} />
            </Style.Card>
          ))}
        </Style.Wrapper>
      </Style.Container>
    </>
  );
};
