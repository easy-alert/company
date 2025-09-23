// LIBS
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// CONTEXT
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// HOOKS
import { useQuery } from '@hooks/useQuery';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// STYLES
import { loginWithCompany } from '@services/apis/loginWithCompany';
import * as Style from './styles';

interface ILocationState {
  userId: string;
  Companies: {
    id: string;
    name: string;
    image: string;
  }[];
}

export const SelectCompany = () => {
  const { signin } = useAuthContext();

  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, Companies } = (location.state as ILocationState) || {};

  if (!userId && !Companies) {
    navigate('/login');
  }

  const [onQuery, setOnQuery] = useState<boolean>(false);

  const redirect = query.get('redirect');

  const handleLoginCompany = async (companyId: string) => {
    console.log('🚀 ~ handleLoginCompany ~ companyId:', companyId);
    setOnQuery(true);

    try {
      const responseData = await loginWithCompany({
        companyId,
        userId,
      });

      if (responseData) {
        signin(responseData);
        navigate(redirect || '/home');
      }
    } finally {
      setOnQuery(false);
    }
  };

  return (
    <Style.Background>
      <img src={icon.logoTextWhite} alt="" data-testid="logo-img" />

      <Style.LoginContainer>
        <Style.InputWrapper>
          <h2 data-testid="select-company-title">Selecione sua empresa:</h2>

          <Style.CompanyCardContainer>
            {Companies?.map((company) => (
              <Style.CompanyCard key={company.id} onClick={() => handleLoginCompany(company.id)}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Style.CompanyImage src={company.image} alt={company.name} />
                  <Style.CompanyName>{company.name}</Style.CompanyName>
                </div>

                <div>{onQuery && <Style.SpinnerContent />}</div>
              </Style.CompanyCard>
            ))}
          </Style.CompanyCardContainer>
        </Style.InputWrapper>
      </Style.LoginContainer>
    </Style.Background>
  );
};
