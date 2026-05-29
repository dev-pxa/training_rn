import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 84,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#E7E8EE',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default styles;