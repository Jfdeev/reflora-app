import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { default as chartConfig, default as styles } from './dataDetailsScreen';

interface SensorDataDetail {
  sensorDataId: number;
  soilHumidity: number;
  soilHumidityLevel: 'Ok' | 'Alerta' | 'Crítico';
  temperature: number;
  temperatureLevel: 'Ok' | 'Alerta' | 'Crítico';
  condutivity: number;
  condutivityLevel: 'Ok' | 'Alerta' | 'Crítico';
  ph: number;
  phLevel: 'Ok' | 'Alerta' | 'Crítico';
  nitrogen: number;
  nitrogenLevel: 'Ok' | 'Alerta' | 'Crítico';
  phosphorus: number;
  phosphorusLevel: 'Ok' | 'Alerta' | 'Crítico';
  potassium: number;
  potassiumLevel: 'Ok' | 'Alerta' | 'Crítico';
  dateTime: string;
}

type MetricKey = keyof Omit<SensorDataDetail, 'sensorDataId' | 'dateTime' | `${string}Level`>;

const metricConfig: Record<MetricKey, { label: string; icon: any; unit: string }> = {
  soilHumidity: { label: 'Umidade do Solo', icon: 'leaf', unit: '%' },
  temperature: { label: 'Temperatura', icon: 'thermometer', unit: '°C' },
  condutivity: { label: 'Condutividade', icon: 'water', unit: 'µS/cm' },
  ph: { label: 'pH', icon: 'water', unit: '' },
  nitrogen: { label: 'Nitrogênio', icon: 'leaf', unit: 'mg/L' },
  phosphorus: { label: 'Fósforo', icon: 'leaf', unit: 'mg/L' },
  potassium: { label: 'Potássio', icon: 'leaf', unit: 'mg/L' },
};

const getColorByLevel = (level: string | null | undefined) => {
  const normalized = level?.toUpperCase?.() ?? 'DESCONHECIDO';
  switch (normalized) {
    case 'OK':
      return '#33582B'; // Verde para "Ok"
    case 'ALERTA':
      return '#CCAD2D'; // Amarelo para "Alerta"
    case 'CRÍTICO':
      return '#CC5050'; // Vermelho para "Crítico"
    default:
      return '#F2E9D7'; // Cor neutra para casos indefinidos
  }
};

