// LIBS
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';

// CONTEXT
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

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
import { icon } from '@assets/icons';

// STYLES
import { IconButton } from '@components/Buttons/IconButton';
import * as Style from './styles';

// UTILS
import { schema } from './functions';

// TYPES
import type { IFormData } from './types';

export const Login = () => {
  const { signin } = useAuthContext();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const [onQuery, setOnQuery] = useState<boolean>(false);

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
        navigate('/dashboard');
      }
    } finally {
      setOnQuery(false);
    }
  };

  return (
    <Style.Background>
      <img src={icon.logoTextWhite} alt="" />

      <Formik
        initialValues={{ email: '', login: '', password: '' }}
        validationSchema={schema}
        onSubmit={async (data: IFormData) => handleLoginCompany(data)}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Style.LoginContainer>
              <Form>
                <Style.InputWrapper>
                  <h2>Login/Company</h2>

                  <FormikInput
                    name="login"
                    label="E-mail/Telefone"
                    placeholder="Insira seu e-mail ou telefone"
                    maxLength={values.login.match(/^\(\d{2}\) \d{5}-\d{4}$/) ? 11 : 100}
                    value={values.login}
                    onChange={(e) => {
                      const { value } = e.target;

                      if (/^\d/.test(value) || (value.length > 1 && /^\(\d{1}/.test(value))) {
                        setFieldValue('login', applyMask({ value, mask: 'TEL' }).value);
                      } else {
                        setFieldValue('login', value);
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

                  <Style.AccordionContainer>
                    <Style.AccordionHeader onClick={() => setShowInfo(!showInfo)}>
                      <Style.AccordionHeaderTitle>Primeiro Acesso</Style.AccordionHeaderTitle>

                      <IconButton
                        icon={showInfo ? icon.arrowUpPrimary : icon.arrowDownPrimary}
                        size="16px"
                        onClick={() => setShowInfo(!showInfo)}
                      />
                    </Style.AccordionHeader>

                    <Style.AccordionContent isOpen={showInfo}>
                      <Style.AccordionContentText>
                        Caso seja seu primeiro acesso, utilize seu email/telefone e a senha padrão
                        <strong>&#39;123456789&#39;</strong> para acessar o sistema.
                      </Style.AccordionContentText>

                      <Style.AccordionContentObservation>
                        OBS: lembre-se de trocar a senha na tela de configurações
                      </Style.AccordionContentObservation>
                    </Style.AccordionContent>
                  </Style.AccordionContainer>
                </Style.InputWrapper>

                <Style.ButtonContainer loading={+onQuery}>
                  <Link style={{ pointerEvents: onQuery ? 'none' : 'auto' }} to="/register">
                    Cadastrar
                  </Link>

                  <Button label="Login" type="submit" loading={onQuery} />
                </Style.ButtonContainer>
              </Form>
            </Style.LoginContainer>

            <p className="p2">
              Esqueceu sua senha? <Link to="/passwordrecover/sendemail">Recuperar senha</Link>
            </p>
          </>
        )}
      </Formik>
    </Style.Background>
  );
};
