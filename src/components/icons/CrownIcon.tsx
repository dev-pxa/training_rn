import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CrownIconProps {
  color?: string;
  size?: number;
}

const CrownIcon = ({ color = '#FFFFFF', size = 16 }: CrownIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 16H19L18 20H6L5 16Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CrownIcon;
