import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

export interface CarouselItem {
  imageUrl: string;
  jumpUrl: string;
}

interface CarouselProps {
  data: CarouselItem[];
  interval?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const Carousel = ({ data, interval = 3 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (data.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % data.length);
      }, interval * 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [data.length, interval]);

  useEffect(() => {
    if (flatListRef.current && data.length > 0) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex, data.length]);

  const handleImagePress = (jumpUrl: string) => {
    // TODO 跳转
    console.log('跳转 URL:', jumpUrl);
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
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            { backgroundColor: index === currentIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)' },
          ]}
        />
      ))}
    </View>
  );

  if (data.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.imageUrl}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const contentOffset = e.nativeEvent.contentOffset;
          const index = Math.round(contentOffset.x / screenWidth);
          setCurrentIndex(index);
        }}
      />
      {data.length > 1 && renderIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  slide: {
    width: screenWidth - 48,
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 9999,
  },
});

export default Carousel;