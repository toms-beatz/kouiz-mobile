import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Alert, StyleSheet, Pressable, Text, Image, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../contexts/UserContext';
import { Link } from '@react-navigation/native';
import { FolderSearch, ArrowRight, RefreshCw } from 'lucide-react-native';

export default function HomeScreen({ }) {
    const { setUser, user } = React.useContext(UserContext);
    const [dashboardData, setDashboardData] = useState(null);

    
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                setUser(user);

                const response = await axios({
                    method: 'get',
                    url: `https://api.kouiz.fr/api/dashboard`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (response.data.success === true) {
                    setDashboardData(response.data.data);
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
            } catch (error) {
                Alert.alert('Erreur : ', error.message || 'Une erreur est survenue. Veuillez réessayer.');
                console.log(error);
            }
        };



    const kouizTitle = dashboardData?.topKouiz?.title ?? dashboardData?.topKouiz;
    const kouizId = dashboardData?.topKouiz?.id ?? dashboardData?.topKouiz;

    useEffect(() => {
        fetchData();
    }, []);

    const handlePageRefresh = () => {
        setDashboardData(null);
        fetchData();
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View className="flex flex-col justify-start items-start h-full w-full dark:bg-sBlue pt-16 pb-40">
                <Pressable className="p-6 space-y-4 absolute top-16 right-0" onPress={handlePageRefresh}>
                    <RefreshCw className="text-3xl text-pBrown animate-spin" />
                </Pressable>
                <View className="p-6">
                    <Text style={styles.title_bold} className="text-3xl w-full text-pBrown">Mon dashboard</Text>
                    <Text style={styles.body} className="mt-2 text-md dark:text-pWhite">Visualiser des données sur vos Kouiz.</Text>
                </View>
                <View className="p-6 pt-0 grid grid-cols-1 lg:grid-cols-3 gap-2 mt- *:bg-pWhite">
                    <View className="col-span-2 row-span-2 grid rounded-lg border dark:border-0 bg-pWhite border-pGray p-12 items-center dark:bg-pBlue text-pBrown">
                        <View className="wave-title font-title font-bold w-full gap-y-4">
                            <Text className="text-pBrown text-3xl leading-relaxed break-words" style={styles.title_bold}>Hello</Text>
                            <Text className="text-pBrown text-3xl leading-relaxed break-words" style={styles.title_bold}>{dashboardData && dashboardData.username}. 👋</Text>
                        </View>
                    </View>

                    <View className="flex col-span-2 row-span-2 rounded-lg border dark:border-0 bg-pWhite border-pGray dark:bg-pBlue !p-0">
                        <View>
                            <View className="flex flex-col justify-between items-center gap-2  text-pBrown p-12">
                                <View className="w-full flex">
                                    <Text className="font-bold text-xs text-[#999]">Votre Kouiz star. 🌟</Text>
                                </View>
                                <View className="w-full flex">
                                    <Text className="break-all font-bold text-lg text-pBrown" style={styles.title_bold}>{dashboardData && kouizTitle.charAt(0).toUpperCase() + kouizTitle.slice(1)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="grid rounded-lg border dark:border-0 bg-pWhite border-pGray dark:bg-pBlue !p-0">
                        <View className="flex items-center *:hover:text-pWhite p-12 flex-row">
                            <View className="flex w-3/12 justify-center items-center ">
                                <Text className="text-4xl">📄</Text>
                            </View>
                            <View className="w-9/12 flex flex-col justify-center items-center">
                                <View>
                                    <Text className="font-bold text-xs text-[#999] mb-4">
                                        Vous avez créé
                                    </Text>
                                </View>
                                <View>
                                    <Text className="text-5xl text-pBrown" style={styles.title_bold}>{dashboardData && dashboardData.totalKouiz}</Text>
                                </View>

                                <View>
                                    <Text className="text-xl text-pBrown" style={styles.title_bold}>Kouiz.</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="grid rounded-lg border dark:border-0 bg-pWhite border-pGray dark:bg-pBlue !p-0">
                        <View className="flex items-center p-12 flex-row">
                            <View className="flex w-3/12 justify-center items-center ">
                                <Text className="text-4xl">📨</Text>
                            </View>
                            <View className="w-9/12 flex flex-col justify-center items-center">
                                <View>
                                    <Text className="text-5xl text-pBrown" style={styles.title_bold}>{dashboardData && dashboardData.totalAnswers}</Text>
                                </View>
                                <View>
                                    <Text className="text-xl text-pBrown" style={styles.title_bold}>Réponses.</Text>
                                </View>
                                <View>
                                    <Text className="font-bold text-xs text-[#999] mt-4">
                                        À vos Kouiz
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="flex flex-col col-span-2 row-span-2 rounded-lg border dark:border-0 bg-pWhite border-pGray dark:bg-pBlue">
                        <Link to={{ screen: 'KouizStack' }}>
                            <View className="flex items-center justify-center w-full p-12 flex-row">
                                <View className="flex items-center justify-center w-full gap-4">
                                    <Text className="text-2xl font-title text-pBrown" style={styles.title_bold}>Répondre à des Kouiz.</Text>
                                    <View className="flex flex-col justify-center items-center w-full gap-4">
                                        {/* <View className=""> */}
                                        <FolderSearch size={48} color={"#9D775D"} />
                                        <View className="flex flex-col justify-cnter items-center">
                                            <View className="font-body justify-center items-center flex flex-row">
                                                <Text className="font-bold text-md dark:text-pWhite">Voir les Kouiz</Text>
                                                <ArrowRight size={20} color={"#9D775D"} className="ml-1" />
                                            </View>
                                        </View>
                                        {/* </View> */}
                                    </View>
                                </View>
                            </View>
                        </Link>
                    </View>
                </View>
            </View >
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
        backgroundColor: '#f1f1f1',
    },
});