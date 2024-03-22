import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Alert, StyleSheet, Pressable, Text, Image, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext';
import UserContext from '../contexts/UserContext';
import { Ionicons as Icon } from '@expo/vector-icons';

export default function ProfileScreen({ route, navigation }) {
    const [isConnected, setIsConnected] = React.useState(AuthContext);
    const [user, setUser] = React.useState(UserContext);
    useEffect(() => {
        const checkTokenAndUser = async () => {
            const token = await AsyncStorage.getItem('token');
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            setIsConnected(!!token);
            setUser(user);
        };
        checkTokenAndUser();
    }, []);
    console.log(user.role);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.navigate('Connexion');
            }
        });

        return unsubscribe;
    }, [navigation]);

    const { logout } = React.useContext(AuthContext);



    if (route.params && route.params.user) {
        const userData = route.params.user;
        user = Object.fromEntries(userData);
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View className="flex justify-evenly items-center w-full h-full bg-darkBlue">
                <View className="flex w-full h-full bg-darkBlue justify-center items-center">
                    <View className="flex justify-center items-center bg-primaryBeige rounded-full p-6 mb-12">
                        <Text className="text-5xl">👀</Text>
                    </View>
                    <Text className="text-primaryBrown text-4xl" style={styles.heading}>{user.name}</Text>
                    <View className="flex flex-row justify-center items-center bg-darkBlue">
                        <Text className="text-lg text-primaryBeige" style={styles.heading}>Email : </Text>
                        <Text className="text-secondaryBeige text-lg" style={styles.body}>{user.email}</Text>
                    </View>
                    <View className="flex flex-row justify-center items-center bg-darkBlue">
                        <Text className="text-lg text-primaryBeige" style={styles.heading}>Inscription : </Text>
                        <Text className="text-secondaryBeige text-lg" style={styles.body}>
                            {`Depuis le ${new Date(user.created_at).toLocaleDateString('fr-FR')}`}
                        </Text>
                    </View>

                    <Pressable className="bg-primaryBrown rounded-full w-3/6 my-5 py-2.5 flex flex-row justify-center items-center" onPress={logout}>
                        <Text className="text-lg text-white" style={styles.body}>Déconnexion</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>

    );
}


const styles = StyleSheet.create({
    heading: {
        fontFamily: 'NeueMachinaUltrabold',
    },
    subheading: {
        fontFamily: 'NeueMachinaRegular',
    },
    body: {
        fontFamily: 'BricolageGrotesqueLight',
    },
    accentuated: {
        fontFamily: 'BricolageGrotesque',
    },
    container: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'start',
        height: '100%',
        width: '100%',
    },
});