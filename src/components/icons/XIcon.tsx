import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface XIconProps {
  color?: string;
  size?: number;
}

const XIcon = ({ color = '#4B5563', size = 20 }: XIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default XIcon;
