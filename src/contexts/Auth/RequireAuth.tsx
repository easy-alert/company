// REACT
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// LIBS
import styled from 'styled-components';

// GLOBAL CONTEXTS
import { AuthContext } from '@contexts/Auth/AuthContext';

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
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);

  const backofficeToken = query.get('backofficeToken') ?? null;
  const userId = query.get('userId') ?? null;

  const requestAccessToCompanyUser = async () => {
    await Api.post('/auth/backofficeaccess', {
      userId,
      backofficeToken,
    })
      .then((res) => {
        signin(res.data);
        setLoading(false);
      })
      .catch((err) => {
        catchHandler(err);
      });
  };

  const validateToken = async () => {
    await Api.get('/auth/validate/token')
      .then((res) => {
        setAccount(res.data);
        setLoading(false);
        localStorage.setItem('user', res.data.User.name);
      })
      .catch(() => {
        signout();
        navigate('/login');
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
      navigate('/login');
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
