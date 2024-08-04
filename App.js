import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';
import AuthContext from './contexts/AuthContext';
import UserContext from './contexts/UserContext';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import MyKouizScreen from './screens/MyKouizScreen';
import ProfileScreen from './screens/ProfileScreen';
import KouizAnswer from './screens/KouizAnswer';

import {
  Unbounded_400Regular,
  Unbounded_500Medium,
  Unbounded_700Bold,
} from '@expo-google-fonts/unbounded';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_700Bold
} from '@expo-google-fonts/manrope';
import AnswersScreen from './screens/AnswersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
    Unbounded_400Regular,
    Unbounded_500Medium,
    Unbounded_700Bold,
  });

  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkTokenAndUser = async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      setIsConnected(!!token);
      setUser(user);
    };
    checkTokenAndUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setIsConnected(false);
  };


  const handleDeleteAccount = async () => {
    await AsyncStorage.removeItem('token');
    setIsConnected(false);
  };

  if (!loaded) {
    return <Text>Loading...</Text>;
  }

  const KouizStack = createNativeStackNavigator();

  function KouizStackScreen() {
    return (
      <KouizStack.Navigator initialRouteName='Kouiz'>
        <KouizStack.Screen
          name="Kouiz"
          component={MyKouizScreen}
          options={{
            headerShown: false,
            headerTintColor: '#9D775D',
            headerBackTitleStyle: { color: '#9D775D', fontFamily: 'Manrope_500Medium', fontSize: 16 },
            headerStyle: { backgroundColor: colorScheme === 'dark' ? '#2E3B52' : '#fff' },
            headerTitleStyle: { color: colorScheme === 'dark' ? '#fff' : '#9D775D', fontFamily: 'Unbounded_700Bold' },
          }}
        />
        <KouizStack.Screen
          name="KouizAnswer"
          component={KouizAnswer}
          options={{
            headerTintColor: '#9D775D',
            headerBackTitleStyle: { color: '#9D775D', fontFamily: 'Manrope_500Medium', fontSize: 16 },
            headerStyle: { backgroundColor: colorScheme === 'dark' ? '#2E3B52' : '#fff' },
            headerTitleStyle: { color: colorScheme === 'dark' ? '#fff' : '#9D775D', fontFamily: 'Unbounded_700Bold' },
            title: '',
            headerBackTitle: 'Liste des Kouiz',
          }}
        />
      </KouizStack.Navigator>
    );
  }

  return (
    <AuthContext.Provider value={{ isConnected, setIsConnected, logout, handleDeleteAccount }}>
      <UserContext.Provider value={{ user, setUser }}>
        <NavigationContainer>
          {isConnected ? (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size, focused }) => {
                  let iconName;

                  if (route.name === 'Dashboard') {
                    iconName = focused ? 'grid' : 'grid-outline';
                  } else if (route.name === 'KouizStack') {
                    iconName = focused ? 'albums' : 'albums-outline';
                  } else if (route.name === 'Profil') {
                    iconName = focused ? 'person' : 'person-outline';
                  } else if (route.name === 'Réponses') {
                    iconName = focused ? 'paper-plane' : 'paper-plane-outline';
                  }
                  return <Ionicons name={iconName} size={size} color={color} />;
                },

                tabBarStyle: {
                  backgroundColor: colorScheme === 'dark' ? '#2E3B52' : '#fff',
                  height: 80,
                  paddingTop: 10,
                  paddingBottom: 40,
                  position: 'absolute',
                  borderTopWidth: 1,
                  borderWidth: 0,
                  borderTopColor: colorScheme === 'dark' ? '#232D41' : "#f1f1f1",
                  fontFamily: 'Unbounded_700Bold',
                },
                tabBarShowLabel: false,
                headerShown: false,
                tabBarActiveTintColor: '#9D775D',
                tabBarInactiveTintColor: 'lightgray',
              })}
            >
              <Tab.Screen
                name="Dashboard"
                component={HomeScreen}
                options={{
                  headerStyle: { backgroundColor: colorScheme === 'dark' ? '#2E3B52' : '#fff' },
                  headerTitleStyle: { color: colorScheme === 'dark' ? '#fff' : '#9D775D', fontFamily: 'Unbounded_700Bold' },
                }}
              />
              <Tab.Screen
                name="KouizStack"
                component={KouizStackScreen}
                options={{
                  headerStyle: { backgroundColor: colorScheme === 'dark' ? '#2E3B52' : '#fff' },
                  headerTitleStyle: { color: colorScheme === 'dark' ? '#fff' : '#9D775D', fontFamily: 'Unbounded_700Bold' },
                }}
              />
              <Tab.Screen
                name="Réponses"
                component={AnswersScreen}
                options={{
                  headerStyle: { backgroundColor: colorScheme === 'dark' ? '#2E3B52' : '#fff' },
                  headerTitleStyle: { color: colorScheme === 'dark' ? '#fff' : '#9D775D', fontFamily: 'Unbounded_700Bold' },
                }}
              />
              <Tab.Screen
                name="Profil"
                component={ProfileScreen}
                options={{
                  headerStyle: { backgroundColor: colorScheme === 'dark' ? '#2E3B52' : '#fff' },
                  headerTitleStyle: { color: colorScheme === 'dark' ? '#fff' : '#9D775D', fontFamily: 'Unbounded_700Bold' },
                }}
              />
            </Tab.Navigator>
          ) : (
            <Stack.Navigator initialRouteName="Connexion">
              <Stack.Screen
                name="Connexion"
                component={LoginScreen}
                options={{
                  headerStyle: { backgroundColor: colorScheme === 'dark' ? '#2E3B52' : '#fff' },
                  headerTitleStyle: { color: colorScheme === 'dark' ? '#fff' : '#9D775D', fontFamily: 'Unbounded_700Bold' },
                }}
              />
              <Stack.Screen
                name="Inscription"
                component={RegisterScreen}
                options={{
                  headerTintColor: '#9D775D',
                  headerBackTitleStyle: { color: '#9D775D', fontFamily: 'Manrope_500Medium', fontSize: 16 },
                  headerStyle: { backgroundColor: colorScheme === 'dark' ? '#2E3B52' : '#fff' },
                  headerTitleStyle: { color: colorScheme === 'dark' ? '#fff' : '#9D775D', fontFamily: 'Unbounded_700Bold' },
                }}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}
