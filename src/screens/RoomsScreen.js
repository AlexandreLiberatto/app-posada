import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function RoomsScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
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

  useEffect(() => {
    fetchRooms();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRooms(); // Atualiza a lista de quartos sempre que a tela ganhar foco
    }, [])
  );

  const handleBook = (roomId) => {
    navigation.navigate('Booking', { roomId });
  };

  const handleVacate = async (roomId) => {
    Alert.alert(
      'Desocupar Apartamento',
      'Deseja desocupar este apartamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            const updatedRooms = rooms.map(room => 
              room.id === roomId ? { ...room, occupied: false } : room
            );
            setRooms(updatedRooms);
            await AsyncStorage.setItem('rooms', JSON.stringify(updatedRooms));
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#BEBFC5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  room: {
    width: '48%', // Adjusted to fit two columns with spacing
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
  },
  occupied: {
    backgroundColor: 'red',
  },
  available: {
    backgroundColor: 'green',
  },
});
