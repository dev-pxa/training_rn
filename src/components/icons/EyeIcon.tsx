import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface EyeIconProps {
  color?: string;
  size?: number;
}

const EyeIcon = ({ color = '#FFFFFF', size = 16 }: EyeIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.4 15C18.9177 15.7117 18.2962 16.3226 17.5791 16.7986C16.8621 17.2746 16.0647 17.607 15.2336 17.7751C14.4025 17.9432 13.5479 17.9434 12.7168 17.7757C11.8857 17.6081 11.0885 17.2756 10.3716 16.7993C9.65473 16.3229 9.03317 15.7118 8.55 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.6 9C5.0823 8.28825 5.70383 7.67707 6.42092 7.2007C7.138 6.72432 7.93536 6.39189 8.76645 6.22429C9.59754 6.05669 10.4521 6.05683 11.2832 6.22493C12.1143 6.39304 12.9115 6.72544 13.6284 7.20145C14.3453 7.67745 14.9668 8.28825 15.45 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default EyeIcon;
