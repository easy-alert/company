import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';

// CONTEXT
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// HOOKS
import { useQuery } from '@hooks/useQuery';

// SERVICES
import { loginCompany } from '@services/apis/loginCompany';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';

// GLOBAL UTILS
import { applyMask, unMask } from '@utils/functions';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL ASSETS
import logoWhite from '@assets/images/logoWhite.png';

// STYLES
import * as Style from './styles';

// UTILS
import { schema } from './functions';

// TYPES
import type { IFormData } from './types';

export const Login = () => {
  const { signin } = useAuthContext();

  const query = useQuery();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const redirect = query.get('redirect');

  const handleLoginCompany = async (data: IFormData) => {
    setOnQuery(true);
    setShowPassword(false);

    let formattedLogin = data.login;

    if (data.login.match(/^\(\d{2}\) \d{5}-\d{4}$/)) {
      formattedLogin = unMask(data.login);
    }

    try {
      const responseData = await loginCompany({
        login: formattedLogin,
        password: data.password,
      });

      if (responseData) {
        signin(responseData);

        if (responseData?.Companies && responseData?.Companies?.length > 1) {
          navigate('/select-company', {
            state: { userId: responseData.userId, Companies: responseData.Companies },
          });
        } else {
          navigate(redirect || '/home');
        }
      }
    } finally {
      setOnQuery(false);
    }
  };

  return (
    <Style.Background>
      <Style.LeftSide />

      <Style.RightSide>
        <img src={logoWhite} alt="Logo" />
        <h2>Tornamos o desafio com manutenções, em seu maior diferencial!</h2>
        <Formik
          initialValues={{ email: '', login: '', password: '' }}
          validationSchema={schema}
          onSubmit={async (data: IFormData) => handleLoginCompany(data)}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <Style.InputWrapper>
                <FormikInput
                  name="login"
                  label="E-mail/Telefone"
                  placeholder="Insira seu e-mail ou telefone"
                  maxLength={values.login.match(/^\(\d{2}\) \d{5}-\d{4}$/) ? 11 : 100}
                  value={values.login}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/[@a-zA-Z]/.test(value)) {
                      setFieldValue('login', unMask(value));
                    } else {
                      setFieldValue('login', applyMask({ value, mask: 'TEL' }).value);
                    }
                  }}
                  error={touched.login && errors.login ? errors.login : null}
                  labelColor={theme.color.white}
                  errorColor={theme.color.white}
                />

                <FormikInput
                  name="password"
                  label="Senha"
                  placeholder="Insira sua senha"
                  type={showPassword ? 'text' : 'password'}
                  passwordShowToggle
                  value={values.password}
                  error={touched.password && errors.password ? errors.password : null}
                  labelColor={theme.color.white}
                  errorColor={theme.color.white}
                />
              </Style.InputWrapper>
              <Button
                label="Acesse sua conta"
                type="submit"
                loading={onQuery}
                data-testid="login-button"
                center
              />
              <Style.RecoverPassword>
                <span>Esqueceu sua senha? </span>
                <Link to="/passwordrecover/sendemail" data-testid="recover-password">
                  Recuperar senha
                </Link>
              </Style.RecoverPassword>
              {/* <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Link
                  to="/register"
                  data-testid="register-link"
                  style={{
                    color: '#fff',
                    textDecoration: 'underline',
                    pointerEvents: onQuery ? 'none' : 'auto',
                    opacity: onQuery ? 0.6 : 1,
                  }}
                >
                  Cadastrar
                </Link>
              </div> */}
            </Form>
          )}
        </Formik>
      </Style.RightSide>
    </Style.Background>
  );
};
