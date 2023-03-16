// LIBS
import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Api } from '../../services/api';

// CONTEXTS
import { AuthContext } from './AuthContext';

// COMPONENTS
import { DotSpinLoading } from '../../components/Loadings/DotSpinLoading';
import { catchHandler, query } from '../../utils/functions';

export const RequireAuth = () => {
  const { setAccount, signin } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
      })
      .catch(() => navigate('/login'));
  };

  useEffect(() => {
    if (backofficeToken && userId) {
      requestAccessToCompanyUser();
    } else if (localStorage.getItem('authToken')) {
      validateToken();
    } else {
      navigate('/login');
    }
  }, []);

  return loading ? <DotSpinLoading label="Verificando credenciais" /> : <Outlet />;
};
