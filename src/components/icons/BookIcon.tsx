import React from 'react';
import { ColorValue, StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface BookIconProps {
  color?: ColorValue;
  size?: number;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
}

const BookIcon: React.FC<BookIconProps> = ({
  color = '#1A1A1A',
  size = 24,
  style,
  opacity = 1,
}) => {
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M6.5 2H20V22H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default BookIcon;
