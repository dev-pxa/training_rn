import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollView: {
    flex: 1,
  },
  playerSection: {
    position: 'relative',
    backgroundColor: '#000000',
    aspectRatio: 16 / 9,
    width: '100%',
  },
  backBtn: {
    position: 'absolute',
    top: 54,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  courseInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 23.8,
  },
  courseHighlight: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    lineHeight: 18,
  },
  courseActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  actionBtnPrimaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  actionBtnSecondaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tabsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabItem: {
    paddingVertical: 14,
    marginRight: 28,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItemActive: {
    // Active state handled via indicator
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#1A1A1A',
  },
  tabBadge: {
    marginLeft: 4,
    fontSize: 12,
    color: '#8E8E93',
  },
  tabBadgeActive: {
    color: '#1A1A1A',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
  },
  catalogSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  catalogItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  catalogIndex: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  catalogIndexText: {
    fontSize: 13,
    fontWeight: '700',
  },
  catalogContent: {
    flex: 1,
    minWidth: 0,
  },
  catalogName: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19.6,
  },
  catalogMeta: {
    fontSize: 11,
    marginTop: 4,
  },
  catalogIcon: {
    flexShrink: 0,
  },
  placeholderSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default styles;
