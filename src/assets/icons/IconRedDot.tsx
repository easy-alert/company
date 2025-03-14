import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconRedDot = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#B21D1D" />
    </svg>
  </CustomIcon>
);

export default IconRedDot;
