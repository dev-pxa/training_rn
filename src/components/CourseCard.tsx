import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Course, CourseType } from '../types/home';

interface CourseCardProps {
  course: Course;
  onPress?: (jumpUrl: string) => void;
  index?: number;
}

const getGradientColors = (index: number = 0): string[] => {
  const gradients = [
    ['#11998E', '#38EF7D'],
    ['#667EEA', '#764BA2'],
    ['#F093FB', '#F5576C'],
    ['#4FACFE', '#00F2FE'],
  ];
  return gradients[index % gradients.length];
};

const getCourseEmoji = (type: CourseType): string => {
  return type === 'series' ? '👷' : '🔧';
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, index = 0 }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(course.jumpUrl);
    }
  };

  return (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <LinearGradient
        colors={getGradientColors(index)}
        style={styles.courseThumbnail}
      >
        <Text style={styles.courseEmoji}>{getCourseEmoji(course.type)}</Text>
      </LinearGradient>
      <Text style={styles.courseTitle} numberOfLines={2}>
        {course.title}
      </Text>
      <Text style={styles.courseMeta}>{course.duration}</Text>
    </TouchableOpacity>
  );
};

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

export default CourseCard;
