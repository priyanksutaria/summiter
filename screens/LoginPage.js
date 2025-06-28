import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { auth } from "../firebase";

const { width } = Dimensions.get('window');

export default function LoginPage({ navigation }) {
  const [fontsLoaded] = useFonts({
    'Oswald': require('../assets/fonts/Oswald.ttf'),
    'Helvetica': require('../assets/fonts/Helvetica.ttf'),
  });

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    // Fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground
      source={require("../assets/Loginpage.jpg")}
      style={styles.background}
      resizeMode="cover"
    >

      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Enhanced Logo with shadow */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/blue_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Subtitle with enhanced typography */}
        <Text style={styles.subtitle}>Every Mountain In Life Is Worth Celebrating</Text>

        {/* Sign up with email button - enhanced with gradient */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("PeakDetection")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'transparent']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <FontAwesome name="envelope" size={22} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Sign Up With Email</Text>
        </TouchableOpacity>

        {/* Divider with enhanced styling */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or use social media</Text>
          <View style={styles.divider} />
        </View>

        {/* Social media buttons - enhanced with gradient */}
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'transparent']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Image
            source={require("../assets/google.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Sign Up With Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'transparent']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Image
            source={require("../assets/Facebook.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Sign Up With Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'transparent']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Image
            source={require("../assets/Apple.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Sign Up With Apple</Text>
        </TouchableOpacity>


        {/* Sign in link - enhanced with shadow */}
        <Text style={styles.signInText}>
          Already have an account? <Text style={styles.signInLink}>Sign in</Text>
        </Text>

        {/* Terms and privacy policy - enhanced with shadow */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            You agree to our <Text style={styles.link}>Terms of service</Text> and{"\n"}
            <Text style={styles.link}>Privacy Policy</Text> applies to you.
          </Text>
        </View>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  logoContainer: {
    alignItems: 'center',
    top: -50,
    marginBottom: 100,
  },
  logo: {
    width: 150,
    height: 150,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
  subtitle: {
    fontFamily: "Helvetica",
    fontSize: 24,
    letterSpacing: 0.8,
    textAlign: "center",
    color: "white",
    marginBottom: 35,
    fontWeight: "600",
    lineHeight: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
    marginTop: -20,
  },
  button: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 25,
    marginBottom: 16,
    width: "100%",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  iconImage: {
    width: 22,
    height: 22,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  
  buttonText: {
    flex: 1,
    fontFamily: "Helvetica",
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  icon: {
    width: 22,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  dividerText: {
    marginHorizontal: 15,
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  signInText: {
    color: "white",
    marginTop: 25,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  signInLink: {
    color: "white",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  termsContainer: {
    position: "absolute",
    bottom: 25,
    width: "100%",
  },
  termsText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  link: {
    color: "white",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});