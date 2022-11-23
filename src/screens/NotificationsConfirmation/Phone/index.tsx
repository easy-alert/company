// STYLES
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as Style from './styles';

// COMPONENTS
import { Button } from '../../../components/Buttons/Button';
import { icon } from '../../../assets/icons';

// FUNCTIONS
import { requestConfirmData, requestGetBuildingName } from '../utils/functions';
import { query } from '../../../utils/functions';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';

export const PhoneConfirm = () => {
  const navigate = useNavigate();
  const token = query.get('token');

  const [loading, setLoading] = useState<boolean>(true);

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [buildingName, setBuildingName] = useState<string>('');

  useEffect(() => {
    requestGetBuildingName({ setBuildingName, setLoading, token: token! });
  }, []);

  return loading ? (
    <Style.Container>
      <DotSpinLoading />
    </Style.Container>
  ) : (
    <Style.Container>
      {isConfirmed ? (
        <>
          <Style.Content>
            <img src={icon.logoRed} alt="" />
            <h2>Cadastro de WhatsApp confirmado!</h2>

            <Style.ContentText>
              <p>Agora você é responsável pela edificação:</p>
              <span> {buildingName}</span>
            </Style.ContentText>
          </Style.Content>
          <Style.ImageContainer>
            <img src={icon.confirmedContactLogo} alt="" />
          </Style.ImageContainer>
        </>
      ) : (
        <Style.Content>
          <img src={icon.logoRed} alt="" />
          <h2>Confirmação de responsável</h2>

          <Style.ContentText>
            <p>Seu WhatsApp foi cadastrado na Easy Alert para ser o responsável da edificação:</p>
            <span> {buildingName}</span>
            <p>Para confirmar seu cadastro clique no botão abaixo:</p>
          </Style.ContentText>

          <Button
            label="Confirmar"
            onClick={() => {
              requestConfirmData({
                token: token!,
                setIsConfirmed,
                navigate,
              });
            }}
          />
        </Style.Content>
      )}
    </Style.Container>
  );
};
