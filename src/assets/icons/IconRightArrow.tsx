import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconRightArrow = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 3L11 8L6 13"
        stroke="#B21D1D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomIcon>
);

export default IconRightArrow;
