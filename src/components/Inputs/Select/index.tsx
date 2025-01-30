// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';

// HOOKS
import { useHasPermission } from '@hooks/useHasPermission';

// TYPES
import type { ISelect } from './utils/types';

// COMPONENTS
import { SelectContainer } from './styles';

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, ISelect> = (
  { label, name, selectPlaceholderValue = '', permToCheck, ...rest },
  ref,
) => {
  const { hasPermission } = useHasPermission({ permToCheck: permToCheck ? [permToCheck] : [] });

  return (
    <SelectContainer selectPlaceholderValue={selectPlaceholderValue}>
      {label && <h6>{label}</h6>}
      <select
        id={name}
        name={name}
        ref={ref}
        disabled={!hasPermission || rest.disabled}
        {...rest}
      />
    </SelectContainer>
  );
};

export const Select = forwardRef(SelectBase);
