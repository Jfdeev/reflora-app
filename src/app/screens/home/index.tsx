import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import styles from './homeStyle';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Início</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="add" size={20} color="#1B3A34" />
          </View>
          <Text style={styles.actionText}>Cadastrar novo sensor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="remove" size={20} color="#1B3A34" />
          </View>
          <Text style={styles.actionText}>Remover sensor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
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
      <View style={styles.alertBox}>
        <Ionicons name="notifications" size={20} color="#F2E9D7" />
        <Text style={styles.alertText}>
          A temperatura do ambiente está ok – 4 horas atrás
        </Text>
      </View>

s      <View style={{ height: 60 }} />
    </ScrollView>
  );
}