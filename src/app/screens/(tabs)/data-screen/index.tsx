import { Ionicons } from '@expo/vector-icons'; // ou outra lib de ícones
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import styles from '../../../styles/dataScreenStyles';

interface SensorData {
  ph: number;
  shadingIndex: number;
  airHumidity: number;
  soilHumidity: number;
  soilNutrients: string;
  temperature: number;
}

const cultureTypes = [
  { label: "Agrofloresta", value: "Agrofloresta" },
  { label: "Agricultura Orgânica", value: "Agricultura Orgânica" },
  { label: "Agricultura Biodinâmica", value: "Agricultura Biodinâmica" },
];

export default function DataScreen() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [culture, setCulture] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await fetch('http://192.168.15.9:3000/api/sensors/10/data/5', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || 'Erro ao buscar dados do sensor');
        }

        setSensorData(responseData);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Erro desconhecido ao buscar dados do sensor');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSensorData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dados do Cultivo</Text>

      <RNPickerSelect
        placeholder={{
          label: 'Tipo de cultura',
          value: null,
          color: 'black',
        }}
        items={cultureTypes}
        onValueChange={value => setCulture(value)}
        value={culture}
        useNativeAndroidPickerStyle={false}
        pickerProps={{
          itemStyle: {
            color: 'black',
          },
        }}
        Icon={() => <Ionicons name="chevron-down" size={24} color="gray" />}
        style={{
          inputIOS: {
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            color: 'black',
            paddingRight: 30, // evita que o texto fique atrás do ícone
            marginTop: 10,
          },
          inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            color: 'black',
            paddingRight: 30,
            marginTop: 10,
          },
          iconContainer: {
            top: 18,
            right: 12,
          },
          placeholder: {
            color: 'black',
          },
        }}
      />

      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: '#33582B' }]}>
          <Text style={styles.cardText}>ph: {sensorData?.ph ?? 'N/A'}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#CC5050' }]}>
          <Text style={styles.cardText}>
            Índice de Sombreamento: {sensorData?.shadingIndex ?? 'N/A'}%
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#33582B' }]}>
          <Text style={styles.cardText}>
            Umidade do solo: {sensorData?.soilHumidity ?? 'N/A'}%
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#33582B' }]}>
          <Text style={styles.cardText}>
            Nutrientes do solo: {sensorData?.soilNutrients ?? 'N/A'}
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#CCAD2D' }]}>
          <Text style={styles.cardText}>
            Umidade do ar: {sensorData?.airHumidity ?? 'N/A'}%
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#CCAD2D' }]}>
          <Text style={styles.cardText}>
            Temperatura: {sensorData?.temperature ?? 'N/A'}ºC
          </Text>
        </View>
      </View>

      <View style={styles.chartPlaceholder}>
        {/* Aqui vamos inserir componente de gráfico, ex: react-native-chart-kit ou react-native-svg-charts */}
        <Text style={styles.chartText}>[Gráfico de exemplo]</Text>
      </View>
    </View>
  );
}
