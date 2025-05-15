import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { loginSchema } from '../../validations/validationSchemas';
import styles from './loginStyles';
const router = useRouter();

export default function LoginScreen() {
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

        <Text style={styles.title}>Login</Text>
        
        <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={async (values, {setSubmitting}) => {
            try {
        const response = await fetch('http://192.168.15.9:3000/api/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        email: values.email,
        password: values.password,
    }),
  });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
  }

        if (data.token) {
        // Salva token, nome e email no AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('name', data.name);   // Certifique-se que backend retorna isso
        await AsyncStorage.setItem('email', data.email); // Certifique-se que backend retorna isso

        router.push('/screens/(tabs)/home');
  } else {
        alert('Login falhou. Tente novamente.');
  }
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
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="name@example.com"
          style={styles.input}
          placeholderTextColor="#999"
          value={values.email}
          onChangeText={handleChange('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          onBlur={handleBlur('email')}
        />
         {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Senha"
          style={styles.input}
          placeholderTextColor="#999"
          secureTextEntry
          value={values.password}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
        />
        {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        </>
          )}
        </Formik>

      </View>
    </TouchableWithoutFeedback>
  );
}