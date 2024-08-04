import React, { useState, useEffect } from 'react';
import { useColorScheme } from "react-native";
import { Button, TextInput, View, Alert, StyleSheet, Pressable, Text, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserRoundPlus, Eye, EyeOff, CalendarDays } from 'lucide-react-native';
import { set } from 'react-hook-form';



export default function RegisterScreen({ navigation }) {
    const colorScheme = useColorScheme();
    const { setIsConnected } = React.useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [birthdateToSend, setBirthdateToSend] = useState(null);
    const [birthdateToShow, setBirthdateToShow] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (dateString) => {
        let date = new Date(dateString);
        let currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() - 13);

        if (date > currentDate) {
            // Afficher un message d'erreur

            Alert.alert('Erreur', 'Vous devez avoir au moins 13 ans.', [
                {
                    text: 'Quitter',
                    onPress: () => navigation.navigate('Connexion'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    styles: 'default'
                },
            ]);
            return;
        }

        let formattedDateToSend = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        let formattedDateToShow = `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
        setBirthdateToSend(formattedDateToSend);
        setBirthdateToShow(formattedDateToShow);
        hideDatePicker();
    };

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
        if (!username || !email || !password || !birthdateToSend) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        axios({
            method: 'post',
            url: 'https://api.kouiz.fr/api/register',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                username: username,
                birthdate: birthdateToSend,
                email: email,
                password: password,
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
                        errorMessages = errorMessages.trim();
                        Alert.alert('Erreur', errorMessages);
                    }
                }
            })
            .catch((error) => {
                console.error('Erreur:', error);
            });
    };
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());


    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? -100 : 100}
            className="flex-1 bg-pGray dark:bg-sBlue"
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
                <View className="flex flex-col w-items-center h-full justify-center">
                    <View className="flex flex-col px-6 justify-center items-center h-screen">
                        <View className="w-full bg-pWhite dark:bg-pBlue rounded-lg shadow-md max-w-md mb-2">
                            <View className="p-6 space-y-4">
                                <View className="text-2xl  leading-tight tracking-tight flex !flex-col justify-start items-start">
                                    <UserRoundPlus width='22' className='text-pBrown w-3 h-3' /><Text style={styles.title_bold} className="text-pBrown text-2xl">Inscription.</Text>
                                </View>

                                <View className="space-y-8 ">
                                    <View>
                                        <Text style={styles.body_bold} className="text-pBlue dark:text-pWhite  text-sm">Pseudo<Text style={styles.title_bold} className="text-pBrown pl-1">*</Text></Text>
                                        <TextInput
                                            className="h-10 mt-2 w-full bg-[#f3f3f3] rounded-lg block p-2.5 dark:text-[#000] border border-pGray"
                                            inputMode='text'
                                            value={username}
                                            onChangeText={setUsername}
                                            placeholder='John Doe'
                                            placeholderTextColor='gray'
                                        ></TextInput>
                                    </View>
                                    <View>
                                        <Text style={styles.body_bold} className="text-pBlue dark:text-pWhite  text-sm">Date de naissance<Text style={styles.title_bold} className="text-pBrown pl-1">*</Text></Text>
                                        <TouchableOpacity onPress={showDatePicker} className="flex flex-row !items-center justify-between h-10 mt-2 w-full bg-[#f3f3f3] rounded-lg p-2.5 dark:text-[#000] border border-pGray">
                                            <TouchableOpacity onPress={showDatePicker}>
                                                <Text className={birthdateToShow ? '' : "text-pGray "}>{birthdateToShow ? birthdateToShow : "09/09/2001"}</Text>
                                            </TouchableOpacity>
                                            <DateTimePickerModal
                                                isVisible={isDatePickerVisible}
                                                mode="date"
                                                onChange={setSelectedDate}
                                                onCancel={hideDatePicker}
                                                onConfirm={handleConfirm}
                                                cancelTextIOS='Annuler'
                                                confirmTextIOS='Confirmer'
                                                buttonTextColorIOS='#9D775D'
                                                locale="fr_FR"
                                                display="spinner"
                                                minimumDate={new Date(1950, 0, 1)}
                                                maximumDate={maxDate}
                                                customHeaderIOS={() => {
                                                    return <View className="flex justify-center items-center p-4 bg-pWhite dark:bg-pBlue w-full border-b-2 border-pGray dark:border-b dark:border-sBlue">
                                                        <Text style={styles.title_bold} className="text-pBrown text-lg">Date de naissance</Text>
                                                    </View>
                                                }}
                                                accentColor='#9D775D'
                                                pickerContainerStyleIOS={{ backgroundColor: colorScheme === 'dark' ? '#2E3B52' : '#fff'}}
                                                customConfirmButtonIOS={() => {
                                                    return <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Pressable
                                                            onPress={(date) => { handleConfirm(selectedDate); }}
                                                            className="bg-pWhite dark:bg-pBlue rounded-b-xl w-full py-4 flex justify-center items-center border-t-2 border-pGray dark:border-t dark:border-sBlue">
                                                            <Text className="text-pBrown text-xl">Confirmer</Text>
                                                        </Pressable>
                                                    </View>
                                                }}
                                                backdropStyleIOS={{ backgroundColor: 'rgb(0, 0, 0)' }}
                                                customCancelButtonIOS={(date) => {
                                                    return <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                                        <Pressable
                                                            onPress={hideDatePicker}
                                                            className="bg-pWhite dark:bg-pBlue rounded-xl w-full py-4 flex justify-center items-center">
                                                            <Text className="text-pBrown text-xl">Annuler</Text>
                                                        </Pressable>
                                                    </View>
                                                }}
                                                // value={selectedDate ? new Date(selectedDate) : new Date(2001, 8, 9)}
                                            />
                                            <CalendarDays width='22' className='text-pBrown' />

                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text style={styles.body_bold} className="text-pBlue dark:text-pWhite  text-sm">Email<Text style={styles.title_bold} className="text-pBrown pl-1">*</Text></Text>
                                        <TextInput
                                            className="h-10 mt-2 w-full bg-[#f3f3f3] rounded-lg block p-2.5 dark:text-[#000] border border-pGray"
                                            inputMode='email'
                                            value={email}
                                            onChangeText={setEmail}
                                            placeholder='contact@kouiz.fr'
                                            placeholderTextColor='gray'
                                        ></TextInput>
                                    </View>
                                    <View>
                                        <View className="flex flex-row justify-between">
                                            <Text style={styles.body_bold} className=" text-pBlue dark:text-pWhite  text-sm">Mot de passe<Text style={styles.title_bold} className="text-pBrown pl-1">*</Text></Text>
                                        </View>
                                        <View className="flex flex-row items-center">
                                            <View className="flex flex-row !items-center justify-between h-10 mt-2 w-full bg-[#f3f3f3] rounded-lg p-2.5 dark:text-[#000] border border-pGray">
                                                <TextInput
                                                    className=""
                                                    value={password}
                                                    onChangeText={setPassword}
                                                    secureTextEntry={!showPassword}
                                                    placeholder='********'
                                                    placeholderTextColor='gray'
                                                    ref={(input) => { secondTextInput = input; }}
                                                    blurOnSubmit={true}
                                                    returnKeyType='go'
                                                    onSubmitEditing={register}
                                                    selectionColor='#9D775D'
                                                />
                                                <Pressable onPress={toggleShowPassword}>
                                                    {showPassword ? <EyeOff width='22' className='text-pBrown' /> : <Eye width='22' className='text-pBrown' />}
                                                    {/* <Text style={styles.body_bold} className="text-pBrown  text-sm">{showPassword ? 'Cacher' : 'Afficher'}</Text> */}
                                                </Pressable>
                                            </View>
                                        </View>
                                        <View className="flex flex-row mt-8">
                                            <Pressable onPress={register} className="bg-pBrown h-11 px-8 flex flex-row items-center rounded-lg">
                                                <Text style={styles.title_bold} className="text-pWhite  text-sm flex justify-center items-center">S'inscrire</Text>
                                            </Pressable>
                                        </View>
                                        <View className="flex flex-row mt-8">
                                            <Text style={styles.body_medium} className="text-pBlue dark:text-pWhite">Déjà un compte ? </Text>
                                            <Pressable onPress={() => navigation.navigate('Connexion')}>
                                                <Text style={styles.body_bold} className="text-pBrown ">Connectez-vous</Text>
                                            </Pressable>
                                        </View>
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