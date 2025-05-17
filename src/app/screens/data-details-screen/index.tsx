import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import {
  LineChart
} from 'react-native-chart-kit'; // ou sua lib de preferência
import { default as chartConfig, default as styles } from './dataDetailsScreen';

interface SensorDataDetail {
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

type MetricKey = keyof Omit<SensorDataDetail, 'sensorDataId' | 'sensorId' | 'dateTime'>;

const metricConfig: Record<MetricKey, { label: string; icon: any; unit: string }> = {
  soilHumidity: { label: 'Umidade do Solo', icon: 'leaf', unit: '%' },
  temperature: { label: 'Temperatura', icon: 'thermometer', unit: '°C' },
  condutivity: { label: 'Condutividade', icon: 'water', unit: 'µS/cm' },
  ph: { label: 'PH', icon: 'water', unit: '' },
  nitrogen: { label: 'Nitrogênio', icon: 'leaf', unit: 'mg/L' },
  phosphorus: { label: 'Fósforo', icon: 'leaf', unit: 'mg/L' },
  potassium: { label: 'Potássio', icon: 'leaf', unit: 'mg/L' }
};

export default function DataDetailScreen() {
  const searchParams = useLocalSearchParams<{ sensorId: string; dataId: string; metric: MetricKey }>();
  const { sensorId, dataId, metric } = searchParams;
  const router = useRouter();
  const [allData, setAllData] = useState<SensorDataDetail[]>([]);
  const [current, setCurrent] = useState<SensorDataDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(
        `http://26.251.7.105:3000/api/sensors/${sensorId}/data`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const arr: SensorDataDetail[] = await res.json();
      setAllData(arr);
      setCurrent(arr.find(d => String(d.sensorDataId) === dataId) || null);
      setLoading(false);
    }
    load();
  }, [sensorId, dataId]);

  if (loading) return <ActivityIndicator style={styles.styles.loader} size="large" />;
  if (!current) return <Text style={styles.styles.errorText}>Dado não encontrado</Text>;

  const cfg = metricConfig[metric as MetricKey];
  const series = allData.map(d => ({
    x: new Date(d.dateTime).toLocaleDateString(),
    y: Number(d[metric])
  }));

  // agrupa por semana nas últimas 4 semanas
  const now = new Date();
  const weeks: { label: string; values: number[] }[] = [];
  for (let i = 3; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(now.getDate() - (i + 1) * 7);
    const end = new Date(now);
    end.setDate(now.getDate() - i * 7);
    const vals = allData
      .filter(d => {
        const dt = new Date(d.dateTime);
        return dt >= start && dt < end;
      })
      .map(d => Number(d[metric as MetricKey]));
    weeks.push({ label: `${i + 1} sem atrás`, values: vals });
  }

  const avgData = weeks.map(w => (w.values.length ? w.values.reduce((a, b) => a + b) / w.values.length : 0));
  const maxData = weeks.map(w => (w.values.length ? Math.max(...w.values) : 0));
  const labels = weeks.map(w => w.label);

  return (
    <ScrollView contentContainerStyle={styles.styles.container}>
      {/* Cabeçalho */}
      <View style={styles.styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
        <Text style={styles.styles.title}>{cfg.label}</Text>
      </View>

      {/* Valor Atual */}
      <View style={styles.styles.currentCard}>
        <Ionicons name={cfg.icon} size={28} color="#33582B" />
        <Text style={styles.styles.currentValue}>
          {String((current as any)[metric])}{cfg.unit}
        </Text>
        <Text style={styles.styles.currentTime}>
          Registrado em: {new Date(current!.dateTime).toLocaleString()}
        </Text>
      </View>

      {/* Histórico (linha) */}
      <View style={styles.styles.section}>
        <Text style={styles.styles.sectionTitle}>Histórico</Text>
        <LineChart
          data={{ labels: series.map(s => s.x), datasets: [{ data: series.map(s => s.y) }] }}
          width={styles.styles.chart.width}
          height={200}
          chartConfig={chartConfig.chartConfig}
        />
      </View>


       {/* Resumo Estatístico */}
  <View style={styles.styles.section}>
    <Text style={styles.styles.sectionTitle}>Resumo Estatístico</Text>
    <View style={styles.styles.statsRow}>
      <View style={styles.styles.statCard}>
        <Text style={styles.styles.statLabel}>Mínimo</Text>
        <Text style={styles.styles.statValue}>
          {Math.min(...allData.map(d => Number(d[metric]))).toFixed(2)}{cfg.unit}
        </Text>
      </View>
      <View style={styles.styles.statCard}>
        <Text style={styles.styles.statLabel}>Máximo</Text>
        <Text style={styles.styles.statValue}>
          {Math.max(...allData.map(d => Number(d[metric]))).toFixed(2)}{cfg.unit}
        </Text>
      </View>
      <View style={styles.styles.statCard}>
        <Text style={styles.styles.statLabel}>Média</Text>
        <Text style={styles.styles.statValue}>
          {(allData.reduce((sum, d) => sum + Number(d[metric]), 0) / allData.length).toFixed(2)}{cfg.unit}
        </Text>
      </View>
    </View>
  </View>
  </ScrollView>
  );
}
