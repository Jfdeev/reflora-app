import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../../styles/homeStyle';

interface UserSensor {
  sensorId: number;
  sensorName: string;
}

const router = useRouter();
export default function HomeScreen() {
  const apiUrl = Constants?.expoConfig?.extra?.apiUrl;
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedSensor, setSelectedSensor] = React.useState<UserSensor | null>(null);
  const [newName, setNewName] = React.useState('');
  const [newLocation, setNewLocation] = React.useState('');


  const [showRemoveModal, setShowRemoveModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingSensors, setLoadingSensors] = React.useState(true);
  const [sensors, setSensors] = React.useState<UserSensor[]>([]);

  const fetchUserSensors = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${apiUrl}/sensors`, { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
    const arr: UserSensor[] = await res.json();
    if (res.ok && arr.length) setSensors(arr);
    else setSensors([]);
  };


  useEffect(() => {
    setLoading(true);
    fetchUserSensors().finally(() => {
      setLoading(false);
      setLoadingSensors(false);
    });
  }, []);

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
  }
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
                              setNewLocation(''); // ajuste se houver valor atual
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
        <View style={styles.chartPlaceholder}>
          {/* Aqui vamos inserir componente de gráfico,
            ex: react-native-chart-kit ou react-native-svg-charts */}
          <Text style={styles.chartText}>[Gráfico de exemplo]</Text>
        </View>


        <View style={styles.sectionHeader}>
          <Ionicons name="notifications" size={20} color="#1B3A34" />
          <Text style={styles.sectionTitle}>Avisos Recentes</Text>
          <Ionicons name="chevron-forward" size={20} color="#1B3A34" />
        </View>
        <TouchableOpacity onPress={() => router.push('/screens/(tabs)/alert')}>
          <View style={styles.alertBox}>
            <Ionicons name="notifications" size={20} color="#F2E9D7" />
            <Text style={styles.alertText}>
              A temperatura do ambiente está ok – 4 horas atrás
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}