import ReactSwitch from 'react-switch';
import { ISwitchButton } from './utils/types';
import { theme } from '../../../styles/theme';

export const Switch = ({ disabled, onChange, checked }: ISwitchButton) => (
  <ReactSwitch
    disabled={disabled}
    onChange={onChange}
    checked={checked}
    onColor={theme.color.dangerL}
    offColor={theme.color.dangerL}
    onHandleColor={theme.color.primary}
    offHandleColor={theme.color.primary}
    handleDiameter={16}
    uncheckedIcon={false}
    checkedIcon={false}
    boxShadow="0px 0px 2px rgba(0, 0, 0, 1)"
    height={12}
    width={28}
  />
);
