// LIBS
import { forwardRef, ForwardRefRenderFunction, useState } from 'react';
import { Field } from 'formik';

// TYPES
import { IInput } from './utils/types';

// COMPONENTS
import { ErrorMessage, InputContainer, PasswordDiv } from './styles';
import { theme } from '../../../styles/theme';
import { IconButton } from '../../Buttons/IconButton';
import { icon } from '../../../assets/icons';

const FormikInputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  {
    containerDataTestId,
    inputDataTestId,
    errorDataTestId,
    label,
    labelColor = theme.color.gray5,
    errorColor = theme.color.danger,
    name,
    error,
    max,
    type = 'text',
    typeDatePlaceholderValue,
    passwordPlaceholder,
    passwordShowToggle,
    ...rest
  },
  ref,
) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <InputContainer
      data-testid={containerDataTestId}
      type={type}
      error={!!error}
      passwordPlaceholder={passwordPlaceholder}
      typeDatePlaceholderValue={typeDatePlaceholderValue}
      labelColor={labelColor}
    >
      {label && <h6>{label}</h6>}

      <PasswordDiv>
        <Field
          data-testid={inputDataTestId}
          max={type === 'date' && !max ? '9999-12-31' : max}
          type={showPassword ? 'text' : type}
          id={name}
          name={name}
          ref={ref}
          {...rest}
        />
        {passwordShowToggle && (
          <IconButton
            icon={showPassword ? icon.eye : icon.eyeGray}
            size="20px"
            onClick={() => {
              setShowPassword((prevState) => !prevState);
            }}
            opacity="1"
          />
        )}
      </PasswordDiv>

      <ErrorMessage data-testid={errorDataTestId} errorColor={errorColor}>
        {!!error && <p className="p3">{error}</p>}
      </ErrorMessage>
    </InputContainer>
  );
};

export const FormikInput = forwardRef(FormikInputBase);
