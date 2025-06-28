import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from './screens/LoginPage';
import Splash from './screens/Splash';
import SignupPage from './screens/SignupPage';
import PeakDetectionScreen from './screens/PeakDetectionScreen';
import SummitedScreen from './screens/SummitedScreen';
import ClimbingScreen from './screens/ClimbingScreen';
import NoMountainScreen from './screens/NoMountainScreen';
import CameraScreen from './screens/CameraScreen';
import CertificateScreen from './screens/CertificateScreen';
import ProfileSettings from './screens/Settings';
import EditProfile from './screens/EditProfile';
import HikingAchievements from './screens/HikingAchievements';
import AchievementDetail from './screens/AchievementDetail';
import { OnboardingProvider } from './context/Context';
import LoadScreen from './screens/InitialLoad';


const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <OnboardingProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="InitialLoad"
              component={LoadScreen} // Assuming you have an InitialLoad component
            />
            <Stack.Screen
              name="SplashScreen"
              component={Splash}
              options={{ gestureEnabled: true, headerLeft: () => null }}
            />
            <Stack.Screen
              name="LoginPage"
              component={LoginPage}
              options={{ gestureEnabled: true, headerLeft: () => null }}
            />
            <Stack.Screen name="SignUpPage" component={SignupPage} />
            <Stack.Screen name="PeakDetection" component={PeakDetectionScreen} />
            <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
            <Stack.Screen name="Summited" component={SummitedScreen} />
            <Stack.Screen name="Climbing" component={ClimbingScreen} />
            <Stack.Screen name="NoMountain" component={NoMountainScreen} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="CertificateScreen" component={CertificateScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Achievements" component={HikingAchievements} />
            <Stack.Screen name="AchievementDetail" component={AchievementDetail} />
          </Stack.Navigator>
        </NavigationContainer>
      </OnboardingProvider>
    </View>
  );
}
