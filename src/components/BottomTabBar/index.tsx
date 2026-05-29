import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Icon, IconName } from '../Icons';
import styles from './styles';

export interface TabItem {
  /** Tab 唯一标识 */
  key: string;
  /** Tab 名称 */
  label: string;
  /** Icon 名称 */
  iconName: IconName;
  /** 点击回调 */
  onPress?: () => void;
}

interface BottomTabBarProps {
  /** Tab 列表配置 */
  tabs: TabItem[];
  /** 当前激活的 tab key */
  activeKey: string;
  /** 自定义样式 */
  style?: StyleProp<ViewStyle>;
  /** 激活态颜色 */
  activeColor?: string;
  /** 默认态颜色 */
  defaultColor?: string;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  tabs,
  activeKey,
  style,
  activeColor = '#4F8EF7',
  defaultColor = '#667085',
}) => {
  const handleTabPress = (tab: TabItem) => {
    if (tab.onPress) {
      tab.onPress();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        const iconColor = isActive ? activeColor : defaultColor;
        const textColor = isActive ? activeColor : defaultColor;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Icon name={tab.iconName} size={28} color={iconColor} />
            <Text style={[styles.tabText, { color: textColor }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabBar;