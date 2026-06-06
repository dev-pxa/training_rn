import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface SkipPrevIconProps {
  color?: string;
  size?: number;
}

const SkipPrevIcon = ({ color = '#FFFFFF', size = 24 }: SkipPrevIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="3" height="16" fill={color} />
    <Path
      d="M7.5 12L16 18V6L7.5 12Z"
      fill={color}
    />
  </Svg>
);

export default SkipPrevIcon;
