// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';

// TYPES
import { IInput } from './types';

// COMPONENTS
import { ErrorMessage, InputContainer, RadioWrapper } from './styles';
import { theme } from '../../../styles/theme';

const FormRadioBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  {
    label,
    labelColor = theme.color.gray6,
    errorColor = theme.color.danger,
    name,
    error,
    disabled = false,
    marginTop = '0px',
    ...rest
  },
  ref,
) => (
  <InputContainer $error={!!error} $labelColor={labelColor} $marginTop={marginTop}>
    <RadioWrapper $disabled={disabled}>
      <input type="radio" id={name} name={name} ref={ref} disabled={disabled} {...rest} />
      {label}
    </RadioWrapper>
    <ErrorMessage $errorColor={errorColor}>{!!error && <p className="p9">{error}</p>}</ErrorMessage>
  </InputContainer>
);
export const FormRadio = forwardRef(FormRadioBase);
