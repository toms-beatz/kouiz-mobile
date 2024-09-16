import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, FlatList, ActivityIndicator, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext'; // Assurez-vous que le chemin est correct
import { set } from 'react-hook-form';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import UserContext from '../contexts/UserContext';
import { Link } from '@react-navigation/native';

export default function AnswersScreen({ route, navigation }) {
  const [isConnected, setIsConnected] = React.useState(AuthContext);
  const { setUser, user } = React.useContext(UserContext);
  const [answersData, setAnswersData] = useState([]);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View className="flex flex-col justify-start items-start w-screen dark:bg-sBlue pt-16">
        <View className="p-6 space-y-4">
          <Text style={styles.title_bold} className="text-3xl w-full text-pBrown">Mes Réponses.</Text>
          <Text style={styles.body} className="my-2 text-md dark:text-pWhite">Visualisez vos réponses à des Kouiz ici.</Text>
        </View>
      </View>

      {answersData.length > 0 ? (
        <View className="p-6 pt-0 grid grid-cols-1 lg:grid-cols-3 gap-2 mt- *:bg-pWhite">
          <View className="col-span-2 row-span-2 grid rounded-lg border dark:border-0 bg-pWhite border-pGray p-12 items-center dark:bg-pBlue text-pBrown">
            <View className="wave-title font-title font-bold w-full gap-y-4">
              <Text style={styles.title_bold} className="text-2xl">Réponses</Text>
              <Text style={styles.body} className="text-md dark:text-pWhite">Visualisez vos réponses à des Kouiz ici.</Text>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex justify-center items-center w-full h-full pt-40 pb-96 mb-auto dark:bg-sBlue">
          <Text style={styles.title_bold} className="text-xl text-pBrown w-11/12 text-center">
            L'enregistrement de réponses n'est pas encore disponible.
          </Text>
          <Text style={styles.body} className="text-md dark:text-pWhite mt-4 text-center">
            Vous pouvez  cependant répondre à des Kouiz.
          </Text>
          <Pressable className="bg-pBrown my-4 p-3 rounded-lg">
            <Text style={styles.title_medium} className="text-pWhite">
              <Link to={{ screen: 'KouizStack' }}>Voir les Kouiz</Link>
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
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
    paddingBottom: 200,
  },
});