import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MaximizeIconProps {
  color?: string;
  size?: number;
}

const MaximizeIcon = ({ color = '#FFFFFF', size = 24 }: MaximizeIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 3H5C3.89543 3 3 3.89543 3 5V8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 8V5C21 3.89543 20.1046 3 19 3H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 16V19C3 20.1046 3.89543 21 5 21H8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 21H19C20.1046 21 21 20.1046 21 19V16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default MaximizeIcon;
