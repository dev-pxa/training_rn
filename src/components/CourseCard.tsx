import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Course, CourseType } from '../types/home';
import { Icon } from './Icons';

interface CourseCardProps {
  course: Course;
  onPress?: (jumpUrl: string) => void;
}

const getCourseIcon = (type: CourseType): 'Clock' | 'Collection' => {
  return type === 'series' ? 'Collection' : 'Clock';
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(course.jumpUrl);
    }
  };

  return (
    <View
      style={styles.courseCard}
      onTouchEnd={handlePress}
    >
      <View style={styles.courseThumbnailContainer}>
        <Image
          source={{ uri: course.coverImage }}
          style={styles.courseThumbnail}
        />
        {course.label && course.labelStyle && (
          <View style={[styles.courseBadge, { backgroundColor: course.labelStyle.backgroundColor }]}>
            <Text style={[styles.courseBadgeText, { color: course.labelStyle.textColor }]}>
              {course.label}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.courseCardTitle} numberOfLines={2}>{course.title}</Text>
      <View style={styles.courseDuration}>
        <Icon name={getCourseIcon(course.type)} size={12} />
        <Text style={styles.courseDurationText}>{course.duration}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  courseCard: {
    flex: 1,
  },
  courseThumbnailContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  courseThumbnail: {
    width: '100%',
    height: '100%',
  },
  courseBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  courseBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  courseCardTitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 16,
  },
  courseDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  courseDurationText: {
    fontSize: 9,
    color: '#9CA3AF',
    marginLeft: 2,
  },
});

export default CourseCard;