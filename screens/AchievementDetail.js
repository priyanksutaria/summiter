// screens/AchievementDetail.js

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const TAB_UNDERLINE_WIDTH = 60;

export default function AchievementDetail({ route, navigation }) {
  const { mountainName, certificateUri, capturedPhoto } = route.params;
  const [activeTab, setActiveTab] = useState('Certificate');
  const [description, setDescription] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mountainName}</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Certificate', 'Selfie'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && (
              <View style={styles.underline} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'Certificate' ? (
          <Image
            source={{ uri: certificateUri }}
            style={styles.certificateImage}
            resizeMode="contain"
          />
        ) : (
          <>
            <Image
              source={{ uri: capturedPhoto }}
              style={styles.selfieImage}
              resizeMode="cover"
            />
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Start typing here…"
                placeholderTextColor="#64748B"
                multiline
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
  },

  tabs: {
    flexDirection: 'row',
    marginTop: 8,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1D4ED8',
  },
  underline: {
    position: 'absolute',
    bottom: -1,
    width: TAB_UNDERLINE_WIDTH,
    height: 2,
    backgroundColor: '#1D4ED8',
    borderRadius: 1,
  },

  content: {
    padding: 16,
    alignItems: 'center',
  },
  certificateImage: {
    width: width - 32,
    height: (width - 32) * 1.4,  // adjust aspect as needed
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  selfieImage: {
    width: width - 32,
    height: (width - 32) * 0.75,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: '#F1F5F9',
  },
  inputWrapper: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1E293B',
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
  },
});
