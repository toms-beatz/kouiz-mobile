import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext'; // Assurez-vous que le chemin est correct
import { set } from 'react-hook-form';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


export default function MyKouizScreen({ route, navigation }) {
  const [songs, setSongs] = useState([]);
  const { setIsConnected } = React.useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(token);

        const response = await axios({
          method: 'get',
          url: 'http://64.226.74.198:8000/api/songs/',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.data.success === true) {
          setSongs(response.data.songs);
          console.log(response.data.songs);
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
      } catch (error) {
        Alert.alert('Erreur');
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View className="flex justify-center items-center w-full h-full bg-darkBlue">
        <View className="bg-primaryBeige rounded-full p-6">
          <Text className="text-5xl">⏳</Text>
        </View>
        <Text className="text-2xl py-12 px-4 mb-24 text-primaryBeige" style={styles.heading}>Oups ! Vous n'avez pas de  <Text className="text-primaryBrown">Kouiz</Text> pour le moment<Text className="text-primaryBrown">...</Text></Text>

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