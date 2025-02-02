import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Clipboard,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../styles/Colors';
import { Ionicons } from '@expo/vector-icons'; // Usando o Ionicons para o ícone de olho
import { API_BASE_URL } from '../../config';


const HomeScreen = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const themeColors = Colors[isDarkMode ? 'dark' : 'light'];

    const [passwords, setPasswords] = useState([]);
    const [editingPassword, setEditingPassword] = useState(null);
    const [insertingPassword, setInsertingPassword] = useState(null);
    const [service, setService] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(null);

    const loadPasswords = async () => {
        try {
            // Obtém o token armazenado no AsyncStorage
            const token = await AsyncStorage.getItem('jwt_token');

            if (!token) {
                console.error('Usuário não logado. Por favor realizar login novamente.');
                return;
            }

            // Faz a requisição GET com o token no cabeçalho Authorization
            const response = await axios.get(`${API_BASE_URL}/passwords`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Atualiza o estado com os dados retornados pela API
            setPasswords(response.data);
        } catch (error) {
            console.error('Erro ao carregar suas senhas:', error);
        }
    };

    const insertPasswords = async (id) => {
        try {
            const token = await AsyncStorage.getItem('jwt_token');

            if (!token) {
                console.error('Usuário não logado. Por favor realizar login novamente.');
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/passwords`,
                {
                    service: service,
                    login: login,
                    password: password
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            Alert.alert("Sucesso", "Senha adicionada com sucesso!");

        } catch (error) {
            console.error('Erro ao adicionar uma nova senha:', error);
        }
    };

    const updatedPasswords = async (id) => {
        try {
            const token = await AsyncStorage.getItem('jwt_token');

            if (!token) {
                console.error('Usuário não logado. Por favor realizar login novamente.');
                return;
            }

            const response = await axios.put(`${API_BASE_URL}/passwords/${id}`,
                {
                    login: login,
                    password: password
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            Alert.alert("Sucesso", "Dados da senha alterada com sucesso!");

        } catch (error) {
            console.error('Erro ao alterar dados da senha:', error);
        }
    };

    const removePasswords = async (id) => {
        try {
            const token = await AsyncStorage.getItem('jwt_token');

            if (!token) {
                console.error('Usuário não logado. Por favor realizar login novamente.');
                return;
            }

            const response = await axios.delete(`${API_BASE_URL}/passwords/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Alert.alert("Sucesso", "Senha removida com sucesso!");

        } catch (error) {
            console.error('Erro ao excluir a senha:', error);
        }
    };

    const confirmUpdate = (onConfirm, title, question) => {
        Alert.alert(
            title,
            question,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Confirmar", onPress: onConfirm }
            ]
        );
    };

    useEffect(() => {
        loadPasswords();
    }, []);

    const handleEditPassword = (item) => {
        setEditingPassword(item);
        setInsertingPassword(null);
        setService(item.service);
        setLogin(item.login);
        setPassword(item.password);
    };

    const handleNewPassword = () => {
        setEditingPassword(true);
        setInsertingPassword(true);
        setService("");
        setLogin("");
        setPassword("");
    };

    const handleSaveEdit = async () => {

        if (insertingPassword)
            confirmUpdate(async () => {
                await insertPasswords();
                await loadPasswords();
            }, "Confirmar Inclusão", "Tem certeza de que deseja adicionar essa senha?");
        else
            confirmUpdate(async () => {
                await updatedPasswords(editingPassword.id);
                await loadPasswords();
            }, "Confirmar Alteração", "Tem certeza de que deseja alterar os dados da senha?");

        await loadPasswords();

        handleBackEdit();
    };

    const handleBackEdit = () => {
        setEditingPassword(null);
    };

    const handleRemovePassword = async (id) => {
        confirmUpdate(async () => {
            await removePasswords(id);
            await loadPasswords();
        }, "Confirmar Alteração", "Tem certeza de que deseja excluir a senha?");

        await loadPasswords();
    };

    const togglePasswordVisibility = (id) => {
        setPasswordVisible(passwordVisible === id ? null : id);
    };

    const renderPasswordItem = ({ item }) => (
        <View style={[styles.passwordItem, { backgroundColor: themeColors.inputBackground }]}>
            <Text style={[styles.passwordTextTitle, { color: themeColors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>{item.service}</Text>
            </Text>

            <Text style={[styles.passwordText, { color: themeColors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>Nome de usuário</Text>
            </Text>

            <TextInput
                style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.text }]}
                placeholder="Usuário"
                placeholderTextColor={themeColors.icon}
                value={item.login}
                editable={false}
            />


            <Text style={[styles.passwordText, { color: themeColors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>Senha</Text>
            </Text>

            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.text, flex: 1 }]}
                    placeholder="Senha"
                    placeholderTextColor={themeColors.icon}
                    value={passwordVisible === item.id ? item.password : '••••••••'}
                    secureTextEntry={passwordVisible !== item.id}
                    editable={false}
                />
                <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => togglePasswordVisibility(item.id)}
                >
                    <Ionicons
                        name={passwordVisible === item.id ? 'eye-off' : 'eye'}
                        size={24}
                        color={themeColors.text}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: themeColors.buttonBackground }]}
                    onPress={() => handleEditPassword(item)}
                >
                    <Text style={[styles.editButtonText, { color: themeColors.text }]}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.deleteButton]}
                    onPress={() => handleRemovePassword(item.id)}
                >
                    <Text style={[styles.deleteButtonText]}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            {editingPassword ? (
                <View style={styles.editForm}>

                    {insertingPassword ? (
                        <View>
                            <Text style={[styles.passwordText, { color: themeColors.text }]}>
                                <Text style={{ fontWeight: 'bold' }}>Serviço</Text>
                            </Text>

                            <TextInput
                                style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.text }]}
                                placeholder="Serviço"
                                placeholderTextColor={themeColors.icon}
                                value={service}
                                onChangeText={setService}
                            />
                        </View>
                    ) :
                        <Text style={[styles.passwordTextTitle, { color: themeColors.text }]}>
                            <Text style={{ fontWeight: 'bold' }}>{service}</Text>
                        </Text>
                    }

                    <Text style={[styles.passwordText, { color: themeColors.text }]}>
                        <Text style={{ fontWeight: 'bold' }}>Nome de usuário</Text>
                    </Text>

                    <TextInput
                        style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.text }]}
                        placeholder="Usuário"
                        placeholderTextColor={themeColors.icon}
                        value={login}
                        onChangeText={setLogin}
                    />

                    <Text style={[styles.passwordText, { color: themeColors.text }]}>
                        <Text style={{ fontWeight: 'bold' }}>Senha</Text>
                    </Text>

                    <TextInput
                        style={[styles.input, { backgroundColor: themeColors.inputBackground, color: themeColors.text }]}
                        placeholder="Senha"
                        placeholderTextColor={themeColors.icon}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={false}
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: themeColors.buttonBackground }]}
                        onPress={handleSaveEdit}
                    >
                        <Text style={[styles.buttonText, { color: themeColors.text }]}>Salvar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleBackEdit} style={styles.backButton}>
                        <Text style={[styles.link, { color: themeColors.text }]}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <View style={styles.buttonInsertContainer}>
                        <TouchableOpacity
                            style={[styles.insertButton, { backgroundColor: themeColors.buttonBackground }]}
                            onPress={() => handleNewPassword()}
                        >
                            <Text style={[styles.editButtonText, { color: themeColors.text }]}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={passwords}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderPasswordItem}
                    />
                </View>
            )}

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
        marginTop: 90,
        marginBottom: 10,
    },
    passwordItem: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        width: '100%',
    },
    passwordText: {
        fontSize: 16,
        marginBottom: 5,
    },
    passwordTextTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    eyeButton: {
        padding: 5,
        marginLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
    },
    editButton: {
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonInsertContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        marginTop: 20,
        marginBottom: 10,
    },
    insertButton: {
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButton: {
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#d32f2f',
        alignItems: 'center',
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    copyButton: {
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    copyButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    editForm: {
        width: '100%',
        padding: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 10,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    link: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
