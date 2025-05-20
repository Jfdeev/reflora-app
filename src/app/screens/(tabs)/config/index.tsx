import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
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
    router.replace('/screens/welcome');
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

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <Text style={styles.text}><Text style={styles.label}>Nome:</Text> {userName}</Text>
        <Text style={styles.text}><Text style={styles.label}>Email:</Text> {userEmail}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <View style={styles.switchRow}>
          <Text style={styles.text}>Gerenciar notificações</Text>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ajuda e Suporte</Text>
        <Text style={styles.text}>SAC: 0800 011 55 66</Text>
        <Text style={styles.text}>WhatsApp: (91) 99999-9999</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}
