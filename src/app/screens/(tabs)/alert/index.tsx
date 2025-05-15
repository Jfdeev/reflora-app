import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import styles from '../../../styles/alertStyles';

// Interface do alerta
interface Alert {
  alertId: number;
  sensorId: number;
  message: string;
  level: string;
  timestamp: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchAlerts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://10.89.3.116:3000/api/sensor/10/alerts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.status);
      }

      const data = await response.json();
      setAlerts(data);
      setError('');
    } catch (err: any) {
      console.error('Erro ao buscar alertas:', err);
      setError(err.message || 'Erro ao carregar os alertas');
    } finally {
      setLoading(false);
    }
  };

  // Atualização automática a cada 5 segundos
  useEffect(() => {
    fetchAlerts(); // Carrega inicialmente

    const interval = setInterval(() => {
      fetchAlerts();
    }, 5000); // 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo quando desmontar
  }, []);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'OK':
        return '#33582B';
      case 'Alerta':
        return '#CCAD2D';
      case 'Crítico':
        return '#CC5050';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alertas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.notifications}>
        {loading ? (
          <Text>Carregando alertas...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : alerts.length === 0 ? (
          <Text>Nenhum alerta encontrado.</Text>
        ) : (
          alerts.map((alert) => (
            <View
              key={alert.alertId}
              style={[styles.card, { backgroundColor: getAlertColor(alert.level) }]}
            >
              <FontAwesome name="bell" size={20} color="#000" style={{ marginRight: 10 }} />
              <Text style={styles.message}>
                {alert.message} -{' '}
                <Text style={{ fontStyle: 'italic' }}>
                  {new Date(alert.timestamp).toLocaleString()}
                </Text>
              </Text>
            </View>
          ))
        )}

        <Text style={styles.seeMore}>------------------Ver Mais------------------</Text>
      </ScrollView>
    </View>
  );
}
