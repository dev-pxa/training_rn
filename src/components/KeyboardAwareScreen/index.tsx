import React, { ReactNode } from 'react';
import { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

interface KeyboardAwareScreenProps {
  children: ReactNode;
  /** 页面最外层样式，通常用于设置背景色。 */
  style?: StyleProp<ViewStyle>;
  /** ScrollView contentContainerStyle，表单页的 padding/布局放这里。 */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** SafeArea 生效边缘，默认覆盖顶部和底部，避免刘海屏、Home Indicator 遮挡表单。 */
  edges?: Edge[];
  /** 聚焦输入框和键盘之间的额外距离，避免输入框紧贴键盘上边缘。 */
  bottomOffset?: number;
  /** 透传给 ScrollView，默认 hidden，保持登录页这种表单页面干净。 */
  showsVerticalScrollIndicator?: boolean;
  /** 透传给 ScrollView，默认 handled，避免键盘弹起时按钮点击被输入框吞掉。 */
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
}

/**
 * 通用表单页面键盘安全容器。
 *
 * 组合 SafeAreaView + react-native-keyboard-aware-scroll-view 的 KeyboardAwareScrollView：
 * 1. SafeAreaView 处理刘海屏和底部 Home Indicator。
 * 2. KeyboardAwareScrollView 自动把聚焦输入框滚动到键盘上方。
 * 3. 键盘收起时通过 resetScrollToCoords 回到页面顶部，避免登录页停留在被顶上去后的状态。
 *
 * 后续登录、注册、资料编辑、密码修改、调试表单等页面都可以复用它，
 * 避免每个表单页重复处理键盘遮挡问题。
 */
const KeyboardAwareScreen = ({
  children,
  style,
  contentContainerStyle,
  edges = ['top', 'bottom'],
  bottomOffset = 24,
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
}: KeyboardAwareScreenProps) => {
  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        extraScrollHeight={bottomOffset}
        enableOnAndroid
        enableResetScrollToCoords
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        {children}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default KeyboardAwareScreen;
