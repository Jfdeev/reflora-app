import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Alert, Image, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { sensorSettingsSchema } from '../../validations/validationSchemas';
import styles from './fill-sensor-settings';

export default function FillSensorSettingsScreen() {
  
  const apiUrl = Constants?.expoConfig?.extra?.apiUrl;
  const router = useRouter();
  const params = useLocalSearchParams();
  
  
  //esse dimissKeyboard fiz p quando o usuário clicar na tela, ele sair da caixa de texto, como tem normalmente em outros apps. 
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Sensor</Text>
        <Text style={styles.text}>Agora preencha as informações do seu sensor e seja bem vindo!</Text>

        <Formik
          initialValues={{ name: '', location: '' }}
          validationSchema={sensorSettingsSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const sensorId = params.sensorId;
              const token = await AsyncStorage.getItem('token');
              
              if (!token) {
                Alert.alert('Erro', 'Usuário não autenticado.');
                return;
              }
              const response = await fetch(apiUrl + `/sensors/${sensorId}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  sensorName: values.name,
                  location: values.location,
                }),
              });

              if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao registrar sensor');
              }
              Alert.alert('Sucesso', 'Sensor registrado com sucesso!');
              router.push('/screens/(tabs)/home');
            } catch (error) {
              if (error instanceof Error) {
                alert(error.message);
              } else {
                alert('Ocorreu um erro desconhecido.');
              }
            } finally {
              setSubmitting(false);
            }
          }
          }
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                placeholder="Meu Sensor"
                style={styles.input}
                placeholderTextColor="#999"
                value={values.name}
                onChangeText={handleChange('name')}
                keyboardType="default"
                autoCapitalize="none"
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <Text style={styles.label}>Localização</Text>
              <TextInput
                placeholder="Quintal" 
                style={styles.input}
                placeholderTextColor="#999"
                value={values.location}
                onChangeText={handleChange('location')}
                onBlur={handleBlur('location')}
              />
              {touched.location && errors.location && <Text style={styles.error}>{errors.location}</Text>}

              <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>

                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
        <Image
        source={require('@/src/assets/images/reflora-logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      </View>
    </TouchableWithoutFeedback>
  );
}