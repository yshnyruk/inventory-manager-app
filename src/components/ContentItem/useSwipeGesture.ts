import { useRef } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  onRelease,
  threshold = 0.6,
}: {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onRelease: () => void;
  threshold?: number;
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const screenWidth = Dimensions.get('window').width;
        if (gestureState.dx < -screenWidth * threshold) {
          onSwipeLeft();
        } else if (gestureState.dx > screenWidth * threshold) {
          onSwipeRight();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => onRelease());
        }
      },
    })
  ).current;

  return { translateX, panResponder };
};
