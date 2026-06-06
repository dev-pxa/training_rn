import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PauseIconProps {
  color?: string;
  size?: number;
}

const PauseIcon = ({ color = '#FFFFFF', size = 32 }: PauseIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z"
      fill={color}
    />
  </Svg>
);

export default PauseIcon;
