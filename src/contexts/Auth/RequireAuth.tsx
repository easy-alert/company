// LIBS
import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Api } from '../../services/api';

// CONTEXTS
import { AuthContext } from './AuthContext';

// COMPONENTS
import { DotSpinLoading } from '../../components/Loadings/DotSpinLoading';

export const RequireAuth = () => {
  const { setAccount } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const validateToken = async () => {
    await Api.get('/auth/validate/token')
      .then((res) => {
        setAccount(res.data);
        setLoading(false);
      })
      .catch(() => navigate('/login'));
  };

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      validateToken();
    } else {
      navigate('/login');
    }
  }, []);

  return loading ? <DotSpinLoading label="Verificando credenciais" /> : <Outlet />;
};
