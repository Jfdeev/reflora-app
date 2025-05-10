import React, { useState } from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';  // ou outra lib de ícones
import styles from '../../../styles/dataScreenStyles';

const cultureTypes = [
  { label: "Agrofloresta", value: "Agrofloresta" },
  { label: "Agricultura Orgânica", value: "Agricultura Orgânica" },
  { label: "Agricultura Biodinâmica", value: "Agricultura Biodinâmica" },
];

export default function DataScreen() {
  const [culture, setCulture] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dados do Cultivo</Text>

      <RNPickerSelect
        placeholder={{
          label: 'Tipo de cultura',
          value: null,
          color: 'black'
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
        Icon={() => (
          <Ionicons name="chevron-down" size={24} color="gray" />
        )}
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
            <Text style={styles.cardText}>ph: 6.5</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#33582B' }]}>
            <Text style={styles.cardText}>Índice de Sombreamento: 87%</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#33582B' }]}>
            <Text style={styles.cardText}>Umidade do solo: 67%%</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#33582B' }]}>
            <Text style={styles.cardText}>Nutrientes do solo: Bom</Text>
          </View>
        </View> 
      </View>
  );
}
