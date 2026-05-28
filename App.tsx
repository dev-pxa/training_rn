/**
 * 企训通
 */

import { startNetworkLogging } from 'react-native-network-logger';
import AppNavigator from './src/navigation';

startNetworkLogging();

function App() {
  return <AppNavigator />;
}

export default App;