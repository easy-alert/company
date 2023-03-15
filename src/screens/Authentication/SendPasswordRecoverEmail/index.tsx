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
import { sendPasswordRecoverEmailSchema } from './functions';

// TYPES
import { catchHandler } from '../../../utils/functions';

export const SendPasswordRecoverEmail = () => {
  const navigate = useNavigate();
  const [onQuery, setOnQuery] = useState<boolean>(false);

  return (
    <Style.Background>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={sendPasswordRecoverEmailSchema}
        onSubmit={async (values) => {
          setOnQuery(true);
          await Api.post('/BLABLABL', {
            email: values.email,
          })
            .then(() => {
              navigate('/login');
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
                  <h2>Recuperar senha</h2>
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
                <Button center label="Enviar" loading={onQuery} type="submit" />
              </Form>
            </Style.LoginContainer>
            <p className="p2">
              Já possui conta? <Link to="/login">Faça login</Link>
            </p>
          </>
        )}
      </Formik>
    </Style.Background>
  );
};
