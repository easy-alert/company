// REACT
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// LIBS
import styled from 'styled-components';

// GLOBAL CONTEXTS
import { AuthContext } from '@contexts/Auth/AuthContext';
import { useCustomTheme } from '@contexts/ThemeContext';

// GLOBAL SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

// GLOBAL UTILS
import { catchHandler, query } from '@utils/functions';

// TYPES
import { IRequireAuth } from './utils/types';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;

export const RequireAuth = ({ children }: IRequireAuth) => {
  const { setAccount, signin, signout } = useContext(AuthContext);
  const { updateThemeColor } = useCustomTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(true);

  const backofficeToken = query.get('backofficeToken') ?? null;
  const userId = query.get('userId') ?? null;
  const encodeRedirectUri = encodeURIComponent(location.pathname + location.search);

  const requestAccessToCompanyUser = async () => {
    await Api.post('/auth/backofficeaccess', {
      userId,
      backofficeToken,
    })
      .then(async (res) => {
        signin(res.data);
        updateThemeColor(res?.data?.Account?.User?.colorScheme);
        setLoading(false);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  const validateToken = async () => {
    await Api.get('/auth/validate/token')
      .then(async (res) => {
        setAccount(res.data);
        updateThemeColor(res?.data?.User?.colorScheme);
        setLoading(false);
        localStorage.setItem('user', res.data.User.name);
      })
      .catch(() => {
        signout();
        navigate(`/login?redirect=${encodeRedirectUri}`);
      });
  };

  useEffect(() => {
    function checkUserData() {
      const tokenHasChanged = localStorage.getItem('authToken');

      if (tokenHasChanged) {
        validateToken();
        navigate('/account');
      }
    }

    window.addEventListener('storage', checkUserData);

    return () => {
      window.removeEventListener('storage', checkUserData);
    };
  }, []);

  useEffect(() => {
    if (backofficeToken && userId) {
      requestAccessToCompanyUser();
    } else if (localStorage.getItem('authToken')) {
      validateToken();
    } else {
      navigate(`/login?redirect=${encodeRedirectUri}`);
    }
  }, []);

  return loading ? (
    <Container>
      <DotSpinLoading label="Verificando credenciais" />
    </Container>
  ) : (
    children
  );
};
