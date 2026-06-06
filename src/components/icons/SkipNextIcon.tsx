import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface SkipNextIconProps {
  color?: string;
  size?: number;
}

const SkipNextIcon = ({ color = '#FFFFFF', size = 24 }: SkipNextIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="17" y="4" width="3" height="16" fill={color} />
    <Path
      d="M16.5 12L8 18V6L16.5 12Z"
      fill={color}
    />
  </Svg>
);

export default SkipNextIcon;
