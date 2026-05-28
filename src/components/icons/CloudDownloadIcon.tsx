import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CloudDownloadIconProps {
  color?: string;
  size?: number;
}

const CloudDownloadIcon = ({ color = '#FFFFFF', size = 16 }: CloudDownloadIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 17L12 21L16 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 12V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.39 18.3999C21.3339 17.854 22.0705 17.0233 22.4826 16.0207C22.8948 15.0181 22.9545 13.8999 22.6542 12.8686C22.354 11.8374 21.7129 10.9496 20.8335 10.3322C20.4186 7.96266 19.1435 5.85218 17.2886 4.38904C15.4337 2.9259 13.1246 2.18858 10.7489 2.31328C8.37314 2.43798 6.1301 3.41211 4.45766 5.06978C2.78523 6.72745 1.76549 8.93696 1.56 11.3199"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CloudDownloadIcon;
