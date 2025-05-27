import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../../../styles/configStyles';

export default function ConfigScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userName, setUserName] = useState('Usuário');
  const [userEmail, setUserEmail] = useState('email@example.com');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/screens/welcome');
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const apiUrl = Constants?.expoConfig?.extra?.apiUrl;
      const response = await fetch(`${apiUrl}/user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      let responseData = null;
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (response.ok) {
        await AsyncStorage.removeItem('token');
        router.replace('/screens/welcome');
      } else {
        Alert.alert('Erro', responseData?.message || 'Erro ao excluir conta');
        console.error('Erro ao excluir conta:', responseData);
      }
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };


  const confirmDelete = () => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: handleDeleteAccount },
      ]
    );
  };

  const handleUpdateAccount = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const apiUrl = Constants?.expoConfig?.extra?.apiUrl;
      const response = await fetch(`${apiUrl}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
        }),
      });

      console.log('Response:', response);

      let responseData = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('name', userName);
        await AsyncStorage.setItem('email', userEmail);
        Alert.alert('Sucesso', responseData?.message || 'Dados atualizados com sucesso');
      } else {
        Alert.alert('Erro', responseData?.message || 'Erro ao atualizar conta');
        console.error('Erro ao atualizar conta:', responseData);
      }
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/screens/welcome');
        return;
      }

      const storedName = await AsyncStorage.getItem('name');
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
    };
    fetchUserData();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>Configurações</Text>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Conta</Text>

        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={userEmail}
          onChangeText={setUserEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateAccount}>
          <Text style={styles.updateText}>Atualizar conta</Text>
        </TouchableOpacity>
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

      <TouchableOpacity style={styles.logoutButton} onPress={confirmDelete}>
        <Text style={styles.logoutText}>Excluir conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
