import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoadScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      navigation.replace('SplashScreen');
    }, 2000); // Adjust duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo - same as native splash screen */}
      <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      {/* Loader at bottom */}
      <ActivityIndicator
        size="large"
        color="#70B3E6" // Use color that matches your theme
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#204F71', // Match native splash background
  },
  logo: {
    width: '80%', // Adjust based on your logo size
    height: 200, // Adjust based on your logo size
    position: 'absolute',
    top: '45%', // Center vertically
    transform: [{ translateY: -100 }], // Half of logo height
  },
  loader: {
    position: 'absolute',
    bottom: 100, // Adjust distance from bottom
  }
});