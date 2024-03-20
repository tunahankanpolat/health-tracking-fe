import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// Örnek ilaç logları
const medicationLogs = [
  { id: 1, drugName: 'Parol', time: '10:00', date: '2024-03-20' },
  { id: 2, drugName: 'Aspirin', time: '12:30', date: '2024-03-20' },
  { id: 3, drugName: 'Amoklavin', time: '08:45', date: '2024-03-21' },
  // Daha fazla ilaç logu eklenebilir
];

const MedicationLogPage = () => {
  // Her bir ilaç logunu render etmek için kullanılacak öğe
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.drugName}</Text>
      <Text style={styles.itemText}>{item.time}</Text>
      <Text style={styles.itemText}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medication Logs</Text>
      {/* Ilac loglarini gosteren FlatList */}
      <FlatList
        data={medicationLogs}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default MedicationLogPage;
