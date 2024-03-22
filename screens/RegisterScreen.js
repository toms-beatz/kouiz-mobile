import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Alert, StyleSheet, Pressable, Text, Image, ScrollView } from 'react-native';
import axios from 'axios';
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext'; // Assurez-vous que le chemin est correct


export default function RegisterScreen({ navigation }) {
    const { setIsConnected } = React.useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setIsConnected(true);
            }
        };

        checkToken();
    }, [navigation]);

    const register = () => {
        if (!username || !email || !password || !role) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        axios({
            method: 'post',
            url: 'http://64.226.74.198:8000/api/register',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                name: username,
                email: email,
                password: password,
                role: role,
            },
        })
            .then((response) => {
                if (response.data.success === true) {
                    Alert.alert('Inscription réussie', 'Vous pouvez maintenant vous connecter.', [
                        { text: 'OK', onPress: () => navigation.navigate('Connexion') }
                    ]);
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
                console.error('Erreur:', error);
            });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View className="flex justify-evenly items-center h-screen">
            <Image className="object-scale-down h-20 w-16 absolute top-12 right-20" source={require('../assets/graphic-assets/brown-stars.png')} />
                <View className="h-3/12 w-screen flex items-center justify-center">
                    <Text className="text-5xl text-primaryBrown" style={styles.heading}>Kouiz</Text>
                    <Text className="w-4/6 my-2 text-center text-primaryBeige" style={styles.subheading}>Quand la création de quiz s'actualise</Text>
                </View>
                <View className="h-9/12 w-screen flex items-center justify-center">
                    <Text className="font-bold mb-2 w-4/5 text-primaryBeige" style={styles.accentuated}>Nom</Text>
                    <TextInput
                        className="h-10 w-4/5 bg-secondaryBeige mt-1 mb-9 border-b-2 border-primaryBrown rounded-t px-2"
                        value={username}
                        onChangeText={setUsername}
                        placeholder='John Doe'
                    />
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
                    <Text className="font-bold mb-2 w-4/5 text-primaryBeige" style={styles.accentuated}>Rôle</Text>
                    <RNPickerSelect
                        placeholder={{label: 'Choisissez un rôle'}}
                        onValueChange={(value) => setRole(value)}
                        items={[
                            { label: 'Beatmaker', value: 'Beatmaker' },
                            { label: 'Artist', value: 'Artist' },
                        ]}
                        style={{
                            inputIOS: {
                                height: 40,
                                width: '80%',
                                backgroundColor: '#FFF1E5',
                                marginBottom: 10,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                paddingLeft: 10,
                                borderBottomWidth: 2,
                                borderBottomColor: '#9D775D',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            },
                            inputAndroid: {
                                height: 40,
                                width: '80%',
                                backgroundColor: '#FFF1E5',
                                marginTop: 10,
                                marginBottom: 10,
                                borderRadius: 5,
                                paddingLeft: 10,
                            },
                        }}
                    />
                        <Pressable className="bg-primaryBrown rounded-full w-3/6 my-5" onPress={register}>
                            <Text className="text-[#fff] text-center p-2.5" style={styles.accentuated}>S'inscrire</Text>
                        </Pressable>
                        <View className="flex flex-row justify-center w-screen my-5">
                            <Text className="text-primaryBeige" style={styles.body}>Déjà un compte ? </Text>
                            <Pressable onPress={() => navigation.navigate('Connexion')}>
                                <Text className="text-primaryBrown" style={styles.accentuated}>Connectez-vous</Text>
                            </Pressable>
                        </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '80vw',
        paddingTop: 100,
        paddingBottom: 100,
    },
});

