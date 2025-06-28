// ClimbingScreen.js
import React, { useRef, useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  Animated, 
  PanResponder,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { OnboardingContext } from '../context/Context';

const { width, height } = Dimensions.get('window');

const ClimbingScreen = ({ route }) => {
  const navigation = useNavigation();
  const [swipeComplete, setSwipeComplete] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const pan = useRef(new Animated.ValueXY()).current;
  const buttonWidth = width * 0.85;
  const slideThreshold = buttonWidth * 0.4;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const { nearbyPeak, setNearbyPeak } = useContext(OnboardingContext);
  
  // Pulse animation for the swipe button hint
  useEffect(() => {
    if (showHint) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [showHint]);

  const hintTranslate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setShowHint(false);
        pan.setOffset({
          x: pan.x._value,
          y: 0
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gesture) => {
        // Only allow movement to the right and limit to button width
        if (gesture.dx > 0) {
          const newX = Math.min(gesture.dx, buttonWidth - 60);
          pan.x.setValue(newX);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        
        if (gesture.dx > slideThreshold) {
          // Complete the swipe animation
          Animated.spring(pan.x, {
            toValue: buttonWidth - 60,
            useNativeDriver: false,
            bounciness: 5
          }).start(() => {
            setSwipeComplete(true);
            setTimeout(() => {
              // Navigate to achievement screen with mountain name
              navigation.navigate('CameraScreen');
            }, 300);
          });
        } else {
          // Return to start
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: false,
            friction: 5
          }).start();
          setShowHint(true);
        }
      }
    })
  ).current;

  const sliderTranslate = pan.x.interpolate({
    inputRange: [0, buttonWidth - 60],
    outputRange: [0, buttonWidth - 60],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      {/* Background image with mountain peaks */}
      <ImageBackground 
        source={require('../assets/Climbing.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <Text style={styles.congratsTitle}>CONGRATULATIONS,</Text>
            <Text style={styles.mountainTitle}>ON CLIMBING {nearbyPeak.name.toUpperCase()}</Text>
            
            <Text style={styles.instructionText}>
              Make sure you capture this moment with a summit photo! Slide the below button to click
              a picture for your achievement badge.
            </Text>
            
            
            
            {/* Camera button with swipe functionality */}
            <View style={styles.cameraButtonContainer}>
              <View style={styles.cameraButton}>
                <LinearGradient
                  colors={['#1A4B78', '#2C6CA0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                />
                
                <Animated.View 
                  style={[styles.swipeCircle, { transform: [{ translateX: sliderTranslate }] }]}
                  {...panResponder.panHandlers}
                >
                  <Text style={styles.swipeArrow}>›</Text>
                  
                  {/* Hint animation */}
                  {showHint && (
                    <Animated.View 
                      style={[
                        styles.swipeHint, 
                        { transform: [{ translateX: hintTranslate }] }
                      ]}
                    >
                      <Text style={styles.swipeHintArrow}>›››</Text>
                    </Animated.View>
                  )}
                </Animated.View>
                <Text style={styles.cameraButtonText}>SWIPE RIGHT</Text>
                <View style={styles.cameraIconWrapper}>
                  <Image
                    source={require('../assets/camera-icon.png')}
                    style={styles.cameraIconImage}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'flex-end',
    paddingBottom: 200,
    alignItems: 'center',
  },
  congratsTitle: {
    color: '#0F4C81',
    fontSize: 32,
    fontFamily: 'Oswald',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mountainTitle: {
    color: '#0F4C81',
    fontSize: 30,
    fontFamily: 'Oswald',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  cameraButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 140,
    marginBottom: -120,
  },
  cameraButton: {
    width: '90%',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  swipeCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 2,
  },
  swipeArrow: {
    color: '#1A4B78',
    fontSize: 24,
    fontWeight: 'bold',
  },
  swipeHint: {
    position: 'absolute',
    right: -30,
    opacity: 0.6,
  },
  swipeHintArrow: {
    color: '#1A4B78',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
  },
  cameraIconWrapper: {
    position: 'absolute',
    right: 22,
    zIndex: 1,
  },
  cameraIconImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  }
});

export default ClimbingScreen;