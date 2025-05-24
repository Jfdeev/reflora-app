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
  temperature: number;
  condutivity: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
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

// Definição de faixas por parâmetro
const thresholds: Record<Metric, {
  ideal: [number, number];
  intermediate: [number, number] | [number, number][];
}> = {
  soilHumidity: {
    ideal: [20, 60],
    intermediate: [[15, 20], [60, 65]],
  },
  temperature: {
    ideal: [18, 30],
    intermediate: [[15, 18], [30, 33]],
  },
  condutivity: {
    ideal: [20, 200], 
    intermediate: [[15, 20], [200, 250]], 
  },
  ph: {
    ideal: [6.0, 7.0],
    intermediate: [[5.5, 6.0], [7.0, 7.5]],
  },
  nitrogen: {
    ideal: [20, 50],
    intermediate: [[15, 20], [50, 60]],
  },
  phosphorus: {
    ideal: [15, 40],
    intermediate: [[10, 15], [40, 50]],
  },
  potassium: {
    ideal: [100, 300],
    intermediate: [[80, 100], [300, 350]],
  },
};

// Retorna cor baseada na faixa
function getColor(metric: Metric, value: number): string {
  const { ideal, intermediate } = thresholds[metric];
  // Critico: fora de todos os intervalos
  const inIdeal = value >= ideal[0] && value <= ideal[1];
  const inIntermediate = Array.isArray(intermediate[0])
    ? (intermediate as [number, number][]).some(
        ([min, max]) => value >= min && value <= max
      )
    : (value >= (intermediate as [number, number])[0] && value <= (intermediate as [number, number])[1]);
  if (inIdeal) return '#33582B'; // verde
  if (inIntermediate) return '#CCAD2D'; // amarelo
  return '#CC5050'; // vermelho
}

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
          Icon={() => (
            <Ionicons
              name="chevron-down"
              size={18}
              color="gray"
              style={{ marginRight: 10, alignSelf: 'center' }}
            />
          )}
          style={{
            inputAndroid: styles.pickerAndroid,
            inputIOS: styles.pickerAndroid,
            iconContainer: { top: 12, right: 10 }, // Adjust icon position
          }}
        />

        <View style={styles.cardGrid}>
          {(
            [
              { label: 'Umidade do Solo', metric: 'soilHumidity' as Metric, suffix: '%' },
              { label: 'Temperatura', metric: 'temperature' as Metric, suffix: 'ºC' },
              { label: 'Condutividade do Solo', metric: 'condutivity' as Metric, suffix: '' },
              { label: 'PH', metric: 'ph' as Metric, suffix: '' },
              { label: 'Nitrogênio', metric: 'nitrogen' as Metric, suffix: '%' },
              { label: 'Fósforo', metric: 'phosphorus' as Metric, suffix: '%' },
              { label: 'Potássio', metric: 'potassium' as Metric, suffix: '%' },
            ] as const
          ).map(({ label, metric, suffix }) => {
            const rawValue = sensorData?.[metric] ?? 0;
            const valueStr = sensorData ? rawValue.toFixed(2) + suffix : 'N/A';
            const color = sensorData ? getColor(metric, rawValue) : '#CCCCCC';
            return (
              <Pressable key={metric} style={styles.cardWrapper} onPress={() => openDetail(metric)}>
                <View style={[styles.card, { backgroundColor: color }]}>                  
                  <Text style={styles.cardTextLabel}>{label}:</Text>
                  <Text style={styles.cardTextValue}>{valueStr}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {sensorData && (
          <View style={styles.chartContainer}>
            <BarChart
              data={{
                labels: ['Umidade','Temp.','Condut.','PH','N','P','K'],
                datasets: [{ data: [
                  sensorData.soilHumidity,
                  sensorData.temperature,
                  sensorData.condutivity,
                  sensorData.ph,
                  sensorData.nitrogen,
                  sensorData.phosphorus,
                  sensorData.potassium,
                ] }]  
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
                barPercentage: 0.7              
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
