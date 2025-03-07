// LIBS
import { useNavigate } from 'react-router-dom';

// GLOBAL ASSETS
import IconLeftArrow from '@assets/icons/leftArrow';

// COMPONENTS
import { Image } from '../../Image';
import { Background } from './styles';

export const ReturnButton = ({ path }: { path?: string }) => {
  const navigate = useNavigate();

  return (
    <Background
      onClick={() => {
        if (path) {
          navigate(path);
        } else {
          navigate(-1);
        }
      }}
    >
      <Image img={<IconLeftArrow strokeColor="primary" />} size="16px" fill="primary" />
      <h6>Voltar</h6>
    </Background>
  );
};
