import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { LinearGradient } from 'expo-linear-gradient';
import { OnboardingContext } from '../context/Context';

const { width, height } = Dimensions.get('window');

const CameraScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [timer, setTimer] = useState(0); // 0 means no timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerCount, setTimerCount] = useState(0);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const {capturedPhoto, setCapturedPhoto} = useContext(OnboardingContext);
  const [recentMedia, setRecentMedia] = useState(null);
  
  const cameraRef = useRef(null);

  // Fetch the most recent photo from the gallery
  useEffect(() => {
    const getRecentPhoto = async () => {
      if (mediaPermission?.granted) {
        try {
          const media = await MediaLibrary.getAssetsAsync({
            first: 1,
            mediaType: 'photo',
            sortBy: [['creationTime', false]]
          });
          
          if (media.assets && media.assets.length > 0) {
            // Get the actual usable URI for the asset
            const asset = await MediaLibrary.getAssetInfoAsync(media.assets[0].id);
            setRecentMedia({
              ...media.assets[0],
              uri: asset.localUri || asset.uri
            });
          }
        } catch (error) {
          console.error("Failed to get recent media:", error);
        }
      }
    };
    
    getRecentPhoto();
  }, [mediaPermission?.granted]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            takePicture();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerCount]);

  if (!permission || !mediaPermission) {
    // Permissions are still loading
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0F4C81" />
        <Text style={styles.permissionMessage}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted || !mediaPermission.granted) {
    // Permissions are not granted yet
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#5DA7DB', '#87CEEB', '#B0E0E6']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need your permission to use the camera and save photos for your summit achievement.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={async () => {
              await requestPermission();
              await requestMediaPermission();
            }}
          >
            <Text style={styles.permissionButtonText}>Grant Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => {
      switch(current) {
        case 'off':
          return 'on';
        case 'on':
          return 'auto';
        default:
          return 'off';
      }
    });
  };

  const toggleTimer = () => {
    if (timer === 0) {
      setTimer(3); // 3 second timer
    } else if (timer === 3) {
      setTimer(5); // 5 second timer
    } else {
      setTimer(0); // no timer
    }
  };

  const startTimer = () => {
    if (timer > 0) {
      setTimerCount(timer);
      setIsTimerRunning(true);
    } else {
      takePicture();
    }
  };

  const openGallery = () => {
    // This is a placeholder - typically you would navigate to a gallery view
    // or use a photo picker here
    if (recentMedia) {
      Alert.alert("Gallery", "View your recent photos in the gallery");
    } else {
      Alert.alert("Gallery", "No recent photos found");
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !isTakingPicture) {
      try {
        setIsTakingPicture(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          exif: true,
        });
        
        setCapturedPhoto(photo);
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture. Please try again.");
      } finally {
        setIsTakingPicture(false);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const confirmPhoto = async () => {
    try {
      // Save to media library
      await MediaLibrary.saveToLibraryAsync(capturedPhoto.uri);
      
      // Get the saved asset to update recent media
      const savedAssets = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: 'photo',
        sortBy: [['creationTime', false]]
      });
      
      if (savedAssets.assets && savedAssets.assets.length > 0) {
        const asset = await MediaLibrary.getAssetInfoAsync(savedAssets.assets[0].id);
        setRecentMedia({
          ...savedAssets.assets[0],
          uri: asset.localUri || asset.uri
        });
      }
      
      // Navigate to certificate screen with photo and mountain info
      navigation.navigate('CertificateScreen', {
        photoUri: capturedPhoto.uri,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error saving picture:", error);
      Alert.alert("Error", "Failed to save picture. Please try again.");
    }
  };

  const getFlashIcon = () => {
    switch(flash) {
      case 'off':
        return { icon: '⚡️', text: 'Off' };
      case 'on':
        return { icon: '⚡️', text: 'On' };
      case 'auto':
        return { icon: '⚡️', text: 'Auto' };
      default:
        return { icon: '⚡️', text: 'Off' };
    }
  };

  const getTimerText = () => {
    if (timer === 0) return { icon: '⏱️', text: 'Off' };
    return { icon: '⏱️', text: `${timer}s` };
  };

  if (capturedPhoto) {
    // Photo preview screen
    return (
      <View style={styles.container}>
        <Image 
          source={{ uri: capturedPhoto.uri }} 
          style={styles.previewImage} 
        />
        <View style={styles.previewOverlay}>
          {/* Top gradient overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
            style={styles.previewTopGradient}
          >
            <View style={styles.previewHeader}>
              <TouchableOpacity
                style={styles.previewBackButton}
                onPress={retakePhoto}
              >
                <Text style={styles.previewBackButtonText}>←</Text>
              </TouchableOpacity>
              
              <View style={{width: 40}} />
            </View>
          </LinearGradient>
          
          {/* Bottom gradient with controls */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
            style={styles.previewBottomGradient}
          >
            <View style={styles.previewButtons}>
              <TouchableOpacity
                style={[styles.previewButton, styles.retakeButton]}
                onPress={retakePhoto}
              >
                <Text style={styles.previewButtonText}>Retake</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.previewButton, styles.useButton]}
                onPress={confirmPhoto}
              >
                <Text style={styles.previewButtonText}>Use Photo</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
        flashMode={flash}
      >
        <View style={styles.overlay}>
          {/* Top section with controls */}
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.5)', 'transparent']}
            style={styles.topGradient}
          >
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.controlIcon}>←</Text>
              </TouchableOpacity>
              
              
              <View style={styles.controlGroup}>
                <TouchableOpacity 
                  style={[styles.controlButton, flash !== 'off' && styles.activeControlButton]}
                  onPress={toggleFlash}
                >
                  <Text style={styles.controlIcon}>{getFlashIcon().icon}</Text>
                  <Text style={styles.controlText}>{getFlashIcon().text}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.controlButton, timer !== 0 && styles.activeControlButton]}
                  onPress={toggleTimer}
                >
                  <Text style={styles.controlIcon}>{getTimerText().icon}</Text>
                  <Text style={styles.controlText}>{getTimerText().text}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* Timer overlay (only shows when timer is active) */}
          {isTimerRunning && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{timerCount}</Text>
            </View>
          )}

          {/* Bottom section with capture button */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
            style={styles.bottomGradient}
          >
            <View style={styles.captureContainer}>
              {/* Recent photo thumbnail */}
              <TouchableOpacity
                style={styles.recentMediaButton}
                onPress={openGallery}
              >
                {recentMedia ? (
                  <Image 
                    source={{ uri: recentMedia.uri }} 
                    style={styles.recentMediaThumbnail} 
                  />
                ) : (
                  <View style={styles.recentMediaPlaceholder}>
                    <Text style={styles.recentMediaIcon}>🖼️</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {/* Capture button */}
              <TouchableOpacity
                style={[
                  styles.captureButton, 
                  (isTakingPicture || isTimerRunning) && styles.captureButtonDisabled
                ]}
                onPress={startTimer}
                disabled={isTakingPicture || isTimerRunning}
              >
                {isTakingPicture ? (
                  <ActivityIndicator size="large" color="#0F4C81" />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>
              
              {/* Flip camera button */}
              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.flipText}>↺</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  permissionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F4C81',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionMessage: {
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#0F4C81',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: '#0F4C81',
    fontSize: 14,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topGradient: {
    paddingTop: 40,
    paddingBottom: 60,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titleTextContainer: {
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitleText: {
    color: 'white',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  controlGroup: {
    flexDirection: 'row',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeControlButton: {
    backgroundColor: 'rgba(15,76,129,0.8)',
  },
  controlIcon: {
    color: 'white',
    fontSize: 18,
  },
  controlText: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
  },
  timerContainer: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 10,
  },
  timerText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  },
  bottomGradient: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: 'white',
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  flipText: {
    color: 'white',
    fontSize: 30,
  },
  recentMediaButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  recentMediaThumbnail: {
    width: '100%',
    height: '100%',
  },
  recentMediaPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  recentMediaIcon: {
    fontSize: 24,
    color: 'white',
  },
  // Preview screen styles
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  previewTopGradient: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  previewBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBackButtonText: {
    color: 'white',
    fontSize: 18,
  },
  previewTitleContainer: {
    alignItems: 'center',
  },
  previewTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  previewSubtitle: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  previewBottomGradient: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  previewButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  retakeButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'white',
  },
  useButton: {
    backgroundColor: '#0F4C81',
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default CameraScreen;