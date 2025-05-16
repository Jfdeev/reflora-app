import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import styles from '../../../styles/dataScreenStyles';
import { BarChart } from 'react-native-chart-kit';

interface SensorData {
  sensorDataId: number;
  ph: number;
  shadingIndex: number;
  airHumidity: number;
  soilHumidity: number;
  soilNutrients: string;
  temperature: number;
  dateTime: string;
}

interface UserSensor {
  sensorId: number;
  sensorName: string;
}

type Metric =
  | 'ph'
  | 'shadingIndex'
  | 'airHumidity'
  | 'soilHumidity'
  | 'soilNutrients'
  | 'temperature';

const API_BASE = 'http://26.251.7.105:3000/api';

export default function DataScreen() {
  const router = useRouter();
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [userSensors, setUserSensors] = useState<UserSensor[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);


  const fetchSensorData = async (sensorId: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_BASE}/sensors/${sensorId}/data`, { headers: { Authorization: `Bearer ${token}` } });
    const arr: SensorData[] = await res.json();
    if (res.ok && arr.length) setSensorData(arr[arr.length - 1]);
    else setSensorData(null);
  };

  // Fetch the user's sensors from the API
  const fetchUserSensors = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_BASE}/sensors`, { headers: { Authorization: `Bearer ${token}` } });
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
        }}
      />


      <View style={styles.cardGrid}>
        {[
          { label: `PH`, value: sensorData?.ph.toFixed(2), color: '#33582B', metric: 'ph' as Metric },
          { label: 'Índice de Sombreamento', value: sensorData?.shadingIndex.toFixed(2) + '%', color: '#CC5050', metric: 'shadingIndex' as Metric },
          { label: 'Umidade do Solo', value: sensorData?.soilHumidity.toFixed(2) + '%', color: '#33582B', metric: 'soilHumidity' as Metric },
          { label: 'Nutrientes do Solo', value: sensorData?.soilNutrients, color: '#33582B', metric: 'soilNutrients' as Metric },
          { label: 'Umidade do Ar', value: sensorData?.airHumidity.toFixed(2) + '%', color: '#CCAD2D', metric: 'airHumidity' as Metric },
          { label: 'Temperatura', value: sensorData?.temperature.toFixed(2) + 'ºC', color: '#CCAD2D', metric: 'temperature' as Metric },
        ].map((item) => (
          <Pressable key={item.metric} style={[styles.cardWrapper]} onPress={() => openDetail(item.metric)}>
            <View style={[styles.card, { backgroundColor: item.color }]}>
              <Text style={styles.cardTextLabel}>{item.label}:</Text>
              <Text style={styles.cardTextValue}>{item.value ?? 'N/A'}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {sensorData && (
        <View style={styles.chartContainer}>
          <BarChart
        data={{
          labels: [
            'PH',
            'Sombreamento',
            'Solo',
            'Ar',
            'Temp'
          ],
          datasets: [
            {
          data: [
            sensorData.ph,
            sensorData.shadingIndex,
            sensorData.soilHumidity,
            sensorData.airHumidity,
            sensorData.temperature,
          ],
            },
          ],
        }}
        width={350}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(51, 88, 43, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
          />
        </View>
      )}
    </View>
  );
}
