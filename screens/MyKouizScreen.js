import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, ActivityIndicator, TouchableOpacity, Pressable, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext';
import UserContext from '../contexts/UserContext';
import { ArrowRight, RefreshCw } from 'lucide-react-native';

export default function MyKouizScreen({ route, navigation }) {
  const [isConnected, setIsConnected] = React.useState(AuthContext);
  const { setUser, user } = React.useContext(UserContext);
  const { token, setToken } = useContext(AuthContext);
  const [kouizData, setKouizData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (page) => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const token = await AsyncStorage.getItem('token');
      setUser(user);

      const response = await axios({
        method: 'get',
        url: `https://api.kouiz.fr/api/kouiz/list/all?page=${page}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success === true) {
        setKouizData(prevData => [...prevData, ...response.data.data.data]);
        setPage(page + 1);
        setHasMore(response.data.data.data.length > 0);
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
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData(page).finally(() => setIsLoading(false));
  }, [token]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderItem = ({ item }) => (
    <View className="bg-pWhite dark:bg-pBlue border border-[#f1f1f1] dark:border-0 rounded-lg space-y-8 flex flex-col justify-between p-6 mb-2">
      <View>
        <View className="flex flex-row justify-between mb-4">
          <Text className="text-4xl">{item.emoji}</Text>
          <View className="flex flex-col">
            <Text className="text-pBrown/70 dark:text-[#c2c2c2]">Créé par</Text>
            <Text className="text-pBrown dark:text-pGray" style={styles.body_bold}>{item.creator_name}</Text>
          </View>
        </View>

        <Text className="font-title font-bold text-xl text-pBrown my-4" style={styles.title_bold}>{item.title}</Text>
        <Text className="text-md dark:text-pWhite" style={styles.body_medium}>{item.description}</Text>
      </View>

      <View className="flex flex-row w-full justify-end">
        <TouchableOpacity onPress={() => navigation.navigate('KouizAnswer', { id: item.id })} className="flex flex-row items-center bg-pBrown p-2 rounded-lg">
          <Text style={styles.body_bold} className="text-pWhite">Répondre </Text>
          <ArrowRight className="text-pWhite" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isFetching) return <View className="pb-40" />;
    return <ActivityIndicator size="large" color="#9D775D" style={{ margin: 20, paddingBottom: 400 }} />;
  };

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      fetchData(page);
    }
  };

  const renderHeader = () => (
    <View className="my-4">
      <Text style={styles.title_bold} className="text-3xl w-full text-pBrown">Kouiz.</Text>
      <Text style={styles.body} className="my-2 text-md dark:text-pWhite">Répondez à des Kouiz dès maintenant.</Text>
    </View>
  );

  const handleRedirectToKouiz = () => {
    Alert.alert('Redirection', 'Vous allez être redirigé vers le site de Kouiz.fr', [
      {
        text: 'Rester ici',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'Let\'s go 🚀', onPress: () => Linking.openURL('https://www.kouiz.fr/') }
    ]);
  }

  const handlePageRefresh = () => {
    setKouizData([]);
    setPage(1);
    fetchData(1);
  }

  return (
    <>
      <Pressable className="p-6 space-y-4 absolute right-0 top-12" onPress={handlePageRefresh}>
        <RefreshCw className="text-3xl text-pBrown" />
      </Pressable>
      <View style={styles.container}>

        {!isLoading && kouizData.length === 0 ? (
          <View className="flex justify-center items-center w-full h-screen dark:bg-sBlue">
            <Text style={styles.title_bold} className="text-xl text-pBrown w-11/12 text-center">Il n'y pas de Kouiz disponible pour le moment</Text>
            <Pressable className="bg-pBrown my-4 p-3 rounded-lg" onPress={handleRedirectToKouiz}>
              <Text style={styles.title_medium} className="text-pWhite">
                Soyez le premier à en créer !
              </Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={kouizData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHeader}


            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </>
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
    flex: 1,
    paddingTop: 40,
    padding: 24,
  },
});
