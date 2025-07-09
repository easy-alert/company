// REACT
import { useState } from 'react';

// COMPONENTS
import { IconButton } from '../../Buttons/IconButton';

// ASSETS
import { icon } from '../../../assets/icons';

// STYLES
import * as Style from './styles';

// TYPES
import type { IDataList } from './utils/types';

export const CRUDInput = ({
  label,
  value,
  name,
  disabled,
  input: inputProps,
  select: selectProps,
  arrowColor,
}: IDataList) => {
  const hasInitialValue =
    !!value &&
    selectProps.options.some((option) => option.label === value || option.value === value);

  const [editing, setEditing] = useState(!hasInitialValue);

  return (
    <Style.InputContainer selectPlaceholderValue={value}>
      <h6>{label}</h6>

      {!editing && selectProps.options.length ? (
        <select
          disabled={disabled}
          id={`select${name}`}
          name={`select${name}`}
          value={
            // If value is a label, find the corresponding value
            selectProps.options.find((option) => option.label === value)?.value || value
          }
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
