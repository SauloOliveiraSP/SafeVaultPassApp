import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Switch,
    useColorScheme,
} from 'react-native';
import { Colors } from '../styles/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useTheme } from '../context/ThemeContext'; // Importando o hook

const RegisterScreen = ({ navigation }) => {
    const { isDarkMode, toggleTheme } = useTheme(); // Usando o contexto de tema
    const systemColorScheme = useColorScheme();
    const currentScheme = isDarkMode ? 'dark' : systemColorScheme || 'light';
    const themeColors = Colors[currentScheme];

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                username,
                password,
            });

            Alert.alert('Cadastro bem-sucedido', 'Realize o login.');
            navigation.navigate('Login');

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    Alert.alert('Erro de cadastro', error.response.data || 'Erro desconhecido');
                } else if (error.request) {
                    Alert.alert('Erro de rede', 'Não foi possível se conectar ao servidor.');
                }
            } else {
                Alert.alert('Erro', 'Erro desconhecido');
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.title, { color: themeColors.text }]}>Criar uma conta</Text>

            <TextInput
                style={[
                    styles.input,
                    { backgroundColor: themeColors.inputBackground, color: themeColors.text },
                ]}
                placeholder="Usuário"
                placeholderTextColor={themeColors.icon}
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={[
                    styles.input,
                    { backgroundColor: themeColors.inputBackground, color: themeColors.text },
                ]}
                placeholder="Senha"
                placeholderTextColor={themeColors.icon}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: currentScheme === 'light' ? '#000' : themeColors.buttonBackground },
                ]}
                onPress={handleRegister}
            >
                <Text style={[styles.buttonText, { color: currentScheme === 'light' ? '#fff' : themeColors.text }]}>
                    Cadastrar
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.link, { color: themeColors.text }]}>
                    Voltar
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 20,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    themeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    switchText: {
        fontSize: 16,
        marginRight: 10,
    },
    link: {
        marginTop: 20,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default RegisterScreen;
