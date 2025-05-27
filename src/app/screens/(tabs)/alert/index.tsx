import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import styles from '../../../styles/alertStyles';

interface SensorData {
  sensorDataId: number;
  soilHumidity: number;
  levelHumidity: string;
  temperature: number;
  levelTemperature: string;
  condutivity: number;
  levelCondutivity: string;
  ph: number;
  levelPh: string;
  nitrogen: number;
  levelNitrogen: string;
  phosphorus: number;
  levelPhosphorus: string;
  potassium: number;
  levelPotassium: string;
  dateTime: string;
}

type Alert = {
  alertId: number;
  sensorId: number;
  message: string;
  level: string;
  timestamp: string;
};

interface UserSensor {
  sensorId: number;
  sensorName: string;
}

function getColor(level?: string): string {
  switch (level) {
    case 'OK':
      return '#33582B';
    case 'Alerta':
      return '#CCAD2D';
    case 'Crítico':
      return '#CC5050';
    default:
      return '#999';
  }
}

export default function AlertScreen() {
  const apiUrl = Constants?.expoConfig?.extra?.apiUrl!;
  const router = useRouter();

  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [userSensors, setUserSensors] = useState<UserSensor[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sensorsMap, setSensorsMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Sensor info atual
  const alertMetrics = sensorData
    ? [
        { label: 'Umidade do Solo', value: sensorData.soilHumidity.toFixed(2) + '%', level: sensorData.levelHumidity },
        { label: 'Temperatura', value: sensorData.temperature.toFixed(2) + 'ºC', level: sensorData.levelTemperature },
        { label: 'Condutividade do Solo', value: sensorData.condutivity.toFixed(2), level: sensorData.levelCondutivity },
        { label: 'PH', value: sensorData.ph.toFixed(2), level: sensorData.levelPh },
        { label: 'Nitrogênio', value: sensorData.nitrogen.toFixed(2) + '%', level: sensorData.levelNitrogen },
        { label: 'Fósforo', value: sensorData.phosphorus.toFixed(2) + '%', level: sensorData.levelPhosphorus },
        { label: 'Potássio', value: sensorData.potassium.toFixed(2) + '%', level: sensorData.levelPotassium },
      ].filter((item) => item.level === 'Alerta' || item.level === 'Crítico')
    : [];

  // Carrega sensores e alertas
  useEffect(() => {
    registerForPushNotificationsAsync();
    fetchUserSensors();
  }, []);

  useEffect(() => {
    if (selectedSensorId != null) {
      fetchSensorData(selectedSensorId);
    } else {
      setSensorData(null);
    }
  }, [selectedSensorId]);

  const fetchUserSensors = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${apiUrl}/sensors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const sensors: UserSensor[] = await res.json();
    if (res.ok) {
      setUserSensors(sensors);
      const map: Record<number, string> = {};
      sensors.forEach((s) => (map[s.sensorId] = s.sensorName));
      setSensorsMap(map);
      fetchAllAlerts(sensors); // busca alertas ao obter sensores
    }
    setLoading(false);
  };

  const fetchSensorData = async (sensorId: number) => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${apiUrl}/sensors/${sensorId}/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: SensorData[] = await res.json();
    if (res.ok && data.length > 0) setSensorData(data[data.length - 1]);
    setLoading(false);
  };

  const fetchAllAlerts = async (sensors: UserSensor[]) => {
    try {
      const token = await AsyncStorage.getItem('token');
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
    } catch (err: any) {
      setError('Erro ao carregar alertas');
      console.error(err);
    }
  };

  const handleNewAlerts = async (newAlerts: Alert[]) => {
    const stored = await AsyncStorage.getItem('seenAlertIds');
    const seenIds: number[] = stored ? JSON.parse(stored) : [];
    const toNotify = newAlerts.filter(
      (a) => ['Crítico', 'Alerta'].includes(a.level) && !seenIds.includes(a.alertId)
    );

    for (const alert of toNotify) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Alerta: ${alert.level}`,
          body: alert.message,
          sound: true,
        },
        trigger: null,
      });
    }

    const updated = [...seenIds, ...toNotify.map((a) => a.alertId)].slice(-100);
    await AsyncStorage.setItem('seenAlertIds', JSON.stringify(updated));
  };

  const deleteAlert = async (alertId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${apiUrl}/alerts/${alertId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.alertId !== alertId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Alertas do Cultivo</Text>

        <RNPickerSelect
          placeholder={{ label: 'Selecione o Sensor', value: null }}
          items={userSensors.map((s) => ({
            label: s.sensorName,
            value: s.sensorId,
            key: String(s.sensorId),
          }))}
          onValueChange={(v) => setSelectedSensorId(v as number)}
          value={selectedSensorId}
          useNativeAndroidPickerStyle={false}
          Icon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
          style={{
            inputAndroid: styles.pickerAndroid,
            inputIOS: styles.pickerAndroid,
          }}
        />

        {loading && <Text>Carregando dados...</Text>}

        {!loading && selectedSensorId && alertMetrics.length === 0 && (
          <Text style={{ marginTop: 20, fontSize: 16, textAlign: 'center' }}>
            Nenhum alerta para este sensor no momento.
          </Text>
        )}

        {alertMetrics.map((item, idx) => (
          <View key={idx} style={[styles.card, { backgroundColor: getColor(item.level) }]}>
            <Text style={styles.cardTextLabel}>{item.label}:</Text>
            <Text style={styles.cardTextValue}>{item.value}</Text>
          </View>
        ))}

        <Text style={[styles.title, { marginTop: 30 }]}>Histórico de Alertas</Text>

        {alerts.length === 0 ? (
          <Text>Nenhum alerta registrado.</Text>
        ) : (
          alerts.map((alert) => (
            <View key={alert.alertId} style={[styles.card, { backgroundColor: getColor(alert.level) }]}>
              <Text style={styles.message}>
                [{sensorsMap[alert.sensorId] || `Sensor ${alert.sensorId}`}] {alert.message}{' '}
                <Text style={{ fontStyle: 'italic' }}>{new Date(alert.timestamp).toLocaleString()}</Text>
              </Text>
              <TouchableOpacity onPress={() => deleteAlert(alert.alertId)}>
                <FontAwesome name="trash" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
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
