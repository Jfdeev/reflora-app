import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './welcomeStyles';


export default function WelcomeScreen() {
const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo!</Text>
      <Image
        source={require('@/src/assets/images/reflora-logo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>
        Uma plataforma para {'\n'} gerenciar seus sensores!
      </Text>

      <Text style={styles.loginregister}>Já tem uma conta?</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/login')}>
        <Text style={styles.buttonText}>Fazer Login</Text>
      </TouchableOpacity>

      <Text style={styles.loginregister}>Primeira vez aqui?</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/register')}>
        <Text style={styles.buttonText}>Cadastrar-se</Text>
      </TouchableOpacity>
    </View>
  );
}

