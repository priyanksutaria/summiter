import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Easing
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// Import our new screen components


const { width, height } = Dimensions.get('window');

// Define detection outcomes
const DETECTION_OUTCOMES = {
  SUMMITED: 'SUMMITED',
  CLIMBING: 'CLIMBING',
  NO_MOUNTAIN: 'NO_MOUNTAIN',
  NONE: 'NONE'
};

const PeakDetectionScreen = ({ navigation }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionOutcome, setDetectionOutcome] = useState(DETECTION_OUTCOMES.NONE);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const radarAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Create animations for multiple bubbles
  const bubbleAnims = Array(8).fill().map(() => ({
    scale: useRef(new Animated.Value(0.3)).current,
    translateX: useRef(new Animated.Value(0)).current,
    translateY: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(1)).current,
    delay: Math.random() * 2000, // Random delay for each bubble
    angle: Math.random() * Math.PI * 2 // Random angle for direction
  }));

  useEffect(() => {
    if (isDetecting) {
      startAnimations();
      // Start detection process with timeout
      startDetectionProcess();
    } else {
      stopAnimations();
      setDetectionOutcome(DETECTION_OUTCOMES.NONE);
    }
  }, [isDetecting]);

  // Effect for handling navigation based on detection outcome
  useEffect(() => {
    if (detectionOutcome !== DETECTION_OUTCOMES.NONE && navigation) {
      navigateToResultScreen();
    }
  }, [detectionOutcome]);

  const startDetectionProcess = () => {
    // Simulate detection process completing after progress animation finishes (8 seconds)
    setTimeout(() => {
      if (isDetecting) {
        const outcomes = [
          DETECTION_OUTCOMES.SUMMITED,
          DETECTION_OUTCOMES.CLIMBING,
          DETECTION_OUTCOMES.NO_MOUNTAIN
        ];

        // Select a random outcome
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        setDetectionOutcome(randomOutcome);
        setIsDetecting(false);
      }
    }, 8000);
  };

  const navigateToResultScreen = () => {
    switch (detectionOutcome) {
      case DETECTION_OUTCOMES.SUMMITED:
        navigation.navigate('Summited');
        break;
      case DETECTION_OUTCOMES.CLIMBING:
        navigation.navigate('Climbing');
        break;
      case DETECTION_OUTCOMES.NO_MOUNTAIN:
        navigation.navigate('NoMountain');
        break;
      default:
        // Do nothing
        break;
    }

    // Reset outcome after navigation
    setDetectionOutcome(DETECTION_OUTCOMES.NONE);
  };

  const startAnimations = () => {
    // Pulse animation for center icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
      ])
    ).start();

    // Multiple waves animation
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Enhanced radar rotation animation
    Animated.loop(
      Animated.timing(radarAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: false,
    }).start();

    // Animate each bubble
    bubbleAnims.forEach((anim, index) => {
      const animateBubble = () => {
        // Reset values
        anim.scale.setValue(0.3);
        anim.opacity.setValue(1);

        // Set random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 150;
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;

        anim.translateX.setValue(0);
        anim.translateY.setValue(0);

        Animated.sequence([
          Animated.delay(anim.delay),
          Animated.parallel([
            Animated.timing(anim.scale, {
              toValue: 1,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateX, {
              toValue: targetX,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: targetY,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            })
          ])
        ]).start(() => {
          if (isDetecting) {
            animateBubble();
          }
        });
      };

      animateBubble();
    });
  };

  const stopAnimations = () => {
    pulseAnim.stopAnimation();
    waveAnim.stopAnimation();
    radarAnim.stopAnimation();
    progressAnim.stopAnimation();

    bubbleAnims.forEach(anim => {
      anim.scale.stopAnimation();
      anim.translateX.stopAnimation();
      anim.translateY.stopAnimation();
      anim.opacity.stopAnimation();
    });

    pulseAnim.setValue(1);
    waveAnim.setValue(0);
    radarAnim.setValue(0);
    progressAnim.setValue(0);
  };

  const radarRotation = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressInterpolation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <View style={styles.container}>
      {/* Notification Box */}
      <View style={styles.notificationBox}>
        <Text style={styles.notificationText}>
          Not hiking right now? Would still love to check out the app.
        </Text>
        <TouchableOpacity>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Animated Detection Area */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => !isDetecting && setIsDetecting(true)}
        activeOpacity={0.8}
        disabled={isDetecting}
      >
        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <Svg width={280} height={280} style={styles.progressCircle}>
            <Defs>
              <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#70BBFF" />
                <Stop offset="100%" stopColor="#3D85C6" />
              </LinearGradient>
            </Defs>
            <Circle
              cx={140}
              cy={140}
              r={130}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={6}
            />
            {isDetecting && (
              <Circle
                cx={140}
                cy={140}
                r={130}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth={6}
                strokeDasharray={`${2 * Math.PI * 130}`}
                strokeDashoffset={2 * Math.PI * 130 * (1 - progressInterpolation / 100)}
                strokeLinecap="round"
              />
            )}
          </Svg>
        </View>

        {/* Multiple Radar Waves */}
        {isDetecting && (
          <>
            <Animated.View style={[
              styles.wave,
              {
                transform: [{
                  scale: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 2.2]
                  })
                }],
                opacity: waveAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.8, 0.4, 0]
                })
              }
            ]} />
            <Animated.View style={[
              styles.wave,
              {
                transform: [{
                  scale: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1.8]
                  })
                }],
                opacity: waveAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.8, 0.4, 0]
                })
              }
            ]} />
            <Animated.View style={[
              styles.wave,
              {
                transform: [{
                  scale: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1.5]
                  })
                }],
                opacity: waveAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.8, 0.4, 0]
                })
              }
            ]} />
          </>
        )}

        {/* Enhanced Radar Beam */}
        {isDetecting && (
          <Animated.View style={[
            styles.radarBeam,
            { transform: [{ rotate: radarRotation }] }
          ]}>
            <View style={styles.beamContainer}>
              <View style={styles.beam} />
            </View>
          </Animated.View>
        )}

        {/* Mountain Bubble Animations */}
        {isDetecting && bubbleAnims.map((anim, index) => (
          <Animated.View
            key={`bubble-${index}`}
            style={[
              styles.bubble,
              {
                transform: [
                  { translateX: anim.translateX },
                  { translateY: anim.translateY },
                  { scale: anim.scale }
                ],
                opacity: anim.opacity
              }
            ]}
          >
            <Image
              source={require('../assets/mountain-icon.png')}
              style={styles.bubbleIcon}
            />
          </Animated.View>
        ))}

        {/* Center Icon with Enhanced Pulse */}
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: pulseAnim }],
              shadowOpacity: pulseAnim.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0.3, 0.6]
              })
            }
          ]}
        >
          <Image
            source={require('../assets/mountain-icon.png')}
            style={styles.icon}
          />
        </Animated.View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 120, width: '100%' }}>
        <TouchableOpacity style={{ backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center', flex: 1, marginHorizontal: 10 }} onPress={()=> {navigation.navigate('Summited')}}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Summited</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center', flex: 1, marginHorizontal: 10 }} onPress={()=> {navigation.navigate('Climbing')}}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Climbing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center', flex: 1, marginHorizontal: 10 }} onPress={()=> {navigation.navigate('NoMountain')}}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>No peak</Text>
        </TouchableOpacity>
      </View>

      {/* Status Text */}
      <Text style={styles.statusText}>
        {isDetecting ? 'DETECTING NEARBY PEAK' : 'TAP TO START DETECTION'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#204F70',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBox: {
    position: 'absolute',
    top: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    width: width * 0.9,
    opacity: 0.9,
  },
  notificationText: {
    fontSize: 20,
    fontFamily: 'Oswald',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.24,
    color: '#204F71',
    flex: 1,
  },
  arrow: {
    fontSize: 24,
    color: '#204F71',
  },
  iconContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    tintColor: '#21406C',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  wave: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    zIndex: 1,
  },
  radarBeam: {
    position: 'absolute',
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  beamContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  beam: {
    width: 140,
    height: 4,
    backgroundColor: 'rgba(146, 209, 248, 0.5)',
    position: 'absolute',
    left: 140,
    borderRadius: 2,
    shadowColor: '#92D1F8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  bubble: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  bubbleIcon: {
    width: 20,
    height: 20,
    tintColor: '#21406C',
  },
  progressCircle: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  statusText: {
    position: 'absolute',
    bottom: 70,
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default PeakDetectionScreen;