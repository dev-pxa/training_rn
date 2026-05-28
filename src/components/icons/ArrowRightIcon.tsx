import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ArrowRightIconProps {
  color?: string;
  size?: number;
}

const ArrowRightIcon = ({ color = '#FFFFFF', size = 16 }: ArrowRightIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L15 12L9 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowRightIcon;
