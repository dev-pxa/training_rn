import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Course, CourseType } from '../../types/home';
import Icon from '../Icons/Icon';
import styles from './styles';

interface CourseCardProps {
  course: Course;
  onPress?: (jumpUrl: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(course.jumpUrl);
    }
  };

  const getDurationIcon = (type: CourseType) => {
    return type === 'series' ? 'Book' : 'Clock';
  };

  return (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: course.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        {course.label && (
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            style={styles.courseLabel}
          >
            <Text style={styles.courseLabelText}>{course.label}</Text>
          </LinearGradient>
        )}
        <View style={styles.durationWrapper}>
          <Icon name={getDurationIcon(course.type)} size={12} color="#FFFFFF" />
          <Text style={styles.durationText}>{course.duration}</Text>
        </View>
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {course.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;
