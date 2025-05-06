import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import styles from './registerStyles';
import { Formik } from 'formik';
import { registerSchema } from '../../validations/validationSchemas';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';

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
                onSubmit={(values) => {
                  router.push('/screens/sensor-register');
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

