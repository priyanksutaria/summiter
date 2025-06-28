import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Ionicons,
  Feather,
} from '@expo/vector-icons';

const EditProfile = ({ navigation, route }) => {
  // Initial user data could come from route params or a global state
  const [userData, setUserData] = useState({
    firstName: 'Sukanta',
    lastName: 'Besra',
    email: 'Sukanta.zzz.besra@gmail.com',
    profileImage: 'https://avatar.iran.liara.run/public/boy?username=Ash',
  });

  const handleSaveChanges = () => {
    // Here you would handle saving the changes to your backend or state
    // For now we'll just navigate back
    navigation.goBack();
  };

  const handleInputChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Image with Edit Button */}
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Feather name="edit-2" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={userData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={userData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email address</Text>
              <TextInput
                style={styles.textInput}
                value={userData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </ScrollView>
        
        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
    position: 'relative',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  saveButton: {
    backgroundColor: '#1E4784',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});