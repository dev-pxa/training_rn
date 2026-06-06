import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface ShareIconProps {
  color?: string;
  size?: number;
}

const ShareIcon = ({ color = '#1A1A1A', size = 24 }: ShareIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth="2" />
    <Path
      d="M8.59 13.51L15.42 17.49"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.41 6.51L8.59 10.49"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ShareIcon;
