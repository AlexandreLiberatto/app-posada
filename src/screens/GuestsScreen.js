import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GuestsScreen() {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        // Buscar hóspedes e quartos do AsyncStorage
        const storedGuests = await AsyncStorage.getItem('guests');
        const storedRooms = await AsyncStorage.getItem('rooms');

        // Analisar os dados armazenados
        const rooms = storedRooms ? JSON.parse(storedRooms) : [];
        const guestsData = storedGuests ? JSON.parse(storedGuests) : [];

        // Verifique a estrutura dos dados
        console.log('Guests Data:', guestsData);
        console.log('Rooms Data:', rooms);

        // Filtrar hóspedes que estão em quartos ocupados
        const occupiedGuests = guestsData.filter(guest =>
          rooms.some(room => room.occupied && room.cpf === guest.cpf) // Certifique-se que cpf está correto
        );

        // Atualizar o estado com os hóspedes ocupados
        setGuests(occupiedGuests);
      } catch (error) {
        console.error('Error fetching guests or rooms from AsyncStorage:', error);
      }
    };

    // Chamar a função de busca quando o componente é montado
    fetchGuests();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {guests.length > 0 ? (
        guests.map((guest, index) => (
          <View key={index} style={styles.guestCard}>
            <Text style={styles.guestInfo}><Text style={styles.label}>Nome:</Text> {guest.name}</Text>
            <Text style={styles.guestInfo}><Text style={styles.label}>CPF:</Text> {guest.cpf}</Text>
            <Text style={styles.guestInfo}><Text style={styles.label}>Email:</Text> {guest.email}</Text>
            <Text style={styles.guestInfo}><Text style={styles.label}>Número de Pessoas:</Text> {guest.numPeople}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noGuestsText}>Nenhum hóspede locado encontrado.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  guestCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  guestInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  noGuestsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#555',
  },
});
