// LIBS
import { forwardRef, ForwardRefRenderFunction } from 'react';

// TYPES
import { TextAreaProps } from './types';
// COMPONENTS
import { ErrorMessage, TextAreaContainer, LengthCounter } from './styles';

const FormTextAreaBase: ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (
  { label, textLength, showTextLengthCounter, name, error, maxLength, height = '100px', ...rest },
  ref,
) => (
  <TextAreaContainer $error={!!error} $height={height}>
    {label && <h6>{label}</h6>}

    <textarea maxLength={maxLength} id={name} name={name} ref={ref} {...rest} />
    {showTextLengthCounter && (
      <LengthCounter>
        <p className="p4">
          {textLength}/{maxLength}
        </p>
      </LengthCounter>
    )}
    <ErrorMessage>{!!error && <p className="p9">{error}</p>}</ErrorMessage>
  </TextAreaContainer>
);
export const FormTextArea = forwardRef(FormTextAreaBase);
