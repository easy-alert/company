import { Modal } from '../../components/Modal';
import * as Style from './styles';

interface IIFrameModal {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  link: string;
  name: string;
}

function convertYouTubeLink(url: string) {
  const videoId = url.split('https://youtu.be/')[1];
  return `https://www.youtube.com/embed/${videoId}`;
}

export const IFrameModal = ({ setModal, link, name }: IIFrameModal) => (
  <Modal setModal={setModal} title={name} bodyWidth="900px">
    <Style.Iframe src={convertYouTubeLink(link)} />
  </Modal>
);
