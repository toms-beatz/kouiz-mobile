import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Alert, StyleSheet, Pressable, Text, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext';
import UserContext from '../contexts/UserContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserRoundCheck, Eye, EyeOff } from 'lucide-react-native';



export default function LoginScreen({ navigation, route }) {
    const { setIsConnected } = React.useContext(AuthContext);
    const { setUser, user } = React.useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State variable to track password visibility 
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle the password visibility state 
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    useEffect(() => {
        const checkTokenAndUser = async () => {
            const token = await AsyncStorage.getItem('token');
            setIsConnected(!!token);
        };
        checkTokenAndUser();
    }, []);

    const login = () => {
        if (!password || !email) {
            Alert.alert(
                'Erreur',
                'Veuillez remplir tous les champs.',
                [
                    {
                        text: 'OK',
                        style: 'default'
                    },
                    {
                        text: 'S\'inscrire',
                        onPress: () => navigation.navigate('Inscription'),
                        style: 'cancel'
                    }
                ]
            );
            return;
        }

        axios({
            method: 'post',
            url: 'https://api.kouiz.fr/api/login',
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
                    AsyncStorage.setItem('token', response.data.data.token);
                    AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
                    setUser(response.data.data.user);
                    setIsConnected(true);

                } else {
                    const errorsList = response.data.message;
                    Alert.alert('Erreur', errorsList);

                }
            })
            .catch((error) => {
                let errorMessages = '';
                if (error.response && error.response.data.errorsList) {
                    const errorsList = error.response.data.errorsList;
                    Object.keys(errorsList).forEach(key => {
                        errorMessages += `${errorsList[key].join(', ')}\n`;
                    });
                    errorMessages = errorMessages.trim();
                    Alert.alert('Erreur', errorMessages);
                } else {
                    console.log(error);
                    errorMessages = error.response.message;
                    Alert.alert('Erreur', errorMessages);
                }
            });

    };


    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? -100 : 100}
            className="flex-1 bg-pGray dark:bg-sBlue"
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
                <View className="flex flex-col px-6 justify-center items-center h-screen">
                    <View className="w-full bg-pWhite dark:bg-pBlue rounded-lg shadow-md max-w-md mb-20">
                        <View className="p-6 space-y-4">
                            <View className="text-2xl  leading-tight tracking-tight flex !flex-col justify-start items-start">
                                <UserRoundCheck width='22' className='text-pBrown w-3 h-3' /><Text style={styles.title_bold} className="text-pBrown text-2xl">Connexion.</Text>
                            </View>

                            <View className="space-y-8 ">
                                <View>
                                    <Text style={styles.body_bold} className="text-pBlue dark:text-pWhite  text-sm">Email<Text style={styles.title_bold} className="text-pBrown pl-1">*</Text></Text>
                                    <TextInput
                                        className="h-10 mt-2 w-full bg-[#f3f3f3] rounded-lg block p-2.5 dark:text-[#000] border border-pGray"
                                        inputMode='email'
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder='contact@kouiz.fr'
                                        placeholderTextColor='gray'
                                        returnKeyType='next'
                                        onSubmitEditing={() => secondTextInput.focus()}
                                    ></TextInput>
                                </View>
                                <View>
                                    <View className="flex flex-row justify-between">
                                        <Text style={styles.body_bold} className=" text-pBlue dark:text-pWhite  text-sm">Mot de passe<Text style={styles.title_bold} className="text-pBrown pl-1">*</Text></Text>
                                        <Pressable onPress={() => navigation.navigate('Mot de passe oublié')}>
                                            <Text style={styles.body_bold} className="text-pBrown  text-sm">Mot de passe oublié ?</Text>
                                        </Pressable>
                                    </View>
                                    <View className="flex flex-row items-center">
                                        <View className="flex flex-row items-center justify-between h-10 mt-2 w-full bg-[#f3f3f3] rounded-lg p-2.5 dark:text-[#000] border border-pGray">
                                            <TextInput
                                                className="w-11/12"
                                                value={password}
                                                onChangeText={setPassword}
                                                secureTextEntry={!showPassword}
                                                placeholder='********'
                                                placeholderTextColor='gray'
                                                ref={(input) => { secondTextInput = input; }}
                                                blurOnSubmit={true}
                                                returnKeyType='go'
                                                onSubmitEditing={login}
                                                selectionColor='#9D775D'
                                            />
                                            <Pressable onPress={toggleShowPassword}>
                                                {showPassword ? <EyeOff width='22' className='text-pBrown' /> : <Eye width='22' className='text-pBrown' />}
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View className="flex flex-row mt-8">
                                        <Pressable onPress={login} className="bg-pBrown h-11 px-8 flex flex-row items-center rounded-lg">
                                            <Text style={styles.title_bold} className="text-pWhite  text-sm flex justify-center items-center">Se connecter</Text>
                                        </Pressable>
                                    </View>
                                    <View className="flex flex-row mt-8">
                                        <Text style={styles.body_medium} className="text-pBlue dark:text-pWhite">Pas encore de compte ? </Text>
                                        <Pressable onPress={() => navigation.navigate('Inscription')}>
                                            <Text style={styles.body_bold} className="text-pBrown ">Inscrivez-vous</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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

});