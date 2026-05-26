import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CupIconProps {
  color?: string;
  size?: number;
}

const CupIcon = ({ color = '#FFFFFF', size = 16 }: CupIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 19L7 21H17L18 19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 8H20L19 21H5L4 8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 11C9 11 10 13 12 13C14 13 15 11 15 11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M20 8C20 8 21.5 8.5 21.5 11C21.5 13.5 20 14 20 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CupIcon;