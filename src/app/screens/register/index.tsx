import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import styles from './registerStyles';
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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard} style={{ flex: 1 }}>
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={32} color="#000" />
                </TouchableOpacity>

                <Text style={styles.title}>Cadastro</Text>

                <Text style={styles.label}>Primeiro Nome</Text>
                <TextInput
                    placeholder="Nome"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={firstName}
                    onChangeText={setFirstName}
                />

                <Text style={styles.label}>Segundo Nome</Text>
                <TextInput
                    placeholder="Sobrenome"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={setLastName}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="name@example.com"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                    placeholder="Senha"
                    style={styles.input}
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.label}>Confirme a senha</Text>
                <TextInput
                    placeholder="Confirme a senha"
                    style={styles.input}
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {
                      dismissKeyboard();
                      if (!firstName || !lastName || !email || !password || password !== confirmPassword) {
                        alert('Preencha todos os campos corretamente.');
                        return;
                      }
                    
                      router.push('/screens/sensor-register');
                    }}>
                    <Text style={styles.buttonText}>Cadastrar-se</Text>
                </TouchableOpacity>

            </View>
        </TouchableWithoutFeedback>
    );
}

