import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { default as chartConfig, default as styles } from './dataDetailsScreen';

// Tipagem do dado do sensor
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

// Métricas disponíveis
type MetricKey = keyof Omit<SensorDataDetail, 'sensorDataId' | 'dateTime'>;

// Configuração de exibição das métricas
const metricConfig: Record<MetricKey, { label: string; icon: any; unit: string }> = {
  soilHumidity: { label: 'Umidade do Solo', icon: 'leaf', unit: '%' },
  temperature: { label: 'Temperatura', icon: 'thermometer', unit: '°C' },
  condutivity: { label: 'Condutividade', icon: 'water', unit: 'µS/cm' },
  ph: { label: 'pH', icon: 'water', unit: '' },
  nitrogen: { label: 'Nitrogênio', icon: 'leaf', unit: 'mg/L' },
  phosphorus: { label: 'Fósforo', icon: 'leaf', unit: 'mg/L' },
  potassium: { label: 'Potássio', icon: 'leaf', unit: 'mg/L' },
};

// Faixas ideais e intermediárias por métrica
const thresholds: Record<MetricKey, {
  ideal: [number, number];
  intermediate: [number, number][];
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

// Determina a cor com base nos thresholds
function getColor(metric: MetricKey, value: number): string {
  const { ideal, intermediate } = thresholds[metric];
  const isIdeal = value >= ideal[0] && value <= ideal[1];
  const isIntermediate = intermediate.some(([min, max]) => value >= min && value <= max);
  if (isIdeal) return '#33582B';       // verde
  if (isIntermediate) return '#CCAD2D'; // amarelo
  return '#CC5050';                    // vermelho
}

// Sugestão com base no valor atual
function getSuggestion(metric: MetricKey, value: number): string | null {
  switch (metric) {
    case 'soilHumidity':
      if (value < 20) {
        return 'O solo está muito seco. Você pode espalhar folhas secas, capim ou palha vegetal para cobrir a terra. Outra opção é colocar jornais úmidos entre as plantas para manter a umidade.';
      }
      if (value > 60) {
        return 'O solo está encharcado. Tente fazer pequenos sulcos ou canais para escoar o excesso de água. Também pode misturar um pouco de areia grossa na terra para ajudar na drenagem.';
      }
      break;

    case 'temperature':
      if (value < 18) {
        return 'A temperatura está baixa para o desenvolvimento das plantas. Você pode cobrir o solo com uma lona preta durante a noite para manter o calor, ou plantar leguminosas como o feijão-de-porco para ajudar a aquecer o ambiente.';
      }
      if (value > 30) {
        return 'Está fazendo muito calor. Use tecidos brancos ou coberturas claras para proteger o solo e as plantas do sol forte. Também pode borrifar um pouco de água nas plantas pela manhã para refrescar.';
      }
      break;

    case 'condutivity':
      if (value < 20) {
        return 'O solo tem poucos nutrientes solúveis. Prepare um "chá de composto", fervendo restos de vegetais e folhas, e use essa água para regar o solo.';
      }
      if (value > 200) {
        return 'O solo está com muitos sais. Regue bem o local e deixe a água escorrer naturalmente para ajudar a limpar o excesso. Depois, adicione bastante matéria orgânica como folhas secas ou composto caseiro.';
      }
      break;

    case 'ph':
      if (value < 5.5) {
        return 'O solo está muito ácido. Você pode moer cascas de ovos e espalhar no solo. Isso ajuda a equilibrar o pH e melhora o ambiente para as raízes.';
      }
      if (value > 7.5) {
        return 'O solo está muito alcalino. Tente misturar um pouco de borra de café e vinagre diluído na água e regar a área. Isso ajuda a tornar o solo mais neutro.';
      }
      break;

    case 'nitrogen':
      if (value < 15) {
        return 'Falta nitrogênio no solo, e isso afeta o crescimento das plantas. Espalhe borra de café no canteiro e misture com a terra. Isso vai ajudar a fortalecer as folhas.';
      }
      if (value > 60) {
        return 'Tem nitrogênio demais no solo. Isso pode atrapalhar o equilíbrio dos nutrientes. Misture um pouco de carvão vegetal na terra e reduza o uso de adubos por um tempo.';
      }
      break;

    case 'phosphorus':
      if (value < 10) {
        return 'Seu solo precisa de mais fósforo para ajudar no crescimento das raízes. Triture alguns ossos (como de frango ou boi), seque bem e espalhe o pó na terra.';
      }
      if (value > 50) {
        return 'Há fósforo demais no solo. Evite adubar por um tempo e troque o tipo de planta cultivada. Plantas como feijão ou amendoim ajudam a reequilibrar o solo.';
      }
      break;

    case 'potassium':
      if (value < 80) {
        return 'As plantas estão precisando de potássio. Corte cascas de banana em pedaços pequenos e espalhe pela terra, cobrindo com um pouco de palha ou folhas.';
      }
      if (value > 350) {
        return 'Tem potássio demais no solo. Faça uma irrigação mais profunda e adicione bastante matéria orgânica, como folhas secas e restos de vegetais, para equilibrar.';
      }
      break;
  }
  return null;
}

export default function DataDetailScreen() {
  const apiUrl = Constants?.expoConfig?.extra?.apiUrl;
  const { sensorId, dataId, metric } = useLocalSearchParams<{ sensorId: string; dataId: string; metric: MetricKey }>();
  const router = useRouter();
  const [allData, setAllData] = useState<SensorDataDetail[]>([]);
  const [current, setCurrent] = useState<SensorDataDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${apiUrl}/sensors/${sensorId}/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const arr: SensorDataDetail[] = await res.json();
      setAllData(arr);
      setCurrent(arr.find(d => String(d.sensorDataId) === dataId) || null);
      setLoading(false);
    }
    load();
  }, [sensorId, dataId]);

  if (loading) return <ActivityIndicator style={styles.styles.loader} size="large" />;
  if (!current) return <Text style={styles.styles.errorText}>Dado não encontrado</Text>;

  const cfg = metricConfig[metric];
  const currentValue = Number(current[metric]);
  const suggestion = getSuggestion(metric, currentValue);

  const series = allData.map(d => ({
    x: new Date(d.dateTime).toLocaleDateString(),
    y: Number(d[metric])
  }));

  const now = new Date();
  const weeks: { label: string; values: number[] }[] = [];
  for (let i = 3; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(now.getDate() - (i + 1) * 7);
    const end = new Date(now);
    end.setDate(now.getDate() - i * 7);
    const vals = allData.filter(d => {
      const dt = new Date(d.dateTime);
      return dt >= start && dt < end;
    }).map(d => Number(d[metric]));
    weeks.push({ label: `${i + 1} sem atrás`, values: vals });
  }

  return (
    <ScrollView contentContainerStyle={styles.styles.container}>
      {/* Cabeçalho */}
      <View style={styles.styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
        <Text style={styles.styles.title}>{cfg.label}</Text>
      </View>

      {/* Valor Atual */}
      <View style={[styles.styles.currentCard, { backgroundColor: getColor(metric, currentValue) }]}>
        <Ionicons name={cfg.icon} size={28} color="#FFF" />
        <Text style={styles.styles.currentValue}>{currentValue}{cfg.unit}</Text>
        <Text style={styles.styles.currentTime}>
          Registrado em: {new Date(current.dateTime).toLocaleString()}
        </Text>
      </View>

      {/* Histórico */}
      <View style={styles.styles.section}>
        <Text style={styles.styles.sectionTitle}>Histórico</Text>
        <LineChart
          data={{ labels: series.map(s => s.x), datasets: [{ data: series.map(s => s.y) }] }}
          width={styles.styles.chart.width}
          height={200}
          chartConfig={chartConfig.chartConfig}
        />
      </View>

      {/* Estatísticas + Sugestão */}
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

        {suggestion && (
          <View style={styles.styles.suggestionCard}>
            <Text style={styles.styles.suggestionTitle}>Sugestão de Manejo</Text>
            <Text style={styles.styles.suggestionText}>{suggestion}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
