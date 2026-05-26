import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BellIconProps {
  color?: string;
  size?: number;
}

const BellIcon = ({ color = '#374151', size = 24 }: BellIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 17H9M18 8.5C18 6.567 16.433 5 14.5 5H9.5C7.567 5 6 6.567 6 8.5V12L5 15H19L18 12V8.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 17C10 18.657 11.343 20 13 20C14.657 20 16 18.657 16 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default BellIcon;