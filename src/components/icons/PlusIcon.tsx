import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PlusIconProps {
  color?: string;
  size?: number;
}

const PlusIcon = ({ color = '#FFFFFF', size = 16 }: PlusIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 6V18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 12H18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PlusIcon;
