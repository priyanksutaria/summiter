// LostInMountainScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const NoMountainScreen = () => {
  const navigation = useNavigation();

  const handleTryAgain = () => {
    // Navigate back to location detection screen or trigger location refresh
    navigation.navigate('PeakDetection');
  };

  return (
    <View style={styles.container}>
      {/* Background image with blue sky and snow mountain */}
      <ImageBackground 
        source={require('../assets/NotFound.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          {/* Paraglider image */}
          
          
          {/* Error message */}
          <View style={styles.messageContainer}>
            <Text style={styles.errorTitle}>IT SEEMS WE GOT LOST IN MOUNTAIN</Text>
            <Text style={styles.errorMessage}>
              Sorry, unable to detect any nearby summit.
            </Text>
          </View>
          
          {/* Try Again button */}
          <TouchableOpacity 
            style={styles.tryAgainButton}
            onPress={handleTryAgain}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1A4B78', '#2C6CA0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>TRY AGAIN</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 25,
    marginTop: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  errorTitle: {
    color: '#0F4C81',
    fontSize: 30,
    fontFamily: 'Oswald',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 60,
  },
  tryAgainButton: {
    width: '90%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 'auto',
    marginBottom: 80,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default NoMountainScreen;