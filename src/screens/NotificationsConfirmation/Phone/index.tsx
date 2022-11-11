// STYLES
import { useNavigate } from 'react-router-dom';
import * as Style from './styles';

// COMPONENTS
import { Button } from '../../../components/Buttons/Button';
import { icon } from '../../../assets/icons';

// FUNCTIONS
import { requestConfirmPhone } from './utils/functions';
import { query } from '../../../utils/functions';

export const PhoneConfirm = () => {
  const navigate = useNavigate();
  const token = query.get('token');

  return (
    <Style.Container>
      <img src={icon.logoTextBlack} alt="" />
      <h3>Confirme seu número do WhatsApp</h3>
      <Button
        label="Confirmar"
        onClick={() => {
          requestConfirmPhone({ token: token!, navigate });
        }}
      />
    </Style.Container>
  );
};
