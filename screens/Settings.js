import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  Feather,
} from '@expo/vector-icons';

const ProfileSettings = ({ navigation }) => {
  const [user] = useState({
    name: 'Sukanta Besra',
    email: 'sukantajgec14@gmail.com',
    profileImage: 'https://avatar.iran.liara.run/public/boy?username=Ash',
  });

  const menuItems = [
    {
      title: 'Hiking Achievements',
      description: 'Download your achievement certificate',
      icon: <MaterialIcons name="emoji-events" size={20} color="#475569" />,
      screen: 'Achievements',
    },
    {
      title: 'About Us',
      description: 'Know more about us',
      icon: <Ionicons name="information-circle-outline" size={20} color="#475569" />,
      screen: 'AboutUs',
    },
    {
      title: 'Privacy & Control',
      description: 'Protect your account now',
      icon: <MaterialIcons name="security" size={20} color="#475569" />,
      screen: 'PrivacyControl',
    },
    {
      title: 'Log Out',
      description: 'Securely log out of account',
      icon: <Feather name="log-out" size={20} color="#475569" />,
      screen: 'Logout',
    },
    {
      title: 'Delete Account',
      description: 'Is hiking no longer on your to-do list?',
      icon: <Feather name="trash-2" size={20} color="#475569" />,
      screen: 'DeleteAccount',
    },
  ];

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
      </View>

      <ScrollView>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: user.profileImage }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editTxt}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuCard}
              onPress={() => handleNavigation(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconCircle}>{item.icon}</View>
                <View style={styles.textWrap}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc}>{item.description}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  backBtn: { 
    marginRight: 8 
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#E8F2FA',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    // elevation for Android
    elevation: 2,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: '#1D4ED8',
    borderRadius: 50,
    padding: 1,
    marginBottom: 12,
  },
  avatar: { 
    width: 92, 
    height: 92, 
    borderRadius: 46 
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: '#64748B',
  },
  editBtn: {
    marginTop: 16,
    backgroundColor: '#214F71',
    paddingHorizontal: 28,
    paddingVertical: 8,
    borderRadius: 50,
  },
  editTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    // elevation for Android
    elevation: 1,
  },
  menuLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: { 
    flexShrink: 1 
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  menuDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});