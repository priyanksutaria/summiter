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
import Svg, { Circle, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PeakDetectionScreen = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  
  // Native driver animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const wave2Anim = useRef(new Animated.Value(0)).current;
  const radarAnim = useRef(new Animated.Value(0)).current;
  const radarOpacityAnim = useRef(new Animated.Value(0.5)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  
  // Non-native animations (separate values)
  const glowAnimValue = useRef(new Animated.Value(0)).current;
  const progressAnimValue = useRef(new Animated.Value(0)).current;
  
  // Create animations for multiple bubbles
  const bubbleAnims = Array(15).fill().map(() => ({
    scale: useRef(new Animated.Value(0.2)).current,
    translateX: useRef(new Animated.Value(0)).current,
    translateY: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
    rotate: useRef(new Animated.Value(0)).current,
    delay: Math.random() * 2000,
    duration: 2000 + Math.random() * 3000,
  }));
  
  // Add floating particles
  const particleAnims = Array(20).fill().map(() => ({
    translateX: useRef(new Animated.Value(0)).current,
    translateY: useRef(new Animated.Value(0)).current,
    scale: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
    delay: Math.random() * 5000,
  }));

  useEffect(() => {
    if (isDetecting) {
      startAnimations();
    } else {
      stopAnimations();
    }
    
    return () => stopAnimations();
  }, [isDetecting]);

  // Update progress for UI from the non-native animation value
  useEffect(() => {
    const listener = progressAnimValue.addListener(({value}) => {
      setProgressValue(value);
    });
    
    return () => {
      progressAnimValue.removeListener(listener);
    };
  }, []);

  const startAnimations = () => {
    // Background pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic)
        }),
        Animated.timing(backgroundAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic)
        })
      ])
    ).start();
    
    // Enhanced pulse animation for center icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic)
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic)
        }),
      ])
    ).start();
    
    // Glow animation - separated from pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.cubic)
        }),
        Animated.timing(glowAnimValue, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.cubic)
        }),
      ])
    ).start();

    // Multiple staggered waves animations
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })
    ).start();
    
    // Second wave with offset
    Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(wave2Anim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.delay(0)
      ])
    ).start();

    // Enhanced radar rotation animation with opacity pulse
    Animated.loop(
      Animated.parallel([
        Animated.timing(radarAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(radarOpacityAnim, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(radarOpacityAnim, {
            toValue: 0.4,
            duration: 2000,
            useNativeDriver: true,
          })
        ])
      ])
    ).start();

    // Progress animation with bounce at the end - non-native
    Animated.sequence([
      Animated.timing(progressAnimValue, {
        toValue: 0.95,
        duration: 7000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.cubic)
      }),
      Animated.timing(progressAnimValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.bounce
      })
    ]).start();

    // Animate each bubble with more complex paths
    bubbleAnims.forEach((anim, index) => {
      const animateBubble = () => {
        // Reset values
        anim.scale.setValue(0.2);
        anim.opacity.setValue(0);
        anim.rotate.setValue(Math.random() * 20 - 10);
        
        // Set random direction with curved path
        const angle = Math.random() * Math.PI * 2;
        const distance = 120 + Math.random() * 80;
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;
        
        anim.translateX.setValue(0);
        anim.translateY.setValue(0);
        
        // Create complex animation sequence
        Animated.sequence([
          Animated.delay(anim.delay),
          // Fade in
          Animated.timing(anim.opacity, {
            toValue: 0.9,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.cubic
          }),
          // Move outward with scaling
          Animated.parallel([
            Animated.timing(anim.scale, {
              toValue: 0.7 + Math.random() * 0.5,
              duration: anim.duration,
              useNativeDriver: true,
              easing: Easing.out(Easing.cubic)
            }),
            Animated.timing(anim.translateX, {
              toValue: targetX,
              duration: anim.duration,
              useNativeDriver: true,
              easing: Easing.out(Easing.cubic)
            }),
            Animated.timing(anim.translateY, {
              toValue: targetY,
              duration: anim.duration,
              useNativeDriver: true,
              easing: Easing.out(Easing.cubic)
            }),
            // Fade out near the end
            Animated.sequence([
              Animated.delay(anim.duration * 0.6),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: anim.duration * 0.4,
                useNativeDriver: true,
                easing: Easing.in(Easing.cubic)
              })
            ])
          ])
        ]).start(() => {
          if (isDetecting) {
            // Reset animation with new random parameters
            anim.delay = Math.random() * 1000;
            anim.duration = 2000 + Math.random() * 3000;
            animateBubble();
          }
        });
      };
      
      animateBubble();
    });
    
    // Animate floating particles
    particleAnims.forEach((anim, index) => {
      const animateParticle = () => {
        // Reset values
        anim.scale.setValue(0);
        anim.opacity.setValue(0);
        
        // Random position around the center
        const startAngle = Math.random() * Math.PI * 2;
        const startDistance = 50 + Math.random() * 30;
        const startX = Math.cos(startAngle) * startDistance;
        const startY = Math.sin(startAngle) * startDistance;
        
        const targetAngle = startAngle + (Math.random() * 0.4 - 0.2);
        const targetDistance = startDistance + 100 + Math.random() * 80;
        const targetX = Math.cos(targetAngle) * targetDistance;
        const targetY = Math.sin(targetAngle) * targetDistance;
        
        anim.translateX.setValue(startX);
        anim.translateY.setValue(startY);
        
        Animated.sequence([
          Animated.delay(anim.delay),
          Animated.parallel([
            Animated.timing(anim.scale, {
              toValue: 0.3 + Math.random() * 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0.6,
              duration: 500,
              useNativeDriver: true,
            })
          ]),
          Animated.parallel([
            Animated.timing(anim.translateX, {
              toValue: targetX,
              duration: 6000 + Math.random() * 4000,
              useNativeDriver: true,
              easing: Easing.out(Easing.cubic)
            }),
            Animated.timing(anim.translateY, {
              toValue: targetY,
              duration: 6000 + Math.random() * 4000,
              useNativeDriver: true,
              easing: Easing.out(Easing.cubic)
            }),
            Animated.sequence([
              Animated.delay(5000),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              })
            ])
          ])
        ]).start(() => {
          if (isDetecting) {
            anim.delay = Math.random() * 2000;
            animateParticle();
          }
        });
      };
      
      animateParticle();
    });
  };

  const stopAnimations = () => {
    // Stop all native animations
    [pulseAnim, waveAnim, wave2Anim, radarAnim, 
     radarOpacityAnim, backgroundAnim].forEach(anim => {
      anim.stopAnimation();
      anim.setValue(anim === radarOpacityAnim ? 0.5 : 0);
    });
    
    // Stop non-native animations
    glowAnimValue.stopAnimation();
    progressAnimValue.stopAnimation();
    glowAnimValue.setValue(0);
    progressAnimValue.setValue(0);
    setProgressValue(0);
    
    // Reset bubble animations
    bubbleAnims.forEach(anim => {
      [anim.scale, anim.translateX, anim.translateY, anim.opacity, anim.rotate].forEach(a => {
        a.stopAnimation();
        a.setValue(0);
      });
    });
    
    // Reset particle animations
    particleAnims.forEach(anim => {
      [anim.scale, anim.translateX, anim.translateY, anim.opacity].forEach(a => {
        a.stopAnimation();
        a.setValue(0);
      });
    });
  };

  const radarRotation = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Generate shadow value based on glowAnimValue
  const shadowRadius = glowAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 15]
  });
  
  // Generate backgroundColor based on backgroundAnim
  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#21406C', '#1A355A']
  });
  
  // Calculate progress circle values
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progressValue);

  return (
    <Animated.View 
      style={[
        styles.container,
        { backgroundColor }
      ]}
    >
      {/* Notification Box */}
      <View style={styles.notificationBox}>
        <Text style={styles.notificationText}>
          Not hiking right now? Would still love to check out the app.
        </Text>
        <TouchableOpacity>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Background Glow Effect */}
      {isDetecting && (
        <Animated.View style={[
          styles.backgroundGlow,
          {
            opacity: backgroundAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.4]
            })
          }
        ]} />
      )}

      {/* Animated Detection Area */}
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => setIsDetecting(!isDetecting)}
        activeOpacity={0.8}
      >
        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <Svg width={300} height={300} style={styles.progressCircle}>
            <Defs>
              <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#70BBFF" />
                <Stop offset="100%" stopColor="#3D85C6" />
              </LinearGradient>
              <RadialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </RadialGradient>
            </Defs>
            
            {/* Subtle background glow - using state not animation */}
            {isDetecting && (
              <Circle
                cx={150}
                cy={150}
                r={100}
                fill="url(#centerGlow)"
                opacity={0.8}
              />
            )}
            
            <Circle
              cx={150}
              cy={150}
              r={140}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={6}
            />
            
            {/* Using calculated values instead of animated props */}
            {isDetecting && (
              <Circle
                cx={150}
                cy={150}
                r={140}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth={6}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            )}
          </Svg>
        </View>

        {/* Multiple Radar Waves with staggered animation */}
        {isDetecting && (
          <>
            <Animated.View style={[
              styles.wave,
              {
                transform: [{ scale: waveAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 2.4]
                }) }],
                opacity: waveAnim.interpolate({
                  inputRange: [0, 0.3, 0.7, 1],
                  outputRange: [0.9, 0.5, 0.2, 0]
                }),
                borderColor: 'rgba(112, 187, 255, 0.6)',
              }
            ]} />
            <Animated.View style={[
              styles.wave,
              {
                transform: [{ scale: wave2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 2.0]
                }) }],
                opacity: wave2Anim.interpolate({
                  inputRange: [0, 0.3, 0.7, 1],
                  outputRange: [0.9, 0.5, 0.2, 0]
                }),
                borderColor: 'rgba(61, 133, 198, 0.6)',
              }
            ]} />
            <Animated.View style={[
              styles.wave,
              {
                transform: [{ scale: waveAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.8]
                }) }],
                opacity: waveAnim.interpolate({
                  inputRange: [0, 0.3, 0.7, 1],
                  outputRange: [0.9, 0.5, 0.2, 0]
                })
              }
            ]} />
          </>
        )}

        {/* Enhanced Radar Beam with Glow */}
        {isDetecting && (
          <Animated.View style={[
            styles.radarBeam,
            { 
              transform: [{ rotate: radarRotation }],
              opacity: radarOpacityAnim
            }
          ]}>
            <View style={styles.beamContainer}>
              <View style={styles.beam} />
              <View style={styles.beamGlow} />
            </View>
          </Animated.View>
        )}

        {/* Floating particles */}
        {isDetecting && particleAnims.map((anim, index) => (
          <Animated.View 
            key={`particle-${index}`}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: anim.translateX },
                  { translateY: anim.translateY },
                  { scale: anim.scale }
                ],
                opacity: anim.opacity,
                backgroundColor: index % 3 === 0 ? '#70BBFF' : 
                               index % 3 === 1 ? '#3D85C6' : '#FFFFFF'
              }
            ]}
          />
        ))}

        {/* Mountain Bubble Animations - Enhanced */}
        {isDetecting && bubbleAnims.map((anim, index) => (
          <Animated.View 
            key={`bubble-${index}`}
            style={[
              styles.bubble,
              {
                transform: [
                  { translateX: anim.translateX },
                  { translateY: anim.translateY },
                  { scale: anim.scale },
                  { rotate: anim.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })}
                ],
                opacity: anim.opacity,
                backgroundColor: index % 4 === 0 ? 'rgba(255, 255, 255, 0.9)' : 
                               index % 4 === 1 ? 'rgba(112, 187, 255, 0.9)' :
                               index % 4 === 2 ? 'rgba(255, 255, 255, 0.8)' :
                               'rgba(61, 133, 198, 0.9)'
              }
            ]}
          >
            <Image
              source={require('../assets/mountain-icon.png')}
              style={[
                styles.bubbleIcon,
                {
                  tintColor: index % 4 === 0 ? '#21406C' : 
                            index % 4 === 1 ? '#FFFFFF' :
                            index % 4 === 2 ? '#21406C' :
                            '#FFFFFF'
                }
              ]}
            />
          </Animated.View>
        ))}

        {/* Center Icon with Enhanced Pulse - shadow controlled by state */}
        <Animated.View 
          style={[
            styles.circle, 
            { 
              transform: [{ scale: pulseAnim }],
            }
          ]}
        >
          <Image
            source={require('../assets/mountain-icon.png')}
            style={styles.icon}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Status Text with Animation - separated into native and non-native parts */}
      <Animated.Text 
        style={[
          styles.statusText,
          isDetecting && {
            opacity: 1,
            transform: [{ scale: 1.01 }]
          }
        ]}
      >
        {isDetecting ? 'DETECTING NEARBY PEAK' : 'TAP TO START DETECTION'}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#21406C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundGlow: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: '#70BBFF',
    opacity: 0.2,
    top: height / 2 - width * 0.75,
    left: width / 2 - width * 0.75,
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
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    width: width * 0.9,
    opacity: 0.9,
  },
  notificationText: {
    fontSize: 16,
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
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 90,
    height: 90,
    tintColor: '#21406C',
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#70BBFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  wave: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    zIndex: 1,
  },
  radarBeam: {
    position: 'absolute',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  beamContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  beam: {
    width: 150,
    height: 4,
    backgroundColor: 'rgba(112, 187, 255, 0.7)',
    position: 'absolute',
    left: 150,
    borderRadius: 2,
  },
  beamGlow: {
    width: 150,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    left: 150,
    borderRadius: 1,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  bubble: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    shadowColor: '#70BBFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  bubbleIcon: {
    width: 22,
    height: 22,
    tintColor: '#21406C',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 3,
  },
  progressCircle: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  statusText: {
    position: 'absolute',
    bottom: 70,
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default PeakDetectionScreen;