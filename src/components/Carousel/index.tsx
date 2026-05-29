import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import styles from './styles';

export interface CarouselItem {
  id: string;
  imageUrl: string;
  jumpUrl: string;
}

interface CarouselProps {
  interval?: number;
  items: CarouselItem[];
  onPress?: (jumpUrl: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

const Carousel = ({ items, interval = 3, onPress }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (items.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, interval * 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [items.length, interval]);

  useEffect(() => {
    if (flatListRef.current && items.length > 0) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex, items.length]);

  const handleImagePress = (jumpUrl: string) => {
    if (onPress) {
      onPress(jumpUrl);
    }
  };

  const renderItem = ({ item }: { item: CarouselItem }) => (
    <TouchableOpacity
      style={styles.slide}
      onPress={() => handleImagePress(item.jumpUrl)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderIndicator = () => (
    <View style={styles.indicatorContainer}>
      {items.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            index === currentIndex ? styles.indicatorActive : null,
          ]}
        />
      ))}
    </View>
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const contentOffset = e.nativeEvent.contentOffset;
          const index = Math.round(contentOffset.x / screenWidth);
          setCurrentIndex(index);
        }}
      />
      {items.length > 1 && renderIndicator()}
    </View>
  );
};

export default Carousel;