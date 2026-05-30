import React from 'react';
import Svg, { Path, Polyline } from 'react-native-svg';

interface RefreshIconProps {
  color?: string;
  size?: number;
}

const RefreshIcon = ({ color = '#4F8EF7', size = 28 }: RefreshIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline
      points="23 4 23 10 17 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.49 15C19.9889 17.4876 18.7275 19.6247 16.9235 21.107C15.1195 22.5894 12.8796 23.3279 10.5585 23.1938C8.23745 23.0597 6.04965 22.0639 4.39829 20.3667C2.74693 18.6695 1.72737 16.3944 1.52117 13.966C1.31496 11.5376 1.94458 9.12624 3.28692 7.14568C4.62925 5.16513 6.57633 3.75176 8.80198 3.17705C11.0276 2.60234 13.3823 2.91522 15.44 4.06"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default RefreshIcon;
