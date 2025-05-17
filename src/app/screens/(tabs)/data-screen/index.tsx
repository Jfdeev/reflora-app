import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
  | 'potassium'

const API_BASE = 'http://192.168.0.12:3000/api';

export default function DataScreen() {
  const router = useRouter();
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [userSensors, setUserSensors] = useState<UserSensor[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);


  const fetchSensorData = async (sensorId: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_BASE}/sensors/${sensorId}/data`, {method:'GET', headers: { Authorization: `Bearer ${token}` } });
    const arr: SensorData[] = await res.json();
    if (res.ok && arr.length) setSensorData(arr[arr.length - 1]);
    else setSensorData(null);
  };

  // Fetch the user's sensors from the API
  const fetchUserSensors = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_BASE}/sensors`, {method: 'GET', headers: { Authorization: `Bearer ${token}` } });
    const arr: UserSensor[] = await res.json();
    console.log(arr);
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
          { label: 'Umidade do Solo', value: sensorData?.soilHumidity.toFixed(2) + '%', color: '#33582B', metric: 'soilHumidity' as Metric },
          { label: 'Temperatura', value: sensorData?.temperature.toFixed(2) + 'ºC', color: '#CCAD2D', metric: 'temperature' as Metric },
          { label: 'Condutividade do Solo', value: sensorData?.condutivity, color: '#33582B', metric: 'condutivity' as Metric },
          { label: `PH`, value: sensorData?.ph.toFixed(2), color: '#33582B', metric: 'ph' as Metric },
          { label: 'Nitrogênio', value: sensorData?.nitrogen.toFixed(2) + '%', color: '#CC5050', metric: 'nitrogen' as Metric },
          { label: 'Fósforo', value: sensorData?.phosphorus.toFixed(2) + '%', color: '#CCAD2D', metric: 'phosphorus' as Metric },
          { label: 'Potássio', value: sensorData?.potassium.toFixed(2) + '%', color: '#CCAD2D', metric: 'potassium' as Metric },
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
            'Umidade do Solo',
            'Temperatura',
            'Condutividade',
            'PH',
            'Nitrogênio',
            'Fósforo',
            'Potássio',
          ],
          datasets: [
            {
          data: [
            sensorData.soilHumidity,
            sensorData.temperature,
            sensorData.condutivity,
            sensorData.ph,
            sensorData.nitrogen,
            sensorData.phosphorus,
            sensorData.potassium,
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
