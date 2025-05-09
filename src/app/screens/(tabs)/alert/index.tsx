import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../../../styles/alertStyles';


export default function NotificationsScreen() {
  const router = useRouter();


  const notifications = [
    {
      message: 'A temperatura do ambiente está ok - 4 horas atrás',
      color: '#33582B',
    },
    {
      message: 'O índice de umidade do ar está abaixo do normal - 5 horas atrás',
      color: '#CCAD2D',
    },
    {
      message: 'O índice de Sombreamento está Crítico - 6 horas atrás',
      color: '#CC5050',
    },
  ];


  return (
    <View style={styles.container}>
      {/* Topo */}
      <View style={styles.header}>
        <Text style={styles.title}>Alertas</Text>
      </View>


      {/* Lista de avisos */}
      <ScrollView contentContainerStyle={styles.notifications}>
        {notifications.map((item, index) => (
          <View key={index} style={[styles.card, { backgroundColor: item.color }]}>
            <FontAwesome name="bell" size={20} color="#000" style={{ marginRight: 10 }} />
            <Text style={styles.message}>{item.message}</Text>
          </View>
        ))}


        <Text style={styles.seeMore}>------------------Ver Mais------------------</Text>
      </ScrollView>
    </View>
  );
  /*feita apenas com base no miro, ainda esperando o backend para implementar
  utilizando o map, e o switch case, para caso a notificação for de nível:
  Ok = Verde; Alerta = Amarelo; Crítico = Vermelho.*/
}
