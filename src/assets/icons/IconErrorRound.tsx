import CustomIcon from '@components/CustomIcon/CustomIcon';

import type { ICustomIcon } from '@components/CustomIcon/types';

const IconErrorRound = ({ ...rest }: ICustomIcon) => (
  <CustomIcon {...rest}>
    <svg viewBox="0 0 24 24" fill="none">
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M9 9L15 15M15 9L9 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  </CustomIcon>
);

export default IconErrorRound;
