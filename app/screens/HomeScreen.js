import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Clipboard
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../styles/Colors';
import { Ionicons } from '@expo/vector-icons'; // Usando o Ionicons para o ícone de olho

const HomeScreen = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const themeColors = Colors[isDarkMode ? 'dark' : 'light'];

    const [passwords, setPasswords] = useState([]);
    const [editingPassword, setEditingPassword] = useState(null);
    const [service, setService] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(null);

    const loadPasswords = async () => {
        const jsonData = [
            { id: 0, service: 'Google', login: 'user1', password: 'password123' },
            { id: 1, service: 'Facebook', login: 'user2', password: 'mypassword' },
            { id: 2, service: 'Twitter', login: 'user3', password: '12345678' },
        ];
        setPasswords(jsonData);
    };

    useEffect(() => {
        loadPasswords();
    }, []);

    const handleEditPassword = (item) => {
        setEditingPassword(item);
        setService(item.service);
        setLogin(item.login);
        setPassword(item.password);
    };

    const handleSaveEdit = () => {
        const updatedPasswords = passwords.map((item) =>
            item.id === editingPassword.id
                ? { ...item, service, login, password }
                : item
        );
        setPasswords(updatedPasswords);
        setEditingPassword(null);
        setService('');
        setLogin('');
        setPassword('');
    };

    const handleBackEdit = () => {
        setEditingPassword(null);
        setService('');
        setLogin('');
        setPassword('');
    };

    const handleRemovePassword = (id) => {
        const updatedPasswords = passwords.filter(item => item.id !== id);
        setPasswords(updatedPasswords);
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
            <Text style={[styles.title, { color: themeColors.text }]}>Senhas</Text>

            {editingPassword ? (
                <View style={styles.editForm}>
                    <Text style={[styles.passwordTextTitle, { color: themeColors.text }]}>
                        <Text style={{ fontWeight: 'bold' }}>{service}</Text>
                    </Text>

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
                <FlatList
                    data={passwords}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPasswordItem}
                />
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
