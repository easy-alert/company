import * as s from './styles';

interface IOptions {
  label: string;
  disabled?: boolean;
  extraLabel: string;
  focused: boolean;
  onMouseEnter: () => void;
  onSelect: () => void;
}

export function Option({ focused, label, onMouseEnter, onSelect, extraLabel, disabled }: IOptions) {
  return (
    <s.OptionRowContainer
      focused={focused}
      disabled={disabled}
      onClick={onSelect}
      onMouseEnter={() => onMouseEnter()}
    >
      <s.OptionRow disabled={disabled}>
        <p className="p2">{label}</p>
        <p className="p3">{extraLabel}</p>
      </s.OptionRow>
    </s.OptionRowContainer>
  );
}
