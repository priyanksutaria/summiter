import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { OnboardingContext } from '../context/Context';
import { useFonts } from 'expo-font';
import * as Location from 'expo-location';
import AppLoading from 'expo-app-loading';

const { width } = Dimensions.get('window');
const certificateWidth = Math.min(width * 0.9, 380);

const CertificateScreen = ({ route, navigation }) => {
  const { photoUri, timestamp } = route.params;
  const [sharing, setSharing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [readyToNavigate, setReadyToNavigate] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const {lat, long} = useContext(OnboardingContext);
  const [currentElevation, setCurrentElevation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const {certificateUri, setCertificateUri} = useContext(OnboardingContext);
  const { nearbyPeak } = useContext(OnboardingContext);
  
  // Format the date from ISO timestamp
  const summitDate = timestamp ? new Date(timestamp) : new Date();
  const formattedDate = summitDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Reference to certificate view for capturing as image
  const certificateRef = useRef();

   useEffect(() => {
    getCurrentLocationAndElevation();
  }, []);

    const getCurrentLocationAndElevation = async () => {
    try {
      setLocationLoading(true);
      
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Permission to access location was denied. Using default elevation.'
        );
        setCurrentElevation(0);
        setLocationLoading(false);
        return;
      }

      // Get current position with high accuracy
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      setCurrentLocation({
        latitude: lat,
        longitude: long,
      });

      // Get elevation (altitude from GPS)
      if (location.coords.altitude !== null) {
        // Convert meters to feet
        const elevationInFeet = Math.round(location.coords.altitude * 3.28084);
        setCurrentElevation(elevationInFeet);
      } else {
        // If GPS altitude is not available, try to get it from reverse geocoding
        try {
          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: lat,
            longitude: long,
          });
          
          // Note: Reverse geocoding doesn't always provide elevation
          // You might want to use a third-party elevation API here
          setCurrentElevation(0); // Default value
        } catch (error) {
          console.log('Could not get elevation from reverse geocoding');
          setCurrentElevation(0);
        }
      }
      
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Could not get current location. Using default elevation.'
      );
      setCurrentLocation({ latitude: lat, longitude: long });
      setCurrentElevation(0);
    } finally {
      setLocationLoading(false);
    }
  };
  
  const shareCertificate = async () => {
    try {
      setSharing(true);
      const uri = await captureRef(certificateRef, {
        format: 'png',
        quality: 1
      });
      
      if (Platform.OS === 'android') {
        const fileUri = `${FileSystem.cacheDirectory}certificate.png`;
        await FileSystem.copyAsync({
          from: uri,
          to: fileUri
        });
        
        await Share.share({
          url: fileUri,
          title: `${nearbyPeak.name} Summit Certificate`,
          message: `I successfully reached the summit of ${nearbyPeak.name} (${nearbyPeak.elevation})!`
        });
      } else {
        await Share.share({
          url: uri,
          title: `${nearbyPeak.name} Summit Certificate`
        });
      }
    } catch (error) {
      console.error("Error sharing certificate:", error);
      Alert.alert("Sharing failed", "Unable to share your certificate at this time.");
    } finally {
      setSharing(false);
    }
  };
  
  const saveCertificate = async () => {
    try {
      // Request permissions first
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Please grant permission to save photos to your gallery."
        );
        return;
      }
      
      setSaving(true);
      const uri = await captureRef(certificateRef, {
        format: 'png',
        quality: 1
      });
      
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Summit Certificates', asset, false);
      
      Alert.alert(
        "Certificate Saved",
        "Your summit certificate has been saved to your photo gallery."
      );
    } catch (error) {
      console.error("Error saving certificate:", error);
      Alert.alert("Save failed", "Unable to save your certificate at this time.");
    } finally {
      setSaving(false);
    }
  };

 useEffect(() => {
    // Wait for location to be loaded before capturing certificate
    if (!locationLoading && currentLocation) {
      const timer = setTimeout(async () => {
        try {
          const uri = await captureRef(certificateRef, {
            format: 'png',
            quality: 1,
          });
          setCertificateUri(uri);
        } catch (e) {
          console.error('Auto-capture/navigation failed', e);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [locationLoading, currentLocation]);

  const [fontsLoaded] = useFonts({
    'AlexBrush-Regular': require('../assets/fonts/AlexBrush-Regular.ttf')
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

   if (locationLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#1e3c72', '#2a5298', '#2e58b1']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Getting your coordinates...</Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#2e58b1']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summit Certificate</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileSettings')}
        >
          <FontAwesome5 name="user-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Certificate View - this will be captured for sharing */}
        <View ref={certificateRef} style={styles.certificateContainer} collapsable={false}>
          {/* Background Certificate Template */}
          <Image
            source={require('../assets/certificate-template.png')} // Update this path to your PNG template
            style={styles.certificateBackground}
            resizeMode="cover"
          />
          
          {/* Dynamic Text Overlay */}
          <View style={styles.textOverlay}>
            {/* Name Section */}
            <View style={styles.nameSection}>
              <Text style={styles.nameText}>PRIYANK SUTARIA</Text>
            </View>
            
            {/* Mountain Name Section */}
            <View style={styles.mountainSection}>
              <Text style={styles.mountainNameText}>{nearbyPeak.name.toUpperCase()}</Text>
            </View>
            
            
            {/* Details Section - Using current location and elevation */}
            <View style={styles.detailsSection}>
              <Text style={styles.detailsText}>
                {currentElevation || 0} ft  |  {currentLocation?.latitude.toFixed(4) || '0.0000'}, {currentLocation?.longitude.toFixed(4) || '0.0000'}
              </Text>
            </View>
            
            
            {/* Date Section */}
            <View style={styles.dateSection}>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>

            {/* Signature Section */}
            <View style={styles.signatureSection}>
              <Text style={styles.signatureText}>Summiter</Text>
            </View>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={shareCertificate}
            disabled={sharing}
          >
            {sharing ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <MaterialIcons name="share" size={24} color="white" />
                <Text style={styles.buttonText}>Share Certificate</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveCertificate}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <MaterialIcons name="save-alt" size={24} color="white" />
                <Text style={styles.buttonText}>Save to Gallery</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  certificateContainer: {
    width: certificateWidth,
    height: certificateWidth * 1.68, // Portrait aspect ratio matching your template
    margin: 20,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    position: 'relative',
  },
  certificateBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameSection: {
    position: 'absolute',
    top: '68%', // Adjust based on your template's "CERTIFIES THAT" section
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nameText: {
    fontFamily: 'Helvetica', // You'll need to load this font
    fontSize: 32,
    fontWeight: '700',
    color: '#024373',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  mountainSection: {
    position: 'absolute',
    top: '80%', // Adjust based on your template's mountain name section
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  mountainNameText: {
    fontFamily: 'Helvetica', // You'll need to load this font
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#023a76',
    letterSpacing: 2,
    textAlign: 'center',
  },
  detailsSection: {
    position: 'absolute',
    top: '85%', // Adjust based on your template
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  detailsText: {
    fontFamily: 'Helvetica', // You'll need to load this font
    fontSize: 16,
    fontWeight: '700',
    color: '#022e66',
    letterSpacing: 0.5,
  },
  dateSection: {
    position: 'absolute',
    bottom: '6%', // Adjust based on your template's date section
    left: 40,
  },
  dateText: {
    fontFamily: 'Helvetica', // You'll need to load this font
    fontSize: 18,
    fontWeight: '600',
    color: '#022e66',
    letterSpacing: 0.5,
  },
  signatureSection: {
    position: 'absolute',
    bottom: '5.5%', // Adjust based on your template's date section
    right: 25,
  },
  signatureText: {
    fontFamily: 'AlexBrush-Regular', // You'll need to load this font
    fontSize: 20,
    color: '#072a53',
    letterSpacing: 0.5,
  },
  actions: {
    width: '90%',
    marginTop: 10,
    marginBottom: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a5298',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34495e',
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default CertificateScreen;