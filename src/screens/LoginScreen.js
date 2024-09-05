import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Definindo credenciais válidas
  const validUsername = 'admin';
  const validPassword = '1234';

  const handleLogin = () => {
    // Lógica para autenticação
    if (username === validUsername && password === validPassword) {
      // Credenciais válidas, navegue para a tela "Rooms"
      navigation.navigate('Rooms');
    } else {
      // Credenciais inválidas, exiba um alerta
      Alert.alert(
        'Ops...',
        'Usuário ou senha inválidos!',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
        { cancelable: false }
      );
    }
  };

  


  return (
    <ImageBackground
      source={require('../../assets/fundo_login.jpg')} // Caminho para a imagem na pasta assets
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Entrar" onPress={handleLogin} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    opacity: 0.5, // Ajuste a opacidade conforme necessário
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
