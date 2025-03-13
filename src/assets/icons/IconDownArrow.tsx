import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconDownArrow = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.5 9L12 16.5L4.5 9"
        stroke="#B21D1D"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomIcon>
);

export default IconDownArrow;
