import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Button, TouchableOpacity } from 'react-native';
import styles from '../../../styles/alertStyles';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Interface do alerta
type Alert = {
  alertId: number;
  sensorId: number;
  message: string;
  level: string;
  timestamp: string;
};

// Interface do sensor
type Sensor = {
  sensorId: number;
  sensorName: string;
};

export default function NotificationsScreen() {
  const apiUrl = Constants?.expoConfig?.extra?.apiUrl!;
  const router = useRouter();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sensorsMap, setSensorsMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    registerForPushNotificationsAsync();
    fetchAllAlerts();
  }, []);

  // exibe notificação local
  const displayNotification = async (alert: Alert) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Alerta: ${alert.level}`,
        body: alert.message,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  };

  // obtém sensores do usuário e depois todos os alertas
  const fetchAllAlerts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const resSensors = await fetch(`${apiUrl}/sensors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resSensors.ok) throw new Error('Erro ao listar sensores');
      const sensors: Sensor[] = await resSensors.json();
      const map: Record<number, string> = {};
      sensors.forEach((s) => { map[s.sensorId] = s.sensorName; });
      setSensorsMap(map);

      const allAlerts: Alert[] = [];
      for (const sensor of sensors) {
        const res = await fetch(`${apiUrl}/sensor/${sensor.sensorId}/alerts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const sensorAlerts: Alert[] = await res.json();
          allAlerts.push(...sensorAlerts);
        }
      }
      allAlerts.sort((a, b) => b.alertId - a.alertId);
      setAlerts(allAlerts);

      await handleNewAlerts(allAlerts);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAlerts = async (newAlerts: Alert[]) => {
    const stored = await AsyncStorage.getItem('seenAlertIds');
    const seenIds: number[] = stored ? JSON.parse(stored) : [];
    const toNotify = newAlerts.filter(
      (a) => ['Crítico', 'Alerta'].includes(a.level) && !seenIds.includes(a.alertId)
    );
    if (toNotify.length) {
      for (const alert of toNotify) await displayNotification(alert);
      const updated = [...seenIds, ...toNotify.map((a) => a.alertId)].slice(-100);
      await AsyncStorage.setItem('seenAlertIds', JSON.stringify(updated));
    }
  };

  const deleteAlert = async (alertId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${apiUrl}/alert/${alertId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao excluir alerta');
      setAlerts((prev) => prev.filter((a) => a.alertId !== alertId));
    } catch (err) {
      console.error(err);
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'OK': return '#33582B';
      case 'Alerta': return '#CCAD2D';
      case 'Crítico': return '#CC5050';
      default: return '#FFFFFF';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alertas</Text>
      </View>
      <Button title="Atualizar Alertas" onPress={fetchAllAlerts} />
      <ScrollView contentContainerStyle={styles.notifications}>
        {loading ? (
          <Text>Carregando alertas...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : alerts.length === 0 ? (
          <Text>Nenhum alerta.</Text>
        ) : (
          alerts.map((alert) => (
            <View
              key={alert.alertId}
              style={[styles.card, { backgroundColor: getAlertColor(alert.level) }]}
            >
              <FontAwesome name="bell" size={20} color="#000" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.message}>
                  [{sensorsMap[alert.sensorId] || `Sensor ${alert.sensorId}`}] {alert.message}{' '}
                  <Text style={{ fontStyle: 'italic' }}>{new Date(alert.timestamp).toLocaleString()}</Text>
                </Text>
              </View>
              <TouchableOpacity onPress={() => deleteAlert(alert.alertId)}>
                <FontAwesome name="trash" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Use um dispositivo físico para notificações');
    return;
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (final !== 'granted') {
    alert('Permissão de notificações não concedida');
    return;
  }
  if (Device.osName === 'Android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Alertas Críticos',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}