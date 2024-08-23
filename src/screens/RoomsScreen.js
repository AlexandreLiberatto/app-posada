import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RoomsScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const initializeRooms = async () => {
      let storedRooms = await AsyncStorage.getItem('rooms');
      if (!storedRooms) {
        const initialRooms = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          occupied: false,
        }));
        await AsyncStorage.setItem('rooms', JSON.stringify(initialRooms));
        setRooms(initialRooms);
      } else {
        setRooms(JSON.parse(storedRooms));
      }
    };
    initializeRooms();
  }, []);

  const handleBook = (roomId) => {
    navigation.navigate('Booking', { roomId });
  };

  const handleVacate = async (roomId) => {
    const updatedRooms = rooms.map(room => 
      room.id === roomId ? { ...room, occupied: false } : room
    );
    setRooms(updatedRooms);
    await AsyncStorage.setItem('rooms', JSON.stringify(updatedRooms));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {rooms.map(room => (
        <View key={room.id} style={[styles.room, room.occupied ? styles.occupied : styles.available]}>
          <Text>{`Quarto ${room.id} - ${room.occupied ? 'Ocupado' : 'Livre'}`}</Text>
          {room.occupied ? (
            <Button title="Desocupar" onPress={() => handleVacate(room.id)} />
          ) : (
            <Button title="Locar" onPress={() => handleBook(room.id)} />
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  room: {
    width: '45%',
    padding: 20,
    margin: 10,
    borderRadius: 5,
  },
  occupied: {
    backgroundColor: 'red',
  },
  available: {
    backgroundColor: 'green',
  },
});
