import React, { useState, useEffect, useRef, useContext, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Easing,
  Alert
} from 'react-native';
import * as Location from "expo-location";
import { OnboardingContext } from '../context/Context';
// SQLite imports commented out
// import * as FileSystem from "expo-file-system";
// import { Asset } from 'expo-asset';

// Import the JSON data directly
import peaksData from '../assets/peaks.json';
import { set } from 'lodash';

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
  const {nearbyPeak, setNearbyPeak} = useContext(OnboardingContext);
  // Database state commented out
  // const [database, setDatabase] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const {setLat, setLong} = useContext(OnboardingContext);
  const [error, setError] = useState(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const radarRotation = useRef(new Animated.Value(0)).current;

  // Create animations for each concentric circle
  const circleCount = 5;
  const circleAppearAnims = Array(circleCount).fill().map(() => useRef(new Animated.Value(0)).current);
  const circleDisappearAnims = Array(circleCount).fill().map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    // console.log(database); // Commented out
    initializeApp();
  }, []);

  useEffect(() => {
    if (isDetecting) {
      startAnimations();
      startRealDetectionProcess();
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

  const initializeApp = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');

      if (status !== 'granted') {
        setError('Location permission is required for peak detection');
        return;
      }

      // Database initialization commented out
      // await initializeDatabase();

      console.log('App initialized with JSON data. Total peaks:', peaksData.peaks.length);

    } catch (err) {
      setError(`Initialization error: ${err.message}`);
    }
  };

  // Database initialization function commented out
  /*
  const initializeDatabase = async () => {
    try {
      const dbFileName = 'peaks.db';
      const dbUri = `${FileSystem.documentDirectory}${dbFileName}`;

      const fileInfo = await FileSystem.getInfoAsync(dbUri);
      if (!fileInfo.exists) {
        console.log('Database not found, copying from assets...');
        const asset = Asset.fromModule(require('../assets/peaks.db'));
        await asset.downloadAsync();
        await FileSystem.copyAsync({
          from: asset.localUri || asset.uri,
          to: dbUri,
        });
      }

      const db = SQLite.openDatabaseSync(dbFileName);
      console.log('Database initialized:', db);

      const allRows = await db.getAllAsync('SELECT * FROM peaks');
      for (const row of allRows) {
        console.log(row.id, row.value, row.intValue);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };
  */

  useEffect(() => {
    // console.log("Database state:", database ? "Loaded" : "Loading"); // Commented out
    console.log("Location permission:", locationPermission);
    console.log("Error state:", error);
    console.log("JSON data loaded:", peaksData ? "Yes" : "No");
  }, [locationPermission, error]);

  const startRealDetectionProcess = async () => {
    // Database check commented out
    // if (!database) {
    //   setError('Database not initialized');
    //   setIsDetecting(false);
    //   return;
    // }

    if (!locationPermission) {
      setError('Location permission not granted');
      setIsDetecting(false);
      return;
    }

    if (!peaksData || !peaksData.peaks) {
      setError('Peak data not loaded');
      setIsDetecting(false);
      return;
    }

    try {
      // Get current location
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeout: 10000,
      });

      const { latitude, longitude } = coords;
      //const latitude = 37.9140;
      //const longitude = -107.5049; 
      console.log(`Current location: ${latitude}, ${longitude}`);
      setLat(latitude);
      setLong(longitude);

      // Create a bounding box for initial filtering
      const delta = 0.01; // Roughly ±1km for initial search
      const minLat = latitude - delta;
      const maxLat = latitude + delta;
      const minLon = longitude - delta;
      const maxLon = longitude + delta;

      try {
        // Filter peaks using JSON data instead of SQL query
        const filteredPeaks = peaksData.peaks.filter(peak => 
          peak.latitude >= minLat && 
          peak.latitude <= maxLat &&
          peak.longitude >= minLon && 
          peak.longitude <= maxLon
        );

        console.log(`Found ${filteredPeaks.length} potential peaks`);

        // Find the closest peak using Haversine distance
        let closestPeak = null;
        let closestDistance = Infinity;

        filteredPeaks.forEach((peak) => {
          const distance = haversineDist(
            [latitude, longitude],
            [peak.latitude, peak.longitude]
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestPeak = { ...peak, distance };
          }
        });

        // Determine outcome based on distance
        setTimeout(() => {
          if (isDetecting) {
            if (closestPeak) {
              setNearbyPeak(closestPeak);

              if (closestDistance <= 50) { // Within 50 meters - you're at the summit
                setDetectionOutcome(DETECTION_OUTCOMES.SUMMITED);
              } else if (closestDistance <= 500) { // Within 500 meters - you're climbing
                setDetectionOutcome(DETECTION_OUTCOMES.CLIMBING);
              } else {
                setDetectionOutcome(DETECTION_OUTCOMES.NO_MOUNTAIN);
              }
            } else {
              setDetectionOutcome(DETECTION_OUTCOMES.NO_MOUNTAIN);
            }
            setIsDetecting(false);
          }
        }, 8000); // Keep the 8-second animation duration

      } catch (dataError) {
        console.error("Data processing error:", dataError);
        setError(`Data processing error: ${dataError.message}`);
        setIsDetecting(false);
      }

    } catch (err) {
      setError(`Location error: ${err.message}`);
      setIsDetecting(false);
    }
  };

  const haversineDist = ([lat1, lon1], [lat2, lon2]) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // meters
  };

  const navigateToResultScreen = () => {
    switch (detectionOutcome) {
      case DETECTION_OUTCOMES.SUMMITED:
        navigation.navigate('Summited', { peak: nearbyPeak });
        break;
      case DETECTION_OUTCOMES.CLIMBING:
        navigation.navigate('Climbing', { peak: nearbyPeak });
        break;
      case DETECTION_OUTCOMES.NO_MOUNTAIN:
        navigation.navigate('NoMountain');
        break;
      default:
        break;
    }

    // Reset outcome after navigation
    setDetectionOutcome(DETECTION_OUTCOMES.NONE);
  };

  const handleDetectionStart = () => {
    if (error) {
      Alert.alert(
        'Error',
        error,
        [
          { text: 'Retry', onPress: () => { setError(null); initializeApp(); } },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    if (!isDetecting) {
      setIsDetecting(true);
    }
  };

  const startAnimations = () => {
    // Pulse animation for center icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
      ])
    ).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: false,
    }).start();

    // Reset all animation values
    circleAppearAnims.forEach(anim => anim.setValue(0));
    circleDisappearAnims.forEach(anim => anim.setValue(0));

    // Create ripple effect
    const rippleDuration = 800;
    const rippleDelay = 150;
    const pauseDuration = 300;

    Animated.loop(
      Animated.sequence([
        // Phase 1: Appear from inside to outside
        Animated.stagger(rippleDelay,
          circleAppearAnims.map((anim, index) =>
            Animated.timing(anim, {
              toValue: 1,
              duration: rippleDuration,
              useNativeDriver: false,
              easing: Easing.bezier(0.2, 0.8, 0.3, 0.9),
            })
          )
        ),
        Animated.delay(pauseDuration),
        // Phase 2: Disappear from outside to inside
        Animated.stagger(rippleDelay,
          [...circleDisappearAnims].reverse().map((anim, index) =>
            Animated.timing(anim, {
              toValue: 1,
              duration: rippleDuration,
              useNativeDriver: false,
              easing: Easing.bezier(0.6, 0.1, 0.9, 0.4),
            })
          )
        ),
        Animated.delay(pauseDuration),
        // Reset all animations for next cycle
        Animated.parallel([
          ...circleAppearAnims.map(anim => Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false
          })),
          ...circleDisappearAnims.map(anim => Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false
          }))
        ])
      ])
    ).start();

    // Radar rotation animation
    Animated.loop(
      Animated.timing(radarRotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  };

  const stopAnimations = () => {
    pulseAnim.stopAnimation();
    progressAnim.stopAnimation();
    radarRotation.stopAnimation();
    pulseAnim.setValue(1);
    progressAnim.setValue(0);
    radarRotation.setValue(0);

    // Stop all circle animations
    circleAppearAnims.forEach(anim => {
      anim.stopAnimation();
      anim.setValue(0);
    });
    circleDisappearAnims.forEach(anim => {
      anim.stopAnimation();
      anim.setValue(0);
    });
  };

  // Convert the rotation value to degrees
  const spin = radarRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const getStatusText = () => {
    if (error) return 'ERROR - TAP TO RETRY';
    if (isDetecting) return 'DETECTING NEARBY PEAKS...';
    if (!locationPermission) return 'LOCATION PERMISSION REQUIRED';
    // Database check commented out
    // if (!database) return 'INITIALIZING DATABASE...';
    if (!peaksData) return 'LOADING PEAK DATA...';
    return 'TAP TO START DETECTION';
  };

  return (
    <View style={styles.container}>
      {/* Notification Box */}
      <TouchableOpacity style={styles.notificationBox} onPress={() => navigation.navigate('ProfileSettings')} activeOpacity={0.8}>
        <Text style={styles.notificationText}>
          Not hiking right now? Would still love to check out the app.
        </Text>
        <View>
          <Text style={styles.arrow}>→</Text>
        </View>
      </TouchableOpacity>

      {/* Peak Info Display */}
      {nearbyPeak && !isDetecting && (
        <View style={styles.peakInfoContainer}>
          <Text style={styles.peakInfoText}>
            {nearbyPeak.name} - {Math.round(nearbyPeak.distance)}m away
          </Text>
        </View>
      )}

      {/* Animated Detection Area */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={handleDetectionStart}
        activeOpacity={0.8}
        disabled={isDetecting}
      >
        {/* Animated Rippling Circles */}
        {Array(circleCount).fill().map((_, index) => {
          const size = 360 - index * 60;
          const maxOpacity = 0.7 - index * 0.1;
          const shadowMaxOpacity = 0.5 - index * 0.08;

          return (
            <Animated.View
              key={`wave-${index}`}
              style={[
                styles.rippleWave,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  opacity: Animated.subtract(
                    circleAppearAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, maxOpacity]
                    }),
                    circleDisappearAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, maxOpacity]
                    })
                  ),
                  backgroundColor: `rgba(144, 183, 208, ${0.35 - index * 0.06})`,
                  shadowOpacity: Animated.subtract(
                    circleAppearAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, shadowMaxOpacity]
                    }),
                    circleDisappearAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, shadowMaxOpacity]
                    })
                  ),
                  transform: [
                    {
                      scale: Animated.add(
                        0.85,
                        Animated.multiply(
                          0.20,
                          Animated.subtract(
                            circleAppearAnims[index],
                            circleDisappearAnims[index]
                          )
                        )
                      )
                    }
                  ],
                  zIndex: circleCount - index
                }
              ]}
            />
          );
        })}

        {/* Radar Sweep Animation */}
        {isDetecting && (
          <Animated.View
            style={[
              styles.radarContainer,
              {
                transform: [{ rotate: spin }],
                opacity: 0.7,
              }
            ]}
          >
            <View style={styles.radarSweep} />
          </Animated.View>
        )}

        {/* Center Icon with Pulse */}
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: pulseAnim }],
              shadowOpacity: pulseAnim.interpolate({
                inputRange: [1, 1.1],
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

      {/* Debug/Test Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { navigation.navigate('Summited', { peak: nearbyPeak }) }}
        >
          <Text style={styles.buttonText}>Summited</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { navigation.navigate('Climbing', { peak: nearbyPeak }) }}
        >
          <Text style={styles.buttonText}>Climbing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { navigation.navigate('NoMountain') }}
        >
          <Text style={styles.buttonText}>No peak</Text>
        </TouchableOpacity>
      </View>

      {/* Status Text */}
      <Text style={[styles.statusText, error && styles.errorText]}>
        {getStatusText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F4A69',
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
  peakInfoContainer: {
    position: 'absolute',
    top: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  peakInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#204F71',
    textAlign: 'center',
  },
  iconContainer: {
    width: 360,
    height: 360,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleWave: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 0,
    shadowColor: '#90B7D0',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 8,
  },
  radarContainer: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    overflow: 'hidden',
  },
  radarSweep: {
    position: 'absolute',
    width: 180,
    height: 3,
    backgroundColor: 'rgba(65, 215, 205, 0.8)',
    top: 180,
    right: 0,
    transform: [{ translateY: -1.5 }],
    shadowColor: '#41D7CD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderRadius: 1.5,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(230, 237, 242, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  icon: {
    width: 70,
    height: 70,
    tintColor: '#5E6D78',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 120,
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  errorText: {
    color: '#FF6B6B',
  },
});

export default PeakDetectionScreen;