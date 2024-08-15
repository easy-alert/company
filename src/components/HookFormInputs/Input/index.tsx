// LIBS
import { forwardRef, ForwardRefRenderFunction, useState } from 'react';

// TYPES
import { IInput } from './types';

// COMPONENTS
import { ErrorMessage, InputContainer, PasswordDiv } from './styles';
import { theme } from '../../../styles/theme';
import { icon } from '../../../assets/icons';
import { IconButton } from '../../Buttons/IconButton';

const FormInputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  {
    label,
    labelColor = theme.color.gray6,
    errorColor = theme.color.danger,
    name,
    error,
    removeStyles = false,
    step = 'any',
    max,
    type,
    passwordShowToggle,
    ...rest
  },
  ref,
) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  let maxDate;

  switch (type) {
    case 'date':
      maxDate = '9999-12-31';
      break;

    case 'datetime-local':
      maxDate = '9999-12-31T22:22:22';
      break;

    default:
      break;
  }

  return (
    <InputContainer $error={!!error} $labelColor={labelColor} $removeStyles={removeStyles}>
      {label && <h6>{label}</h6>}
      <PasswordDiv>
        <input
          autoComplete="off"
          type={showPassword ? 'text' : type}
          id={name}
          name={name}
          ref={ref}
          step={step}
          max={max ?? maxDate}
          {...rest}
        />
        {passwordShowToggle && (
          <IconButton
            tabIndex={-1}
            icon={icon.eye}
            size="20px"
            onClick={() => {
              setShowPassword((prevState) => !prevState);
            }}
            opacity={showPassword ? '1' : '0.4'}
          />
        )}
      </PasswordDiv>
      {!!error && (
        <ErrorMessage $errorColor={errorColor}>
          <p className="p4">{error}</p>
        </ErrorMessage>
      )}
    </InputContainer>
  );
};
export const FormInput = forwardRef(FormInputBase);
