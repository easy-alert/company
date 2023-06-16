// LIBS
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
}: IDataList) => {
  const [editing, setEditing] = useState(false);

  return (
    <Style.InputContainer>
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
          <input
            disabled={disabled}
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
