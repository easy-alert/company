import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconPlus = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <path
      d="M2.5 8H13.5"
      stroke="#B21D1D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M8 2.5V13.5"
      stroke="#B21D1D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </CustomIcon>
);

export default IconPlus;
