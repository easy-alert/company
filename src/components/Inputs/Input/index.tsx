// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';

// HOOKS
import { useHasPermission } from '@hooks/useHasPermission';

// TYPES
import type { IInput } from './utils/types';

// COMPONENTS
import { InputContainer } from './styles';

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  { label, name, type = 'text', typeDatePlaceholderValue, max, permToCheck, ...rest },
  ref,
) => {
  const { hasPermission } = useHasPermission({ permToCheck: permToCheck ? [permToCheck] : [] });

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
    <InputContainer type={type} typeDatePlaceholderValue={typeDatePlaceholderValue}>
      <h6>{label}</h6>
      <input
        max={max ?? maxDate}
        type={type}
        id={name}
        name={name}
        ref={ref}
        disabled={!hasPermission || rest.disabled}
        {...rest}
      />
    </InputContainer>
  );
};
export const Input = forwardRef(InputBase);
