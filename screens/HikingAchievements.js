import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Modal,
  Alert,
  Share,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  Feather,
} from '@expo/vector-icons';
import { OnboardingContext } from '../context/Context';

// Mock data for hiking achievements
const initialAchievements = [
  {
    id: '1',
    mountain: 'Mountain Name',
    elevation: '5,239 ft',
    date: '02.03.2024',
    image: require('../assets/mountain-placeholder.png') // Replace with your actual image path
  },
  {
    id: '2',
    mountain: 'Mountain Name',
    elevation: '5,239 ft',
    date: '02.03.2024',
    image: require('../assets/mountain-placeholder.png')
  },
  {
    id: '3',
    mountain: 'Mountain Name',
    elevation: '5,239 ft',
    date: '02.03.2024',
    image: require('../assets/mountain-placeholder.png')
  },
  {
    id: '4',
    mountain: 'Mountain Name',
    elevation: '5,239 ft',
    date: '02.03.2024',
    image: require('../assets/mountain-placeholder.png')
  },
  {
    id: '5',
    mountain: 'Mountain Name',
    elevation: '5,239 ft',
    date: '02.03.2024',
    image: require('../assets/mountain-placeholder.png')
  },
  {
    id: '6',
    mountain: 'Mountain Name',
    elevation: '5,239 ft',
    date: '02.03.2024',
    image: require('../assets/mountain-placeholder.png')
  },
  {
    id: '7',
    mountain: 'Mountain Name',
    elevation: '5,239 ft',
    date: '02.03.2024',
    image: require('../assets/mountain-placeholder.png')
  },
  {
    id: '8',
    mountain: 'Mountain Name',
    elevation: '5,239 ft',
    date: '02.03.2024',
    image: require('../assets/mountain-placeholder.png')
  },
  {
    id: '9',
    mountain: 'Mountain Name',
    elevation: '5,239 ft',
    date: '02.03.2024',
    image: require('../assets/mountain-placeholder.png')
  }
];

const HikingAchievements = ({ navigation }) => {
  const [achievements, setAchievements] = useState(initialAchievements);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const {capturedPhoto, setCapturedPhoto} = useContext(OnboardingContext);
  const {certificateUri, setCertificateUri} = useContext(OnboardingContext);

  console.log("Captured Photo: ", capturedPhoto);

  const handleOptionsPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleViewAchievement = () => {
    setModalVisible(false);
    navigation.navigate('AchievementDetail', { achievement: selectedItem, capturedPhoto: capturedPhoto.uri, certificateUri: certificateUri });
  };

  const handleDownloadAchievement = () => {
    setModalVisible(false);
    Alert.alert(
      "Certificate Download",
      "Your achievement certificate will be downloaded.",
      [{ text: "OK" }]
    );
    // In a real app, implement download functionality here
  };

  const handleDeleteAchievement = () => {
    setModalVisible(false);
    Alert.alert(
      "Delete Achievement",
      "Are you sure you want to delete this achievement?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setAchievements(achievements.filter(item => item.id !== selectedItem.id));
          }
        }
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete All Achievements",
      "Are you sure you want to delete all achievements? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete All", 
          style: "destructive",
          onPress: () => {
            setAchievements([]);
          }
        }
      ]
    );
  };

  const renderAchievementItem = ({ item }) => (
    <View style={styles.achievementCard}>
      <View style={styles.achievementLeft}>
        <Image source={item.image} style={styles.mountainImage} />
        <View style={styles.achievementInfo}>
          <Text style={styles.mountainName}>{item.mountain}</Text>
          <Text style={styles.achievementDate}>{item.date}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => handleOptionsPress(item)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#64748B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hiking History</Text>
        <TouchableOpacity onPress={handleDeleteAll} style={styles.deleteAllBtn}>
          <Text style={styles.deleteAllText}>Delete All</Text>
        </TouchableOpacity>
      </View>

      {/* Achievement Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>{achievements.length} Items</Text>
      </View>

      {/* Achievements List */}
      <FlatList
        data={achievements}
        renderItem={renderAchievementItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="emoji-events" size={60} color="#94A3B8" />
            <Text style={styles.emptyText}>No hiking achievements yet</Text>
          </View>
        }
      />

      {/* Options Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleViewAchievement}
            >
              <Ionicons name="eye-outline" size={20} color="#334155" />
              <Text style={styles.modalOptionText}>View</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleDownloadAchievement}
            >
              <Feather name="download" size={20} color="#334155" />
              <Text style={styles.modalOptionText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalOption, styles.deleteOption]}
              onPress={handleDeleteAchievement}
            >
              <Feather name="trash-2" size={20} color="#EF4444" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default HikingAchievements;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  backBtn: { 
    padding: 4
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    flex: 1,
    marginLeft: 12,
  },
  deleteAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteAllText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
  },
  countText: {
    fontSize: 14,
    color: '#64748B',
  },
  listContainer: {
    padding: 16,
  },
  achievementCard: {
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
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mountainImage: {
    width: 56,
    height: 42,
    borderRadius: 8,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  mountainName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  achievementDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  optionsButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    width: '80%',
    maxWidth: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  modalOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#334155',
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  deleteText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#EF4444',
  },
});