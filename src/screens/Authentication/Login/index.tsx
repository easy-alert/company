// LIBS
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';

// COMPONENTS
import { Api } from '../../../services/api';
import { Button } from '../../../components/Buttons/Button';
import { FormikInput } from '../../../components/Form/FormikInput';

// STYLES
import * as Style from './styles';
import { theme } from '../../../styles/theme';

// ICONS
import { icon } from '../../../assets/icons';

// FUNCTIONS
import { schema } from './functions';

// CONTEXTS
import { useAuthContext } from '../../../contexts/Auth/UseAuthContext';

// TYPES
import { IFormData } from './types';
import { catchHandler } from '../../../utils/functions';
import { IconButton } from '../../../components/Buttons/IconButton';

export const Login = () => {
  const navigate = useNavigate();
  const { signin } = useAuthContext();
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const [viewedTutorial, setViewedTutorial] = useState<boolean>(true);

  // useEffect(() => {
  //   if (
  //     !localStorage.getItem('viewedTutorial') ||
  //     localStorage.getItem('viewedTutorial') === 'false'
  //   ) {
  //     localStorage.setItem('viewedTutorial', 'false');
  //     setViewedTutorial(false);
  //   }
  // }, []);

  return (
    <Style.Background>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={schema}
        onSubmit={async (data: IFormData) => {
          setOnQuery(true);
          setShowPassword(false);
          await Api.post('/auth/login', {
            email: data.email,
            password: data.password,
          })
            .then((res) => {
              signin(res.data);
              navigate('/account');

              // if (!viewedTutorial) {
              //   navigate('/tutorials', { state: { from: 'login' } });
              // } else {
              //   navigate('/dashboard');
              // }
            })
            .catch((err) => {
              setOnQuery(false);
              catchHandler(err);
            });
        }}
      >
        {({ errors, values, touched }) => (
          <>
            <img src={icon.logoTextWhite} alt="" />

            <Style.LoginContainer>
              <Form>
                <Style.InputWrapper>
                  <h2>Login/Company</h2>

                  <FormikInput
                    labelColor={theme.color.white}
                    errorColor={theme.color.white}
                    name="email"
                    label="E-mail"
                    placeholder="Insira seu e-mail"
                    value={values.email}
                    error={touched.email && errors.email ? errors.email : null}
                  />

                  <Style.PasswordDiv>
                    <FormikInput
                      labelColor={theme.color.white}
                      errorColor={theme.color.white}
                      name="password"
                      label="Senha"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      placeholder="Insira sua senha"
                      error={touched.password && errors.password ? errors.password : null}
                    />

                    <IconButton
                      icon={showPassword ? icon.eye : icon.eyeGray}
                      size="20px"
                      onClick={() => {
                        setShowPassword((prevState) => !prevState);
                      }}
                      opacity="1"
                    />
                  </Style.PasswordDiv>
                </Style.InputWrapper>

                <Style.ButtonContainer loading={+onQuery}>
                  <Link style={{ pointerEvents: onQuery ? 'none' : 'auto' }} to="/register">
                    Cadastrar
                  </Link>

                  <Button label="Login" loading={onQuery} type="submit" />
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
