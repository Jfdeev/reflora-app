import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //esse dimissKeyboard fiz p quando o usuário clicar na tela, ele sair da caixa de texto, como tem normalmente em outros apps. 
    const dismissKeyboard = () => {
            Keyboard.dismiss();
        };

    return (
<TouchableWithoutFeedback onPress={dismissKeyboard} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
  
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="name@example.com"
          style={styles.input}
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
  
        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Senha"
          style={styles.input}
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
  
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
  
      </View>
      </TouchableWithoutFeedback>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start', 
      padding: 20,
      paddingTop: 50,
      backgroundColor: '#EFEAD7',
    },
    title: {
      color: '#0B3824',
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 120, 
      textAlign: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#050038',
      marginBottom: 10,
      marginTop: 10,
      textAlign: 'left',
    },
    input: {
      height: 45,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
      color: '#333',
    },
    button: {
      marginTop: 20,   
      backgroundColor: '#1A1A1A',
      borderRadius: 5,
      paddingVertical: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });