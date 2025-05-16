import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert, Keyboard,
  Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import styles from './sensorStyles';

export default function SensorRegisterScreen() {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const router = useRouter();

  const handleInputChange = (text: string, index: number) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleHelp = () => {
    Alert.alert('Ajuda', 'A chave do sensor está na parte de baixo do seu dispositivo.');
  };

  const handleSubmit = async () => {
    const key = code.join('');
    if (key.length !== 4) {
      Alert.alert('Erro', 'Digite os 4 dígitos da chave.');
      return;
    }
  
    const numericKey = parseInt(key, 10);

    if (isNaN(numericKey)) {
      Alert.alert('Erro', 'Chave inválida.');
      return;
    }
    
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }
  
      const response = await fetch(`http://26.251.7.105:3000/api/sensors/${numericKey}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao registrar sensor');
      }
  
      Alert.alert('Sucesso', 'Sensor registrado com sucesso!');
      router.push('/screens/home');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível registrar o sensor.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Topo */}
        <View style={styles.top}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#1B3612" />
          </TouchableOpacity>
          <Text style={styles.title}>Reflora</Text>
          <TouchableOpacity onPress={handleHelp}>
            <Ionicons name="help-circle-outline" size={28} color="#1B3612" />
          </TouchableOpacity>
        </View>

        {/* Texto principal */}
        <Text style={styles.text}>
          Seja bem vindo ao reflora <Text style={{ fontWeight: 'bold' }}>{'{Nome}'}</Text>,{'\n'}
          para começar a utilizar a plataforma por favor insira a chave de acesso do seu sensor.
        </Text>

        {/* Inputs da chave */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={styles.codeInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(text) => handleInputChange(text, index)}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          ))}
        </View>

        {/* Texto de termos */}
        <Text style={styles.checkboxText}>
          Ao continuar, você concorda com o{' '}
          <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>Termo de uso</Text> e{' '}
          <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>Política de Privacidade</Text>.
        </Text>

        {/* Botão de envio */}
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}