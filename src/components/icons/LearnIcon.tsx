import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LearnIconProps {
  color?: string;
  size?: number;
}

const LearnIcon = ({ color = '#D1D5DB', size = 28 }: LearnIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 8.5L12 3L22 8.5L12 14L2 8.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 10.5V16.5L12 20L18 16.5V10.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 14V20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default LearnIcon;