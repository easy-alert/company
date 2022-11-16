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

export const EmailConfirm = () => {
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
            <h2>Seu cadastro como responsável foi confirmado!</h2>

            <Style.ContentText>
              <p>Agora você é um responsável pela edificação:</p>
              <span> {buildingName}</span>
            </Style.ContentText>

            <Button
              label="Fazer login"
              onClick={() => {
                navigate('/login');
              }}
            />
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
            <p>Seu e-mail foi cadastrado na Easy Alert para ser o responsável da edificação:</p>
            <span> {buildingName}</span>
            <p>Para confirmar seu cadastro como responsável clique no botão abaixo:</p>
          </Style.ContentText>

          <Button
            label="Confirmar"
            onClick={() => {
              requestConfirmData({
                token: token!,
                setIsConfirmed,
              });
            }}
          />
        </Style.Content>
      )}
    </Style.Container>
  );
};
