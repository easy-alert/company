// REACT
import { forwardRef, ForwardRefRenderFunction, useState } from 'react';

// LIBS
import { Field } from 'formik';

// GLOBAL STYLES
import { theme } from '@styles/theme';

// GLOBAL ASSETS
import IconEye from '@assets/icons/IconEye';

// COMPONENTS
import { IconButton } from '../../Buttons/IconButton';

// TYPES
import type { IInput } from './utils/types';

// COMPONENTS
import { ErrorMessage, InputContainer, PasswordDiv } from './styles';

const FormikInputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  {
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
      data-testid={`${name}-container`}
      type={type}
      error={!!error}
      passwordPlaceholder={passwordPlaceholder}
      typeDatePlaceholderValue={typeDatePlaceholderValue}
      labelColor={labelColor}
    >
      {label && <h6>{label}</h6>}

      <PasswordDiv>
        <Field
          data-testid={`${name}-input`}
          max={type === 'date' && !max ? '9999-12-31' : max}
          type={showPassword ? 'text' : type}
          id={name}
          name={name}
          ref={ref}
          {...rest}
        />
        {passwordShowToggle && (
          <IconButton
            data-testid="view-password"
            icon={<IconEye strokeColor={showPassword ? 'primary' : 'gray4'} />}
            size="20px"
            onClick={() => setShowPassword((prevState) => !prevState)}
          />
        )}
      </PasswordDiv>

      <ErrorMessage data-testid={`${name}-error`} errorColor={errorColor}>
        {!!error && <p className="p3">{error}</p>}
      </ErrorMessage>
    </InputContainer>
  );
};

export const FormikInput = forwardRef(FormikInputBase);
