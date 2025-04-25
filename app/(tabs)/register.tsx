import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard} style={{ flex: 1 }}>
            <View style={styles.container}>
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

                <TouchableOpacity style={styles.button} onPress={dismissKeyboard}>
                    <Text style={styles.buttonText}>Cadastrar-se</Text>
                </TouchableOpacity>

            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#EFEAD7',
    },
    title: {
        color: '#0B3824',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#050038',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'left',
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: '#333',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#1A1A1A',
        borderRadius: 5,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    
    },
  });