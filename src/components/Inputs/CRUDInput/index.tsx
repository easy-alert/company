// TYPES
import { useState } from 'react';
import { IDataList } from './utils/types';
// COMPONENTS
import * as Style from './styles';
import { IconButton } from '../../Buttons/IconButton';
import { icon } from '../../../assets/icons';

export const CRUDInput = ({
  label,
  value,
  name,
  disabled,
  input: inputProps,
  select: selectProps,
  arrowColor,
}: IDataList) => {
  const [editing, setEditing] = useState(false);

  return (
    <Style.InputContainer selectPlaceholderValue={value}>
      <h6>{label}</h6>

      {!editing && selectProps.options.length ? (
        <select
          disabled={disabled}
          id={`select${name}`}
          name={`select${name}`}
          value={value}
          onChange={(evt) => {
            setEditing(true);

            if (evt.target.value === 'create') {
              selectProps.getEvtValue('');
            } else {
              selectProps.getEvtValue(evt.target.value);
            }
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${
                arrowColor || 'black'
              }' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
                <polyline points='6 9 12 15 18 9'/>
              </svg>`,
            )}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '16px',
          }}
        >
          <option value="" disabled hidden>
            Selecione
          </option>
          <option value="create">{selectProps.createLabel}</option>
          {selectProps.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <>
          {(value || selectProps.options.length > 0) && (
            <Style.IconContainer>
              <IconButton
                disabled={disabled}
                icon={icon.x}
                size="16px"
                onClick={() => {
                  setEditing(false);
                  inputProps.onXClick();
                }}
              />
            </Style.IconContainer>
          )}

          <input
            disabled={disabled}
            maxLength={inputProps.maxLength ?? 60}
            id={name}
            placeholder={inputProps.placeholder}
            value={value}
            name={name}
            onChange={(evt) => inputProps.getEvtValue(evt.target.value)}
            className="datalistStyle"
          />
        </>
      )}
    </Style.InputContainer>
  );
};
