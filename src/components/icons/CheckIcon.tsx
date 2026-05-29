import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CheckIconProps {
  color?: string;
  size?: number;
}

const CheckIcon = ({ color = '#FFFFFF', size = 14 }: CheckIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17L4 12"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CheckIcon;
