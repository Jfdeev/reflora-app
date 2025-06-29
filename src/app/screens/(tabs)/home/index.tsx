import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import styles from '../../../styles/homeStyle';

interface UserSensor {
  sensorId: number;
  sensorName: string;
}

interface Alert {
  alertId: number;
  sensorId: number;
  message: string;
  level: string;
  timestamp: string;
}

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

const router = useRouter();
export default function HomeScreen() {
  const apiUrl = Constants?.expoConfig?.extra?.apiUrl;
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<UserSensor | null>(null);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSensors, setLoadingSensors] = useState(true);
  const [sensors, setSensors] = useState<UserSensor[]>([]);

  // Estado para o alerta mais recente
  const [recentAlert, setRecentAlert] = useState<Alert | null>(null);

  // Estado para o último sensor e seus dados
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [lastSensor, setLastSensor] = useState<UserSensor | null>(null);

  const fetchUserSensors = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${apiUrl}/sensors`, { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
    const arr: UserSensor[] = await res.json();
    if (res.ok && arr.length) setSensors(arr);
    else setSensors([]);
  };

  // Buscar o alerta mais recente
  const fetchRecentAlert = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/sensor/10/alerts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data: Alert[] = await res.json();
        if (data.length > 0) setRecentAlert(data[0]);
        else setRecentAlert(null);
      } else {
        setRecentAlert(null);
      }
    } catch (err) {
      setRecentAlert(null);
    }
  };

  // Buscar automaticamente o último sensor e o último dado desse sensor
  useEffect(() => {
    const fetchLastSensorAndData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      // Busca sensores do usuário
      const res = await fetch(`${apiUrl}/sensors`, { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
      const arr: UserSensor[] = await res.json();
      if (res.ok && arr.length) {
        const last = arr[arr.length - 1];
        setLastSensor(last);
        // Busca o último dado desse sensor
        const resData = await fetch(`${apiUrl}/sensors/${last.sensorId}/data`, { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
        const arrData: SensorData[] = await resData.json();
        if (resData.ok && arrData.length) setSensorData(arrData[arrData.length - 1]);
        else setSensorData(null);
      } else {
        setLastSensor(null);
        setSensorData(null);
      }
    };

    setLoading(true);
    fetchUserSensors().finally(() => {
      setLoading(false);
      setLoadingSensors(false);
    });
    fetchLastSensorAndData();
    fetchRecentAlert();
    // eslint-disable-next-line
  }, []);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'OK':
        return '#33582B';
      case 'Alerta':
        return '#CCAD2D';
      case 'Crítico':
        return '#CC5050';
      default:
        return '#FFFFFF';
    }
  };

  const handleRemoveSensor = async (sensorId: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${apiUrl}/sensors/${sensorId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setSensors(sensors.filter(sensor => sensor.sensorId !== sensorId));
      setShowRemoveModal(false);
    } else {
      alert('Erro ao remover o sensor');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#e5d3b1' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Início</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/screens/sensor-register')}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="add" size={20} color="#1B3A34" />
            </View>
            <Text style={styles.actionText}>Cadastrar novo sensor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setShowRemoveModal(true)}
          >
            <View style={styles.iconCircle}>
              <MaterialIcons name="remove" size={20} color="#1B3A34" />
            </View>
            <Text style={styles.actionText}>Remover sensor</Text>
          </TouchableOpacity>

          {/* Modal para remover sensor */}
          {showRemoveModal && (
            <Modal
              transparent
              animationType="slide"
              visible={showRemoveModal}
              onRequestClose={() => setShowRemoveModal(false)}
            >
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <View style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  padding: 20,
                  width: '80%'
                }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Selecione um sensor para remover</Text>
                  {loadingSensors ? (
                    <Text>Carregando sensores...</Text>
                  ) : (
                    sensors.length === 0 ? (
                      <Text>Nenhum sensor encontrado.</Text>
                    ) : (
                      sensors.map(sensor => (
                        <TouchableOpacity
                          key={sensor.sensorId}
                          style={{
                            padding: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee'
                          }}
                          onPress={() => handleRemoveSensor(sensor.sensorId)}
                        >
                          <Text>{sensor.sensorName}</Text>
                        </TouchableOpacity>
                      ))
                    )
                  )}
                  <TouchableOpacity
                    style={{
                      marginTop: 15,
                      alignSelf: 'flex-end'
                    }}
                    onPress={() => setShowRemoveModal(false)}
                  >
                    <Text style={{ color: '#1B3A34', fontWeight: 'bold' }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
          {/* Modal para editar sensor */}
          {showEditModal && (
            <Modal
              transparent
              animationType="slide"
              visible={showEditModal}
              onRequestClose={() => setShowEditModal(false)}
            >
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <View style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  padding: 20,
                  width: '85%'
                }}>
                  {selectedSensor === null ? (
                    <>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Selecione um sensor para editar</Text>
                      {loadingSensors ? (
                        <Text>Carregando sensores...</Text>
                      ) : (
                        sensors.map(sensor => (
                          <TouchableOpacity
                            key={sensor.sensorId}
                            style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                            onPress={() => {
                              setSelectedSensor(sensor);
                              setNewName(sensor.sensorName || '');
                              setNewLocation('');
                            }}
                          >
                            <Text>{sensor.sensorName}</Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </>
                  ) : (
                    <>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Editar Sensor</Text>
                      <Text>Nome:</Text>
                      <TextInput
                        value={newName}
                        onChangeText={setNewName}
                        placeholder="Nome do sensor"
                        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10 }}
                      />
                      <Text>Localização:</Text>
                      <TextInput
                        value={newLocation}
                        onChangeText={setNewLocation}
                        placeholder="Localização do sensor"
                        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10 }}
                      />
                      <TouchableOpacity
                        style={{ backgroundColor: '#1B3A34', padding: 10, borderRadius: 5, marginBottom: 10 }}
                        onPress={async () => {
                          const token = await AsyncStorage.getItem('token');
                          if (!token || !selectedSensor) return;

                          const res = await fetch(`${apiUrl}/sensors/${selectedSensor.sensorId}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              sensorName: newName,
                              location: newLocation
                            }),
                          });

                          if (res.ok) {
                            alert('Sensor atualizado!');
                            fetchUserSensors();
                            setShowEditModal(false);
                            setSelectedSensor(null);
                            await fetchUserSensors();
                          } else {
                            alert('Erro ao atualizar sensor.');
                          }
                        }}
                      >
                        <Text style={{ color: '#fff', textAlign: 'center' }}>Salvar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setSelectedSensor(null)}>
                        <Text style={{ color: '#1B3A34', textAlign: 'right' }}>Voltar</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity onPress={() => {
                    setShowEditModal(false);
                    setSelectedSensor(null);
                  }}>
                    <Text style={{ color: '#1B3A34', fontWeight: 'bold', marginTop: 10, textAlign: 'right' }}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setShowEditModal(true)}
          >
            <View style={styles.iconCircle}>
              <FontAwesome5 name="list" size={16} color="#1B3A34" />
            </View>
            <Text style={styles.actionText}>Editar sensor</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Ionicons name="bar-chart" size={20} color="#1B3A34" />
          <Text style={styles.sectionTitle}>Métricas Rápidas</Text>
          <Ionicons name="chevron-forward" size={20} color="#1B3A34" />
        </View>

        <View style={{ marginVertical: 16, borderRadius: 16, backgroundColor: '#F2E9D7', padding: 8 }}>
          <BarChart
            data={{
              labels: [
          'Umidade',
          'Temp.',
          'Condut.',
          'PH',
          'N',
          'P',
          'K',
              ],
              datasets: [
          {
            data: [
              sensorData?.soilHumidity ?? 0,
              sensorData?.temperature ?? 0,
              sensorData?.condutivity ?? 0,
              sensorData?.ph ?? 0,
              sensorData?.nitrogen ?? 0,
              sensorData?.phosphorus ?? 0,
              sensorData?.potassium ?? 0,
            ],
          },
              ],
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
              color: (opacity = 1, index?: number) => {
          const barColors = [
            '#33582B', // Umidade
            '#CCAD2D', // Temp.
            '#CC5050', // Condut.
            '#1B3A34', // PH
            '#2D9CDB', // N
            '#F2994A', // P
            '#27AE60', // K
          ];
          return barColors[index ?? 0] + Math.round(opacity * 255).toString(16).padStart(2, '0');
              },
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
          borderRadius: 16,
              },
              propsForLabels: {
          fontSize: 10,
          textAnchor: 'middle',
              },
              barPercentage: 0.7,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              alignSelf: 'center',
            }}
            verticalLabelRotation={-15}
            showValuesOnTopOfBars
          />
        </View>

        <View style={styles.sectionHeader}>
          <Ionicons name="notifications" size={20} color="#1B3A34" />
          <Text style={styles.sectionTitle}>Avisos Recentes</Text>
          <Ionicons name="chevron-forward" size={20} color="#1B3A34" />
        </View>
        <TouchableOpacity onPress={() => router.push('/screens/(tabs)/alert')}>
          <View
            style={[
              styles.alertBox,
              recentAlert && { backgroundColor: getAlertColor(recentAlert.level) }
            ]}
          >
            <Ionicons name="notifications" size={20} color="#000" />
            <Text style={styles.alertText}>
              {recentAlert
                ? `${recentAlert.message} – ${new Date(recentAlert.timestamp).toLocaleString()}`
                : 'Nenhum aviso recente.'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}