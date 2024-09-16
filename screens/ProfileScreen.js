import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Alert, StyleSheet, Pressable, Text, Image, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext';
import UserContext from '../contexts/UserContext';
import { Ionicons as Icon } from '@expo/vector-icons';
import { Eye, EyeOff } from 'lucide-react-native';


export default function ProfileScreen({ route, navigation }) {
    const [isConnected, setIsConnected] = React.useState(AuthContext);
    const { setUser, user } = React.useContext(UserContext);
    const { logout } = React.useContext(AuthContext);
    const { handleDeleteAccount } = React.useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleConfirmDeleteAccount = async () => {
        Alert.alert(
            'Suppression du compte',
            'Êtes-vous sûr de vouloir supprimer votre compte ?',
            [
                {
                    text: 'Annuler',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'Supprimer', onPress: () => deleteAccount() }
            ],
            { cancelable: false }
        );
    };

    const deleteAccount = async () => {   
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.delete('https://api.kouiz.fr/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                handleDeleteAccount();
                console.log('Account deleted');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitPersonalInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put('https://api.kouiz.fr/api/user/profile', {
                username,
                email,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                navigation.navigate('Dashboard');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View className="flex flex-col justify-start items-start h- w-screen dark:bg-sBlue pt-16 pb-40">
                <View className="p-6 space-y-4">
                    <Text style={styles.title_bold} className="text-3xl w-full text-pBrown">Mon Profil.</Text>
                    <Text style={styles.body} className="my-2 text-md dark:text-pWhite">Gérez votre compte ici.</Text>
                </View>
                <View className="p-6 space-y-4">
                    <Text style={styles.title_bold} className="text-xl w-full text-pBrown">Informations personnelles.</Text>
                    <Text style={styles.body} className="text-md dark:text-pWhite">Modifiez votre pseudo ou votre email.</Text>
                </View>
                <View className="grid w-full justify-center items-center gap-y-2">
                    <View className="rounded-lg p-6 bg-pWhite dark:bg-pBlue border border-[#999]/30 w-11/12 dark:border-0">
                        <View className="space-y-8 ">
                            <View>
                                <Text style={styles.body_bold} className="text-pBlue dark:text-pWhite  text-sm">Pseudo.</Text>
                                <TextInput
                                    className="h-10 mt-2 w-full bg-[#f3f3f3] rounded-lg block p-2.5 dark:text-[#000] border border-pGray"
                                    inputMode='text'
                                    onChangeText={setUsername}
                                    placeholder='John Doe'
                                    placeholderTextColor='gray'
                                ></TextInput>
                            </View>
                            <View>
                                <Text style={styles.body_bold} className="text-pBlue dark:text-pWhite  text-sm">Email.</Text>
                                <TextInput
                                    className="h-10 mt-2 w-full bg-[#f3f3f3] rounded-lg block p-2.5 dark:text-[#000] border border-pGray"
                                    inputMode='email'
                                    onChangeText={setEmail}
                                    placeholder='contact@kouiz.fr'
                                    placeholderTextColor='gray'
                                    returnKeyType='next'
                                    onSubmitEditing={() => secondTextInput.focus()}
                                ></TextInput>
                            </View>
                            <View className="flex flex-row mt-8">
                                <Pressable className="w-full bg-pBrown h-11 px-8 flex flex-row justify-center items-center rounded-lg" onPress={handleSubmitPersonalInfo}>
                                    <Text style={styles.title_bold} className="text-pWhite  text-sm flex justify-center items-center">Modifier</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="w-11/12 border-t border-pBrown my-24 mx-auto"></View>

                <View className="px-6 pb-6 space-y-4">
                    <Text style={styles.title_bold} className="text-xl w-full  text-pBrown">Actions sur le compte.</Text>
                    <Text style={styles.body} className="text-md dark:text-pWhite">Déconnectez vous ou supprimez votre compte.</Text>
                </View>
                <View className="grid w-full justify-center items-center gap-y-2">
                    <View className="rounded-lg p-6 bg-pWhite dark:bg-pBlue border border-[#999]/30 w-11/12 dark:border-0">
                        <View className="space-y-8 ">
                            <View className="flex flex-col mt-8 gap-4 items-center">
                                <Pressable onPress={logout} className="w-full bg-pBrown h-11 px-8 flex flex-row justify-center items-center rounded-lg">
                                    <Text style={styles.title_bold} className="text-pWhite  text-sm flex justify-center items-center">Déconnecter</Text>
                                </Pressable>
                                <Pressable onPress={handleConfirmDeleteAccount} className="w-full bg-[#ef4343] h-11 px-8 flex flex-row justify-center items-center rounded-lg">
                                    <Text style={styles.title_bold} className="text-pWhite  text-sm flex justify-center items-center">Supprimer mon compte</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    title_bold: {
        fontFamily: 'Unbounded_700Bold',
    },
    title_medium: {
        fontFamily: 'Unbounded_500Medium',
    },
    title: {
        fontFamily: 'Unbounded_400Regular',
    },
    body_bold: {
        fontFamily: 'Manrope_700Bold',
    },
    body_medium: {
        fontFamily: 'Manrope_500Medium',
    },
    body: {
        fontFamily: 'Manrope_400Regular',
    },
    container: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'start',
        width: '100%',
        backgroundColor: '#f1f1f1',
    },
});