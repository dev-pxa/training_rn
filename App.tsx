/**
 * 企训通
 */

import { startNetworkLogging } from 'react-native-network-logger';
import AppNavigator from './src/navigation';
import { AuthProvider } from './src/contexts/AuthContext';

startNetworkLogging();

function App() {
  return (
    /**
     * AuthProvider 放在导航外层。
     *
     * 这样导航、登录页、个人中心以及请求层的 401 回调都能共享同一份登录状态。
     * Provider 会在启动时先恢复本地 token，再决定展示登录栈还是业务栈。
     */
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

export default App;