function getSuggestion(metric: MetricKey, value: number, level: 'Ok' | 'Alerta' | 'Crítico'): string | null {
  if (level === 'Ok') return null;

  switch (metric) {
    case 'soilHumidity':
      if (value < 20) return 'O solo está muito seco. Você pode espalhar folhas secas, capim ou palha vegetal para cobrir a terra. Outra opção é colocar jornais úmidos entre as plantas para manter a umidade.';
      if (value > 60) return 'O solo está encharcado. Tente fazer pequenos sulcos ou canais para escoar o excesso de água. Também pode misturar um pouco de areia grossa na terra para ajudar na drenagem.';
      break;

    case 'temperature':
      if (value < 18) return 'A temperatura está baixa para o desenvolvimento das plantas. Você pode cobrir o solo com uma lona preta durante a noite para manter o calor, ou plantar leguminosas como o feijão-de-porco para ajudar a aquecer o ambiente.';
      if (value > 30) return 'Está fazendo muito calor. Use tecidos brancos ou coberturas claras para proteger o solo e as plantas do sol forte. Também pode borrifar um pouco de água nas plantas pela manhã para refrescar.';
      break;

    case 'condutivity':
      if (value < 20) return 'O solo tem poucos nutrientes solúveis. Prepare um "chá de composto", fervendo restos de vegetais e folhas, e use essa água para regar o solo.';
      if (value > 200) return 'O solo está com muitos sais. Regue bem o local e deixe a água escorrer naturalmente para ajudar a limpar o excesso. Depois, adicione bastante matéria orgânica como folhas secas ou composto caseiro.';
      break;

    case 'ph':
      if (value < 5.5) return 'O solo está muito ácido. Você pode moer cascas de ovos e espalhar no solo. Isso ajuda a equilibrar o pH e melhora o ambiente para as raízes.';
      if (value > 7.5) return 'O solo está muito alcalino. Tente misturar um pouco de borra de café e vinagre diluído na água e regar a área. Isso ajuda a tornar o solo mais neutro.';
      break;

    case 'nitrogen':
      if (value < 15) return 'Falta nitrogênio no solo, e isso afeta o crescimento das plantas. Espalhe borra de café no canteiro e misture com a terra. Isso vai ajudar a fortalecer as folhas.';
      if (value > 60) return 'Tem nitrogênio demais no solo. Isso pode atrapalhar o equilíbrio dos nutrientes. Misture um pouco de carvão vegetal na terra e reduza o uso de adubos por um tempo.';
      break;

    case 'phosphorus':
      if (value < 10) return 'Seu solo precisa de mais fósforo para ajudar no crescimento das raízes. Triture alguns ossos (como de frango ou boi), seque bem e espalhe o pó na terra.';
      if (value > 50) return 'Há fósforo demais no solo. Evite adubar por um tempo e troque o tipo de planta cultivada. Plantas como feijão ou amendoim ajudam a reequilibrar o solo.';
      break;

    case 'potassium':
      if (value < 80) return 'As plantas estão precisando de potássio. Corte cascas de banana em pedaços pequenos e espalhe pela terra, cobrindo com um pouco de palha ou folhas.';
      if (value > 350) return 'Tem potássio demais no solo. Faça uma irrigação mais profunda e adicione bastante matéria orgânica, como folhas secas e restos de vegetais, para equilibrar.';
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
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/sensors/${sensorId}/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao carregar dados do sensor');

        const arr: SensorDataDetail[] = await res.json();
        console.log('Dados recebidos da API:', arr); // Depuração: verificar o array retornado
        console.log('Procurando sensorDataId:', dataId); // Depuração: verificar o dataId

        setAllData(arr);

        // Converter dataId para número e buscar o item correspondente
        const numericDataId = Number(dataId);
        const foundData = arr.find(d => d.sensorDataId === numericDataId);
        console.log('Item encontrado:', foundData); // Depuração: verificar se o item foi encontrado

        setCurrent(foundData || null);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        setCurrent(null);
        setLoading(false);
      }
    }
    load();
  }, [sensorId, dataId]);

  if (loading) return <ActivityIndicator style={styles.styles.loader} size="large" />;
  if (!current) return <Text style={styles.styles.errorText}>Dado não encontrado</Text>;

  const cfg = metricConfig[metric];
  const currentValue = Number(current[metric]);
  const levelKey = `${metric}Level` as keyof SensorDataDetail;
  const level = current[levelKey] as 'Ok' | 'Alerta' | 'Crítico';
  const suggestion = getSuggestion(metric, currentValue, level);

  const recentData = allData.slice(-4);
  const series = recentData.map(d => ({
    x: new Date(d.dateTime).toLocaleDateString(),
    y: Number(d[metric]),
  }));

  return (
    <ScrollView contentContainerStyle={styles.styles.container}>
      <View style={styles.styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
        <Text style={styles.styles.title}>{cfg.label}</Text>
      </View>

      <View style={[styles.styles.currentCard, { backgroundColor: getColorByLevel(level) }]}>
        <Ionicons name={cfg.icon} size={28} color="#FFF" />
        <Text style={styles.styles.currentValue}>{currentValue}{cfg.unit}</Text>
        <Text style={styles.styles.currentTime}>
          Registrado em: {new Date(current.dateTime).toLocaleString()}
        </Text>
      </View>

      <View style={styles.styles.section}>
        <Text style={styles.styles.sectionTitle}>Histórico (últimos 4)</Text>
        <LineChart
          data={{
            labels: series.map(s => s.x),
            datasets: [{ data: series.map(s => s.y) }],
          }}
          width={styles.styles.chart.width}
          height={200}
          chartConfig={chartConfig.chartConfig}
        />
      </View>

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