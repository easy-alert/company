// REACT
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// LIBS
import { Formik, Form } from 'formik';

// SERVICES
import { Api } from '@services/api';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { FormikInput } from '@components/Form/FormikInput';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL ICONS
import { icon } from '@assets/icons';

// GLOBAL FUNCTIONS
import { handleToastify } from '@utils/toastifyResponses';

// FUNCTIONS
import { sendPasswordRecoverEmailSchema } from './functions';

// STYLES
import * as Style from './styles';

export const SendPasswordRecoverEmail = () => {
  const navigate = useNavigate();
  const [onQuery, setOnQuery] = useState<boolean>(false);

  const originPath = window.location.origin;

  return (
    <Style.Background>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={sendPasswordRecoverEmailSchema}
        onSubmit={async (values) => {
          setOnQuery(true);
          await Api.post('/passwordrecovery/sendemail', {
            email: values.email,
            link: `${originPath}/passwordrecovery/change`,
          })
            .then((res) => {
              handleToastify(res);
              navigate('/login');
            })
            .catch((err) => {
              setOnQuery(false);
              handleToastify(err.response);
            });
        }}
      >
        {({ errors, values, touched }) => (
          <>
            <img src={icon.logoTextWhite} alt="" data-testid="company-logo" />
            <Style.LoginContainer>
              <Form>
                <Style.InputWrapper>
                  <h2 data-testid="recover-password">Recuperar senha</h2>
                  <FormikInput
                    labelColor={theme.color.white}
                    errorColor={theme.color.white}
                    name="email"
                    label="E-mail"
                    placeholder="Informe o e-mail da sua conta"
                    value={values.email}
                    error={touched.email && errors.email ? errors.email : null}
                  />
                </Style.InputWrapper>
                <Button
                  center
                  label="Enviar"
                  loading={onQuery}
                  type="submit"
                  data-testid="toSend-button"
                />
              </Form>
            </Style.LoginContainer>
            <p className="p2">
              Já possui conta?{' '}
              <Link to="/login" data-testid="login-link">
                Faça login
              </Link>
            </p>
          </>
        )}
      </Formik>
    </Style.Background>
  );
};
