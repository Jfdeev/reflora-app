import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router, useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { registerSchema } from '../../validations/validationSchemas';
import styles from './registerStyles';

export const unstable_settings = {
  headerShown: true,
  headerTitle: 'Registro',
  headerLeft: () => (
    <MaterialIcons
    name="arrow-back"
    size={24}
    color="black"
    onPress={() => router.back()}
    style={{ marginLeft: 15 }}
    />
  ),
};

export default function RegisterScreen() {
  
  const apiUrl = Constants?.expoConfig?.extra?.apiUrl;
  const router = useRouter();
  
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

                <Text style={styles.title}>Cadastro</Text>

                <Formik
                initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={registerSchema}
                onSubmit={async (values, {setSubmitting}) => {

                   try {
    const response = await fetch(apiUrl + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.firstName + ' ' + values.lastName,
        email: values.email,
        password: values.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer registro');
    }

    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('name', data.name);
      await AsyncStorage.setItem('email', data.email);
      router.push('/screens/(tabs)/home'); // redireciona após salvar os dados
    } else {
      alert('Falha no cadastro. Tente novamente.');
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
}}

              > 
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <> 
                <Text style={styles.label}>Primeiro Nome</Text>
                <TextInput
                    placeholder="Nome"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur= {handleBlur('firstName')}
                />
                 {touched.firstName && errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}

                <Text style={styles.label}>Segundo Nome</Text>
                <TextInput
                    placeholder="Sobrenome"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur= {handleBlur('lastName')}
                />
                {touched.lastName && errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}

                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="name@example.com"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur= {handleBlur('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                    onBlur= {handleBlur('password')}
                />
                {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

                <Text style={styles.label}>Confirme a senha</Text>
                <TextInput
                    placeholder="Confirme a senha"
                    style={styles.input}
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur= {handleBlur('confirmPassword')}
                />
                 {touched.confirmPassword && errors.confirmPassword && (<Text style={styles.error}>{errors.confirmPassword}</Text>)}

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleSubmit()}
                    >
                    <Text style={styles.buttonText}>Cadastrar-se</Text>
                </TouchableOpacity>
              </>
              )}
            </Formik>
            </View>
        </TouchableWithoutFeedback>
    );
}

