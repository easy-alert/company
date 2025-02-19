// STYLES
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBuildingByToken } from '@services/apis/getBuildingByToken';
import { confirmUser } from '@services/apis/confirmUser';
import * as Style from './styles';

// COMPONENTS
import { Button } from '../../../components/Buttons/Button';

// FUNCTIONS
import { requestConfirmData } from '../utils/functions';
import { query } from '../../../utils/functions';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';

export const EmailConfirm = () => {
  const navigate = useNavigate();
  const token = query.get('token');

  const [loading, setLoading] = useState<boolean>(true);

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [companyImage, setCompanyImage] = useState<string>('');

  const handleConfirmUser = async () => {
    if (!token) {
      return;
    }

    try {
      await confirmUser({ token });
      setIsConfirmed(true);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGetBuildingByToken = async () => {
      if (!token) {
        return;
      }

      try {
        const responseData = await getBuildingByToken({ token });

        const { name, image } = responseData;

        setCompanyName(name);
        setCompanyImage(image);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      handleGetBuildingByToken();
    }
  }, [token]);

  return loading ? (
    <Style.Container>
      <DotSpinLoading />
    </Style.Container>
  ) : (
    <Style.Container>
      {isConfirmed ? (
        <Style.Content>
          <img src={companyImage} alt="" />
          <h2>Cadastro de e-mail confirmado!</h2>

          <Style.ContentText>
            <p>Você é um usuário confirmado da empresa:</p>
            <span> {companyName}</span>
          </Style.ContentText>
        </Style.Content>
      ) : (
        <Style.Content>
          <img src={companyImage} alt="" />

          <h2>Confirmação de usuário</h2>

          <Style.ContentText>
            <p>
              Seu e-mail foi cadastrado na Easy Alert para ser um usuário confirmado da empresa:
            </p>
            <span> {companyName}</span>
            <p>Para confirmar seu cadastro clique no botão abaixo:</p>
            <Style.BottomContainer>
              <Button loading={loading} label="Confirmar" onClick={handleConfirmUser} />

              <span>
                Ao clicar em confirmar, você concorda com os{' '}
                <Link target="_blank" rel="noopener noreferrer" to="/terms">
                  Termos de Uso
                </Link>
                .
              </span>
            </Style.BottomContainer>
          </Style.ContentText>
        </Style.Content>
      )}
    </Style.Container>
  );
};
