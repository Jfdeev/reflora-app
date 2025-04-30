import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import styles from './sensorStyles';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

  const handleSubmit = () => {
    const key = code.join('');
    if (key.length === 4) {
      Alert.alert('Chave enviada', `Código: ${key}`);
    } else {
      Alert.alert('Erro', 'Digite os 4 dígitos da chave.');
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
              ref={(ref) => inputRefs.current[index] = ref}
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