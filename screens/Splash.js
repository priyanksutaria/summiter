import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  ImageBackground,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

// Particle component for independent animation
const Particle = ({ delay }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const randomX = Math.random() * 100 - 50;
  const randomColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)}, 0.7)`;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -50,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: randomX,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 1250,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    ).start();
  }, [delay, randomX, opacity, translateX, translateY]);

  const [fontsLoaded] = useFonts({
      'Oswald': require('../assets/fonts/Oswald.ttf'),
    });
  
    if (!fontsLoaded) {
      return <AppLoading />;
    }

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          opacity,
          transform: [{ translateX }, { translateY }],
          backgroundColor: randomColor,
        },
      ]}
    />
  );
};

export default function Splash() {
  const navigation = useNavigation();
  const logoPosition = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main animations: logo lifts/scales, progress fills, text fades in
    Animated.parallel([
      Animated.timing(logoPosition, {
        toValue: -100,
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1500,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.timing(progressWidth, {
        toValue: 100,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1500,
          easing: Easing.circle,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Transition to next screen after 8 seconds
    const timer = setTimeout(() => {
      navigation.replace('LoginPage');
    }, 8000);
    return () => clearTimeout(timer);
  }, [logoPosition, logoScale, progressWidth, textOpacity, navigation]);

  return (
    <ImageBackground
      source={require('../assets/mountain.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay - lowest layer */}
      <Animated.View style={styles.overlay} />

      {/* Particles container - middle layer */}
      <View style={styles.particlesContainer}>
        {[...Array(8)].map((_, i) => (
          <Particle key={i} delay={i * 200} />
        ))}
      </View>

      {/* Main content (logo, text, progress bar) - top layer */}
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ translateY: logoPosition }, { scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../assets/summiter.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity }}>
          <Text style={styles.subtitle}>
            Every Mountain in Life is Worth Celebrating
          </Text>
        </Animated.View>

      
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Base overlay with lower zIndex and elevation
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
    elevation: 1,
  },
  // Particles container above the overlay
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    elevation: 2,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Main content container on top
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    elevation: 3,
  },
  logoContainer: {
    position: 'absolute',
    top: '35%',
  },
  logo: {
    width: 300,
    height: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  subtitle: {
    fontFamily: 'Oswald',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.24,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 20,
  },
  
  progressContainer: {
    position: 'absolute',
    bottom: 50,
    width: '60%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    zIndex: 3,
    elevation: 3,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
});
