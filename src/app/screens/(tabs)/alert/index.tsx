import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
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

interface UserSensor {
  sensorId: number;
  sensorName: string;
}

function getColor(level?: string): string {
  switch (level) {
    case 'Alerta':
      return '#CCAD2D'; // Amarelo
    case 'Crítico':
      return '#CC5050'; // Vermelho
    default:
      return '#999'; // Cinza neutro (fallback)
  }
}

type Metric =
  | 'soilHumidity'
  | 'temperature'
  | 'condutivity'
  | 'ph'
  | 'nitrogen'
  | 'phosphorus'
  | 'potassium';

export default function AlertScreen() {
  const apiUrl = Constants?.expoConfig?.extra?.apiUrl;
  const router = useRouter();
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [userSensors, setUserSensors] = useState<UserSensor[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSensorData = async (sensorId: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${apiUrl}/sensors/${sensorId}/data`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const arr: SensorData[] = await res.json();
    if (res.ok && arr.length) setSensorData(arr[arr.length - 1]);
    else setSensorData(null);
  };

  const fetchUserSensors = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${apiUrl}/sensors`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const arr: UserSensor[] = await res.json();
    if (res.ok && arr.length) setUserSensors(arr);
    else setUserSensors([]);
  };

  useEffect(() => {
    setLoading(true);
    fetchUserSensors().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedSensorId != null) {
      setLoading(true);
      fetchSensorData(selectedSensorId).finally(() => setLoading(false));
    } else {
      setSensorData(null);
    }
  }, [selectedSensorId]);

  const alertMetrics = sensorData
    ? [
        { metric: 'soilHumidity', label: 'Umidade do Solo', value: sensorData.soilHumidity.toFixed(2) + '%', level: sensorData.levelHumidity },
        { metric: 'temperature', label: 'Temperatura', value: sensorData.temperature.toFixed(2) + 'ºC', level: sensorData.levelTemperature },
        { metric: 'condutivity', label: 'Condutividade do Solo', value: sensorData.condutivity.toFixed(2), level: sensorData.levelCondutivity },
        { metric: 'ph', label: 'PH', value: sensorData.ph.toFixed(2), level: sensorData.levelPh },
        { metric: 'nitrogen', label: 'Nitrogênio', value: sensorData.nitrogen.toFixed(2) + '%', level: sensorData.levelNitrogen },
        { metric: 'phosphorus', label: 'Fósforo', value: sensorData.phosphorus.toFixed(2) + '%', level: sensorData.levelPhosphorus },
        { metric: 'potassium', label: 'Potássio', value: sensorData.potassium.toFixed(2) + '%', level: sensorData.levelPotassium },
      ].filter(item => item.level === 'Alerta' || item.level === 'Crítico')
    : [];

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

        {alertMetrics.map((item) => (
          <TouchableOpacity
            key={item.metric}
            style={[styles.card, { backgroundColor: getColor(item.level) }]}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Text style={styles.cardTextLabel}>{item.label}:</Text>
            <Text style={styles.cardTextValue}>{item.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
