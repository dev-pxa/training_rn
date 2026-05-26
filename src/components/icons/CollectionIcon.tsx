import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface CollectionIconProps {
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const CollectionIcon = ({ color = '#9CA3AF', size = 14, style }: CollectionIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M3 7a2 2 0 0 1 2-2h7.586a2 2 0 0 1 1.414.586l1.414 1.414A2 2 0 0 0 16.828 8H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M6 14h12M6 18h8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default CollectionIcon;
