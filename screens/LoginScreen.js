import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Alert, StyleSheet, Pressable, Text, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext';
import UserContext from '../contexts/UserContext';




export default function LoginScreen({ navigation }) {
    const { setIsConnected } = React.useContext(AuthContext);
    const { setUser } = React.useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {
        const checkTokenAndUser = async () => {
            const token = await AsyncStorage.getItem('token');
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            setIsConnected(!!token);
            setUser(user);
        };
        checkTokenAndUser();
    }, []);

    const login = () => {
        if (!password || !email) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        axios({
            method: 'post',
            url: 'http://64.226.74.198:8000/api/login',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                email: email,
                password: password,
            },
        })
            .then((response) => {
                if (response.data.success === true) {
                    AsyncStorage.setItem('token', response.data.token);
                    AsyncStorage.setItem('user', JSON.stringify(response.data.user));
                    setUser({ token: response.data.token, role: response.data.role, user: response.data.user });
                    setIsConnected(true);
                } else {
                    if (response.data.errorsList) {
                        const errorsList = response.data.errorsList;
                        let errorMessages = '';
                        Object.keys(errorsList).forEach(key => {
                            errorMessages += `${errorsList[key].join(', ')}\n`.replace(/non fourni/g, "requis");
                        });
                        console.log(errorMessages);
                        errorMessages = errorMessages.trim();
                        Alert.alert('Erreur', errorMessages);
                    }
                }
            })
            .catch((error) => {
                Alert.alert('Erreur');
            });

    };

    return (
        <View className="flex justify-evenly items-center h-screen">
            <Image className="object-scale-down h-20 w-16 absolute top-28 right-20" source={require('../assets/graphic-assets/brown-stars.png')} />
            <View className="w-screen flex items-center justify-center">
                <Text className="text-5xl text-primaryBrown" style={styles.heading}>Kouiz</Text>
                <Text className="w-4/6 my-2 text-center text-primaryBeige" style={styles.subheading}>Quand la création de quiz s'actualise</Text>
            </View>
            
            <View className="h-9/12 w-screen flex items-center justify-center">
                <Text className="font-bold mb-2 w-4/5 text-primaryBeige" style={styles.accentuated}>Email</Text>
                <TextInput
                    className="h-10 w-4/5 bg-secondaryBeige mt-1 mb-9 border-b-2 border-primaryBrown rounded-t px-2"
                    inputMode='email'
                    value={email}
                    onChangeText={setEmail}
                    placeholder='contact@kouiz.fr'
                />
                <Text className="font-bold mb-2 w-4/5 text-primaryBeige" style={styles.accentuated}>Mot de passe</Text>
                <TextInput
                    className="h-10 w-4/5 bg-secondaryBeige mt-1 mb-9 border-b-2 border-primaryBrown rounded-t px-2"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder='********'
                />
                <Pressable className="bg-primaryBrown rounded-full w-3/6 my-5" onPress={login}>
                    <Text className="text-[#fff] text-center p-2.5" style={styles.accentuated}>Se connecter</Text>
                </Pressable>
                <View className="flex flex-row justify-center w-screen my-5">
                    <Text className="text-primaryBeige" style={styles.body}>Pas encore de compte ? </Text>
                    <Pressable onPress={() => navigation.navigate('Inscription')}>
                        <Text className="text-primaryBrown" style={styles.accentuated}>Inscrivez-vous</Text>
                    </Pressable>
                </View>
            </View>
        </View>
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
});