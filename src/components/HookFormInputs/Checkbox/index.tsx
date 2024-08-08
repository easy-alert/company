// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';

// TYPES
import { IInput } from './types';

// COMPONENTS
import { ErrorMessage, InputContainer, CheckboxWrapper } from './styles';
import { theme } from '../../../styles/theme';

const FormCheckboxBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  {
    label,
    labelColor = theme.color.gray6,
    errorColor = theme.color.danger,
    name,
    error,
    disabled = false,
    marginTop = '0px',
    marginTopOnMedia = '0px',
    ...rest
  },
  ref,
) => (
  <InputContainer
    $error={!!error}
    $labelColor={labelColor}
    $marginTop={marginTop}
    $marginTopOnMedia={marginTopOnMedia}
  >
    <CheckboxWrapper $disabled={disabled}>
      <input type="checkbox" id={name} name={name} ref={ref} {...rest} disabled={disabled} />
      <label htmlFor={name}>{label}</label>
    </CheckboxWrapper>
    <ErrorMessage $errorColor={errorColor}>{!!error && <p className="p9">{error}</p>}</ErrorMessage>
  </InputContainer>
);
export const FormCheckbox = forwardRef(FormCheckboxBase);
