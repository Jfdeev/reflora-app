import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import styles from '../../../styles/configStyles';

export default function ConfigScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userName, setUserName] = useState('Usuário');
  const [userEmail, setUserEmail] = useState('email@example.com');

  const router = useRouter();

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/screens/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const storedName = await AsyncStorage.getItem('name');
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
    };
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <Text style={styles.text}>Nome: {userName}</Text>
        <Text style={styles.text}>Email: {userEmail}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <Text style={styles.text}>Gerenciar notificações</Text>
        <View style={styles.switchContainer}>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ajuda e Suporte</Text>
        <Text style={styles.text}>Contato SAC: 0800 011 55 66</Text>
        <Text style={styles.text}>WhatsApp: (91) 99999-9999</Text>
      </View>

      {/* Agora o botão de logout está no fim da tela */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}