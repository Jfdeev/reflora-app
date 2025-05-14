import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../data-details-screen/dataDetailsScreen';
import { useSearchParams } from 'expo-router/build/hooks';

interface SensorDataDetail {
  sensorDataId: number;
  ph: number;
  shadingIndex: number;
  airHumidity: number;
  soilHumidity: number;
  soilNutrients: string;
  temperature: number;
  dateTime: string;
}

const API_BASE = 'http://26.251.7.105:3000/api';

export default function SensorDataDetailScreen() {
  const searchParams = useSearchParams();
  const sensorId = searchParams.get('sensorId');
  const dataId = searchParams.get('dataId');
  const router = useRouter();
  const [data, setData] = useState<SensorDataDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');

        const response = await fetch(
          `${API_BASE}/sensors/${sensorId}/data/${dataId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Erro ao buscar detalhe');
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [sensorId, dataId]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text onPress={() => router.back()} style={styles.backText}>
          <Ionicons name="arrow-back" size={20} /> Voltar
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Nenhum dado encontrado.</Text>
        <Text onPress={() => router.back()} style={styles.backText}>
          <Ionicons name="arrow-back" size={20} /> Voltar
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalhes do Dado</Text>
      <Text style={styles.timestamp}>Registrado em: {new Date(data.dateTime).toLocaleString()}</Text>

      <View style={styles.detailCard}>
        <Ionicons name="water" size={24} color="#33582B" />
        <Text style={styles.cardLabel}>PH</Text>
        <Text style={styles.cardValue}>{data.ph}</Text>
      </View>

      <View style={styles.detailCard}>
        <Ionicons name="sunny" size={24} color="#CC5050" />
        <Text style={styles.cardLabel}>Índice de Sombreamento</Text>
        <Text style={styles.cardValue}>{data.shadingIndex}%</Text>
      </View>

      <View style={styles.detailCard}>
        <Ionicons name="leaf" size={24} color="#33582B" />
        <Text style={styles.cardLabel}>Umidade do Solo</Text>
        <Text style={styles.cardValue}>{data.soilHumidity}%</Text>
      </View>

      <View style={styles.detailCard}>
        <Ionicons name="water-outline" size={24} color="#CCAD2D" />
        <Text style={styles.cardLabel}>Umidade do Ar</Text>
        <Text style={styles.cardValue}>{data.airHumidity}%</Text>
      </View>

      <View style={styles.detailCard}>
        <Ionicons name="analytics" size={24} color="#33582B" />
        <Text style={styles.cardLabel}>Nutrientes do Solo</Text>
        <Text style={styles.cardValue}>{data.soilNutrients}</Text>
      </View>

      <View style={styles.detailCard}>
        <Ionicons name="thermometer" size={24} color="#CCAD2D" />
        <Text style={styles.cardLabel}>Temperatura</Text>
        <Text style={styles.cardValue}>{data.temperature}°C</Text>
      </View>
    </ScrollView>
  );
}
