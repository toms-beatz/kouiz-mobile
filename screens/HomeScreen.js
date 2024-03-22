import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Alert, StyleSheet, Pressable, Text, Image, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext';
import { Ionicons as Icon } from '@expo/vector-icons';
import { BarChart } from "react-native-gifted-charts";
import { PieChart } from "react-native-gifted-charts";

export default function HomeScreen({ route, navigation }) {
    const { setIsConnected } = React.useContext(AuthContext);
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


    let user = '';

    if (route.params && route.params.user) {
        const userData = route.params.user;
        user = Object.fromEntries(userData);
    }
    const barData = [
        {
            value: 40,
            label: 'Jan',
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: '#FFE3CB',
        },
        { value: 20, frontColor: '#9D775D' },
        {
            value: 50,
            label: 'Feb',
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: '#FFE3CB',
        },
        { value: 40, frontColor: '#9D775D' },
        {
            value: 75,
            label: 'Mar',
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: '#FFE3CB',
        },
        { value: 25, frontColor: '#9D775D' },
        {
            value: 30,
            label: 'Apr',
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: '#FFE3CB',
        },
        { value: 20, frontColor: '#9D775D' },
        {
            value: 60,
            label: 'May',
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: '#FFE3CB',
        },
        { value: 40, frontColor: '#9D775D' },
        {
            value: 65,
            label: 'Jun',
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: '#FFE3CB',
        },
        { value: 30, frontColor: '#9D775D' },
    ];

    const pieData = [
        {
            value: 47,
            color: '#9D775D',
            gradientCenterColor: '#9D775D',
            focused: true,
        },
        { value: 40, color: '#FFE3CB', gradientCenterColor: '#FFE3CB' },
        { value: 16, color: '#FFF1E5', gradientCenterColor: '#FFF1E5' },
        { value: 3, color: '#fff', gradientCenterColor: '#fff' },
    ];

    const renderDot = color => {
        return (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );
    };

    const renderLegendComponent = () => {
        return (
            <>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 10,
                        marginTop: 50,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: 120,
                            marginRight: 20,
                        }}>
                        {renderDot('#9D775D')}
                        <Text style={{ color: 'white' }}>Éducation : 47%</Text>
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                        {renderDot('#FFE3CB')}
                        <Text style={{ color: 'white' }}>Sport: 16%</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: 120,
                            marginRight: 20,
                        }}>
                        {renderDot('#FFF1E5')}
                        <Text style={{ color: 'white' }}>Youtube: 40%</Text>
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                        {renderDot('#fff')}
                        <Text style={{ color: 'white' }}>Jeux vidéos : 3%</Text>
                    </View>
                </View>
            </>
        );
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View className="flex gap-y-16 items-center w-screen h-full bg-darkBlue pt-24 pb-48">
                <Text className="text-3xl mb-6 text-primaryBeige" style={styles.heading}>Bienvenue sur <Text className="text-primaryBrown">Kouiz</Text> !</Text>
                <View className="flex justify-center items-center bg-lightBlue py-9 px-9 rounded-xl w-11/12">
                    <Text className="text-xl mb-4 text-primaryBeige" style={styles.heading}>Nouveaux <Text className="text-primaryBrown">utilisateurs 🚀</Text></Text>
                    <BarChart
                        data={barData}
                        barWidth={8}
                        spacing={24}
                        roundedTop
                        roundedBottom
                        hideRules
                        xAxisThickness={0}
                        yAxisThickness={0}
                        yAxisTextStyle={{ color: 'gray' }}
                        noOfSections={3}
                        maxValue={75}
                        isAnimated
                    />
                </View>

                <View className="flex justify-center items-center bg-lightBlue py-9 px-9 rounded-xl w-11/12">
                    <Text className="text-xl mb-4 text-primaryBeige" style={styles.heading}>Catégories <Text className="text-primaryBrown">populaires ✨</Text></Text>
                    <PieChart
                        data={pieData}
                        donut
                        showGradient
                        sectionAutoFocus
                        radius={90}
                        innerRadius={60}
                        innerCircleColor={'#232D41'}
                    />
                    {renderLegendComponent()}
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
        width: '100%',
    },
});