import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconInfo = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <svg viewBox="0 0 24 24">
      <g id="">
        <circle cx="12" cy="12" r="10" stroke="" strokeWidth="1.5" />
        <path d="M12 17V11" stroke="" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="" />
      </g>
    </svg>
    ;
  </CustomIcon>
);

export default IconInfo;
