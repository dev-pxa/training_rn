import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  courseCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  courseThumbnail: {
    width: '100%',
    height: 80,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseEmoji: {
    fontSize: 28,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 18.2,
    marginBottom: 4,
  },
  courseMeta: {
    fontSize: 12,
    color: '#667085',
  },
});

export default styles;