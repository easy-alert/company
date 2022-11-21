// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';

// TYPES
import { ITextArea } from './utils/types';
// COMPONENTS
import { TextAreaContainer, LengthCounter } from './styles';

const TextAreaBase: ForwardRefRenderFunction<HTMLTextAreaElement, ITextArea> = (
  { label, height = '100px', maxLength, textLength, showTextLengthCounter = false, ...rest },
  ref,
) => (
  <TextAreaContainer height={height}>
    {label && <h6>{label}</h6>}
    <textarea maxLength={maxLength} ref={ref} {...rest} />
    {showTextLengthCounter && (
      <LengthCounter>
        <p className="p4">
          {textLength}/{maxLength}
        </p>
      </LengthCounter>
    )}
  </TextAreaContainer>
);
export const TextArea = forwardRef(TextAreaBase);
