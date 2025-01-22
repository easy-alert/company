// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';

// HOOKS
import { useHasPermission } from '@hooks/useHasPermission';

// TYPES
import type { ITextArea } from './utils/types';

// COMPONENTS
import { TextAreaContainer, LengthCounter } from './styles';

const TextAreaBase: ForwardRefRenderFunction<HTMLTextAreaElement, ITextArea> = (
  {
    label,
    height = '100px',
    maxLength,
    textLength,
    showTextLengthCounter = false,
    permToCheck,
    ...rest
  },
  ref,
) => {
  const { hasPermission } = useHasPermission({ permToCheck: permToCheck ? [permToCheck] : [] });

  return (
    <TextAreaContainer height={height}>
      {label && <h6>{label}</h6>}
      <textarea
        maxLength={maxLength}
        ref={ref}
        disabled={!hasPermission || rest.disabled}
        {...rest}
      />
      {showTextLengthCounter && (
        <LengthCounter>
          <p className="p4">
            {textLength}/{maxLength}
          </p>
        </LengthCounter>
      )}
    </TextAreaContainer>
  );
};
export const TextArea = forwardRef(TextAreaBase);
