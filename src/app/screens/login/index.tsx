import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import styles from './loginStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { loginSchema } from '../../validations/validationSchemas';
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
        onSubmit={(values) => {
          router.push('/screens/(tabs)/home');
        }}
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