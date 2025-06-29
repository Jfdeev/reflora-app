import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';
import styles from '../../../styles/dataScreenStyles';

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

type Metric =
  | 'soilHumidity'
  | 'temperature'
  | 'condutivity'
  | 'ph'
  | 'nitrogen'
  | 'phosphorus'
  | 'potassium';

const parameters = [
  { label: 'Umidade do Solo', metric: 'soilHumidity', levelKey: 'levelHumidity', suffix: '%' },
  { label: 'Temperatura', metric: 'temperature', levelKey: 'levelTemperature', suffix: 'ºC' },
  { label: 'Condutividade do Solo', metric: 'condutivity', levelKey: 'levelCondutivity', suffix: 'µS/cm' },
  { label: 'PH', metric: 'ph', levelKey: 'levelPh', suffix: '' },
  { label: 'Nitrogênio', metric: 'nitrogen', levelKey: 'levelNitrogen', suffix: 'mg/L' },
  { label: 'Fósforo', metric: 'phosphorus', levelKey: 'levelPhosphorus', suffix: 'mg/L' },
  { label: 'Potássio', metric: 'potassium', levelKey: 'levelPotassium', suffix: 'mg/L' },
] as const;

// Cor baseada no nível textual retornado da lógica fuzzy
const getColorByLevel = (level: string | null | undefined) => {
  const normalized = level?.toUpperCase?.() ?? 'DESCONHECIDO';
  switch (normalized) {
    case 'OK':
      return '#33582B';
    case 'ALERTA':
      return '#CCAD2D';
    case 'CRÍTICO':
      return '#CC5050';
    default:
      return '#F2E9D7'; // cor neutra para desconhecido ou nulo
  }
};

export default function DataScreen() {
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
    if (res.ok && arr.length) {
      const sorted = arr
        .filter(d => d.dateTime !== null)
        .sort((a, b) => new Date(a.dateTime!).getTime() - new Date(b.dateTime!).getTime());
      setSensorData(sorted[sorted.length - 1]);
    } else {
      setSensorData(null);
    }
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
    }
  }, [selectedSensorId]);

  const openDetail = (metric: Metric) => {
    if (selectedSensorId && sensorData) {
      router.push({
        pathname: '/screens/data-details-screen',
        params: {
          sensorId: String(selectedSensorId),
          dataId: String(sensorData.sensorDataId),
          metric,
        },
      });
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Dados do Cultivo</Text>

        <RNPickerSelect
          placeholder={{ label: 'Selecione o Sensor', value: null }}
          items={userSensors.map((s) => ({ label: s.sensorName, value: s.sensorId, key: String(s.sensorId) }))}
          onValueChange={(v) => setSelectedSensorId(v as number)}
          value={selectedSensorId}
          useNativeAndroidPickerStyle={false}
          Icon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
          style={{
            inputAndroid: styles.pickerAndroid,
            inputIOS: styles.pickerAndroid,
            iconContainer: { top: 12, right: 10 },
          }}
        />

        <View style={styles.cardGrid}>
          {parameters.map(({ label, metric, levelKey, suffix }) => {
            const raw = sensorData ? sensorData[metric] : 0;
            const level = sensorData ? sensorData[levelKey] : 'OK';
            return (
              <Pressable key={metric} style={styles.cardWrapper} onPress={() => openDetail(metric)}>
                <View style={[styles.card, { backgroundColor: getColorByLevel(level) }]}>
                  <Text style={styles.cardTextLabel}>{label}:</Text>
                  <Text style={styles.cardTextValue}>{raw != null ? `${raw.toFixed(2)}${suffix}` : 'N/A'}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {sensorData && (
          <View style={styles.chartContainer}>
            <BarChart
              data={{
                labels: ['Umidade', 'Temp.', 'Condut.', 'PH', 'N', 'P', 'K'],
                datasets: [{
                  data: [
                    sensorData.soilHumidity,
                    sensorData.temperature,
                    sensorData.condutivity,
                    sensorData.ph,
                    sensorData.nitrogen,
                    sensorData.phosphorus,
                    sensorData.potassium,
                  ]
                }]
              }}
              width={340}
              height={260}
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#F2E9D7',
                backgroundGradientFrom: '#F2E9D7',
                backgroundGradientTo: '#F2E9D7',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(51, 88, 43, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForLabels: { fontSize: 10, textAnchor: 'middle' },
                barPercentage: 0.7,
              }}
              style={{ marginVertical: 8, borderRadius: 16, alignSelf: 'center' }}
              verticalLabelRotation={-15}
              showValuesOnTopOfBars
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
