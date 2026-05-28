import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SettingsIconProps {
  color?: string;
  size?: number;
}

const SettingsIcon = ({ color = '#FFFFFF', size = 16 }: SettingsIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.4 15C19.1333 15.6667 18.7667 16.2667 18.3 16.8C17.8333 17.3333 17.3 17.7667 16.7 18.1L15.2 16.6C14.9667 16.3667 14.6667 16.2333 14.3 16.2C13.4 16.3667 12.7 16.5 12 16.5C11.3 16.5 10.6 16.3667 9.7 16.2C9.33333 16.2333 9.03333 16.3667 8.8 16.6L7.3 18.1C6.7 17.7667 6.16667 17.3333 5.7 16.8C5.23333 16.2667 4.86667 15.6667 4.6 15C4.73333 14.6333 4.8 14.3 4.8 14C4.8 13.7 4.73333 13.3667 4.6 13C4.86667 12.3333 5.23333 11.7333 5.7 11.2C6.16667 10.6667 6.7 10.2333 7.3 9.9L8.8 11.4C9.03333 11.6333 9.33333 11.7667 9.7 11.8C10.6 11.6333 11.3 11.5 12 11.5C12.7 11.5 13.4 11.6333 14.3 11.8C14.6667 11.7667 14.9667 11.6333 15.2 11.4L16.7 9.9C17.3 10.2333 17.8333 10.6667 18.3 11.2C18.7667 11.7333 19.1333 12.3333 19.4 13C19.2667 13.3667 19.2 13.7 19.2 14C19.2 14.3 19.2667 14.6333 19.4 15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SettingsIcon;
