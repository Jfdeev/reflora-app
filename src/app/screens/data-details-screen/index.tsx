import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
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
  const apiUrl = Constants?.expoConfig?.extra?.apiUrl;
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
        `${apiUrl}/sensors/${sensorId}/data`,
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


  // Definição de faixas por parâmetro
const thresholds: Record<MetricKey, {
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

function getSuggestion(metric: MetricKey, value: number): string | null {
  switch (metric) {
    case 'soilHumidity':
      if (value < 20) {
        return `Umidade muito baixa. Sugestão:
- **Palhada vegetal**: espalhe 2–3 kg/m² de restos de capim, folhas secas ou palha.
- **Cobertura morta com jornal**: coloque camadas de jornal úmido entre as plantas.`;
      } else if (value > 60) {
        return `Umidade muito alta. Sugestão:
- **Sulcos de escoamento**: faça pequenos drenos ou valetas.
- **Levarecimento**: adicione 0,5–1 kg/m² de areia grossa.`;
      }
      break;

    case 'temperature':
      if (value < 18) {
        return `Temperatura muito baixa. Sugestão:
- **Cobertura escura**: estenda lona preta ou plástico escuro nas madrugadas.
- **Adubação verde**: semeie leguminosas de cobertura como feijão-de-porco.`;
      } else if (value > 30) {
        return `Temperatura muito alta. Sugestão:
- **Cobertura clara**: utilize tecido branco para refletir radiação.
- **Irrigação de superfície**: borrife água pela manhã para resfriar.`;
      }
      break;

    case 'condutivity':
      if (value < 0.2) {
        return `Condutividade muito baixa. Sugestão:
- **Chá de composto**: ferva 500g de resíduos em 10L de água, coe e aplique 5L/m².`;
      } else if (value > 2.0) {
        return `Condutividade muito alta. Sugestão:
- **Lavagem de solo**: irrigue com 20–30 mm de água e deixe drenar.
- **Matéria orgânica**: aplique 3–5 kg/m² de composto.`;
      }
      break;

    case 'ph':
      if (value < 5.5) {
        return `Solo muito ácido. Sugestão:
- **Casca de ovo moída** (100–200g/m²): espalhe e incorpore superficialmente.`;
      } else if (value > 7.5) {
        return `Solo muito alcalino. Sugestão:
- **Borra de café** (500g) + **vinagre** (100 mL diluído): incorpore e regue.`;
      }
      break;

    case 'nitrogen':
      if (value < 15) {
        return `Deficiência de Nitrogênio. Sugestão:
- **Borra de café** (1 kg/m²): espalhe e incorpore a 5 cm de profundidade.`;
      } else if (value > 60) {
        return `Excesso de Nitrogênio. Sugestão:
- Use Carvão vegetal (500g/m²): espalhe pela area, incorpore ao plantio e depois remova o excesso.`;
      }
      break;

    case 'phosphorus':
      if (value < 10) {
        return `Deficiência de Fósforo. Sugestão:
- **Farinha de osso caseira** (200g/m²): ossos limpos, secos e moídos.`;
      } else if (value > 50) {
        return `Excesso de Fósforo. Sugestão:
- Reduza adubações e promova **rotação de culturas** com leguminosas.`;
      }
      break;

    case 'potassium':
      if (value < 80) {
        return `Deficiência de Potássio. Sugestão:
- **Casca de banana triturada** (1 kg/m²): distribua e cubra com palha.`;
      } else if (value > 350) {
        return `Excesso de Potássio. Sugestão:
- **Irrigação profunda** (20–30 mm) + adição de matéria orgânica (5 kg/m²).`;
      }
      break;
  }
  return null;
}

const suggestion = getSuggestion(metric, Number(current[metric]));

// Retorna cor baseada na faixa
function getColor(metric: MetricKey, value: number): string {
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

  return (
    <ScrollView contentContainerStyle={styles.styles.container}>
      {/* Cabeçalho */}
      <View style={styles.styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
        <Text style={styles.styles.title}>{cfg.label}</Text>
      </View>

      {/* Valor Atual */}
      <View style={[styles.styles.currentCard, { backgroundColor: getColor(metric, Number(current[metric])) }]}>
        <Ionicons name={cfg.icon} size={28} color='#FFFFFF' />
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
