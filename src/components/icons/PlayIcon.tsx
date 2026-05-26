import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PlayIconProps {
  color?: string;
  size?: number;
}

const PlayIcon = ({ color = '#FFFFFF', size = 32 }: PlayIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 3L19 12L5 21V3Z"
      fill={color}
    />
  </Svg>
);

export default PlayIcon;