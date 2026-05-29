import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LogoIconProps {
  color?: string;
  size?: number;
}

const LogoIcon = ({ color = '#FFFFFF', size = 64 }: LogoIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      fill={color}
      fillOpacity="0.9"
    />
    <Path
      d="M2 17L12 22L22 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12L12 17L22 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default LogoIcon;
