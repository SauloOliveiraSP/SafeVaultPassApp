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

const LoginScreen = ({ navigation }) => {
    const { isDarkMode, toggleTheme } = useTheme(); // Usando o contexto de tema
    const systemColorScheme = useColorScheme();
    const currentScheme = isDarkMode ? 'dark' : systemColorScheme || 'light';
    const themeColors = Colors[currentScheme];

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username,
                password,
            });

            const token = response.data.token;
            console.log('Token JWT:', token);
            await AsyncStorage.setItem('jwt_token', token);

            navigation.navigate('Home');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    Alert.alert('Erro de login', error.response.data || 'Erro desconhecido');
                } else if (error.request) {
                    Alert.alert('Erro de rede', 'Não foi possível se conectar ao servidor.');
                }
            } else {
                Alert.alert('Erro', 'Erro desconhecido');
            }
        }
    };

    const handleRegister = async () => {
        navigation.navigate('Register');
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.title, { color: themeColors.text }]}>Login</Text>

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
                onPress={handleLogin}
            >
                <Text style={[styles.buttonText, { color: currentScheme === 'light' ? '#fff' : themeColors.text }]}>
                    Entrar
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister}>
                <Text style={[styles.link, { color: themeColors.text }]}>
                    Não tem uma conta? Cadastre-se
                </Text>
            </TouchableOpacity>

            <View style={styles.themeSelector}>
                <Text style={[styles.switchText, { color: themeColors.text }]}>
                    {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
                </Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#ccc', true: themeColors.tint }}
                    thumbColor={isDarkMode ? themeColors.text : '#f4f3f4'}
                />
            </View>
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
});

export default LoginScreen;
