import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MedalIconProps {
  color?: string;
  size?: number;
}

const MedalIcon = ({ color = '#FFFFFF', size = 16 }: MedalIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M8.5 3H15.5L17 7L12 9.5L7 7L8.5 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M7 7L5 13L12 15L19 13L17 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default MedalIcon;