import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    // flexGrow 让内容不足一屏时也能撑满页面，内容超过一屏或键盘弹起时交给键盘感知 ScrollView 滚动。
    flexGrow: 1,
  },
});

export default styles;
