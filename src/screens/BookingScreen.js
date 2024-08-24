import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookingScreen({ route, navigation }) {
  const { roomId } = route.params;
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [numDays, setNumDays] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const fetchGuestData = async () => {
      const storedGuests = await AsyncStorage.getItem('guests');
      const guests = storedGuests ? JSON.parse(storedGuests) : [];
      const guest = guests.find(g => g.name === name);
      if (guest) {
        setCpf(guest.cpf);
        setEmail(guest.email);
        setNumPeople(guest.numPeople);
      }
    };
    if (name) fetchGuestData();
  }, [name]);

  const validateInputs = () => {
    if (!name || !cpf || !email || !numPeople || !numDays || !paymentMethod) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos antes de confirmar a reserva.');
      return false;
    }
    return true;
  };

  const confirmBooking = () => {
    Alert.alert(
      'Confirmar Reserva',
      'Deseja confirmar a reserva deste apartamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: handleBooking,
        },
      ],
      { cancelable: false }
    );
  };

  const handleBooking = async () => {
    if (!validateInputs()) return;

    const storedGuests = await AsyncStorage.getItem('guests');
    const guests = storedGuests ? JSON.parse(storedGuests) : [];
    guests.push({ name, cpf, email, numPeople });
    await AsyncStorage.setItem('guests', JSON.stringify(guests));

    const storedRooms = await AsyncStorage.getItem('rooms');
    const rooms = JSON.parse(storedRooms);
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    rooms[roomIndex].occupied = true;
    await AsyncStorage.setItem('rooms', JSON.stringify(rooms));

    Alert.alert('Reserva realizada com sucesso!');
    navigation.navigate('Rooms');
  };

  return (
    <View style={styles.container}>
      <Text>Cadastro de Hóspede</Text>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="CPF" value={cpf} onChangeText={setCpf} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Número de Pessoas" value={numPeople} onChangeText={setNumPeople} style={styles.input} />
      <TextInput placeholder="Dias de Estadia" value={numDays} onChangeText={setNumDays} style={styles.input} />
      <TextInput placeholder="Forma de Pagamento" value={paymentMethod} onChangeText={setPaymentMethod} style={styles.input} />
      <Button title="Confirmar Reserva" onPress={confirmBooking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#BEBFC5'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    backgroundColor: 'white'
  },
});
