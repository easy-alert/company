// GLOBAL COMPONENTS
import { Modal } from '@components/Modal';

// STYLES
import * as Style from './styles';

interface IIFrameModal {
  link: string;
  name: string;
  handleIFrameModal: (modalState: boolean) => void;
}

function convertYouTubeLink(url: string) {
  const videoId = url.split('https://youtu.be/')[1];
  return `https://www.youtube.com/embed/${videoId}`;
}

export const IFrameModal = ({ link, name, handleIFrameModal }: IIFrameModal) => (
  <Modal setModal={handleIFrameModal} title={name} bodyWidth="900px">
    <Style.IFrame src={convertYouTubeLink(link)} />
  </Modal>
);
