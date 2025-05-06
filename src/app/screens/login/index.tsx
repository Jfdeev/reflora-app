import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import styles from './loginStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  //esse dimissKeyboard fiz p quando o usuário clicar na tela, ele sair da caixa de texto, como tem normalmente em outros apps. 
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} style={{ flex: 1 }}>
      <View style={styles.container}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>

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

        <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/(tabs)/home')}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

      </View>
    </TouchableWithoutFeedback>
  );
}