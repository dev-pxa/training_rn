import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ChartIconProps {
  color?: string;
  size?: number;
  opacity?: number;
}

const ChartIcon = ({ color = '#FFFFFF', size = 64, opacity = 0.3 }: ChartIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={opacity}>
    <Path
      d="M9 19V5M15 19V11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M3 19H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M5 19V13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default ChartIcon;