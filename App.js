import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  const apiKey = 'dde73287705240b2b8c131101243011';

  const [isLoaded] = useFonts({
    "Roboto": require('./assets/fonts/Roboto-Bold.ttf'),
    "Kanit": require('./assets/fonts/Kanit-Black.ttf'),
    "Nunito": require('./assets/fonts/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf')
  });

  const fetchWeather = async (cityName) => {
    try {
      const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`;
      const response = await axios.get(url);
      setWeather(response.data);
      setError(null);
    } catch (error) {
      setError('Hava durumu bilgisi alınırken bir hata oluştu.');
      setWeather(null);
    }
  };

  const toggleFavorite = (cityName) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(cityName)) {
        return prevFavorites.filter((fav) => fav !== cityName);
      }
      else {
        return [...prevFavorites, cityName];
      }
    });
  };

  const getBackgroundImage = () => {
    if (!weather) return require('./assets/default.jpg');

    const condition = weather.current.condition.text.toLowerCase();

    if (condition.includes('rain')) return require('./assets/rain.jpg');
    if (condition.includes('cloud')) return require('./assets/cloudy.jpg');
    if (condition.includes('sun') || condition.includes('clear')) return require('./assets/sunny.jpg');
    if (condition.includes('snow')) return require('./assets/snow.jpg');
    if (condition.includes('mist')) return require('./assets/fog.jpg');
    if (condition.includes('storm')) return require('./assets/storm.jpg');

    return require('./assets/default.jpg');
  };

  return (
    <ImageBackground
      source={getBackgroundImage()}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Şehir adı girin"
          placeholderTextColor="#666"
          value={city}
          onChangeText={setCity}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => fetchWeather(city)}>
        <Icon name="search" size={20} color="#0A1128" style={styles.icon} />
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityName}>{weather.location.name}</Text>
          <Text style={styles.temperature}>{weather.current.temp_c}°</Text>
          <Text style={styles.description}>
            {weather.current.condition.text}
          </Text>

          <Text style={styles.humidity}>
            <Icon name="tint" size={20} color="rgba(254, 252, 251, 0.7)" style={styles.icon} /> {weather.current.humidity}%
          </Text>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(weather.location.name)}
          >
            {favorites.includes(weather.location.name)
              ? (<Icon name="heart" size={20} color="#FEFCFB" />)
              : (<Icon name="heart-o" size={20} color="#FEFCFB" />)}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.favoritesContainer}>
        {favorites.length === 0 ? (
          <Text style={styles.noFavorites}>Favori şehir yok</Text>
        ) : (
          favorites.map((city, index) => (
            <TouchableOpacity
              key={index}
              style={styles.favoriteCityButton}
              onPress={() => fetchWeather(city)}
            >
              <Text style={styles.favoriteCity}>{city}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    width: '60%',
    marginBottom: 10,
    position: 'absolute',
    bottom: '35%',
    left: '5%',
  },
  input: {
    backgroundColor: '#FEFCFB',
    padding: 10,
    fontSize: 16,
    elevation: 4,
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#FEFCFB',
    height: 42,
    width: 42,
    position: 'absolute',
    bottom: '36.2%',
    right: '32%',
    alignItems: 'center',
    borderRadius: 100,
  },
  icon: {
    marginTop: 9,
  },
  error: {
    color: '#FEFCFB',
    position: 'absolute',
    fontSize: 30,
    left: '5%',
    bottom: '44%',
  },
  weatherContainer: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  },
  cityName: {
    fontSize: 25,
    position: 'absolute',
    fontFamily: 'Nunito',
    color: '#FEFCFB',
    top: '33%',
    left: '8%',
  },
  temperature: {
    fontSize: 150,
    position: 'absolute',
    bottom: '35%',
    fontFamily: 'Kanit',
    left: 0,
    color: '#FEFCFB',
  },
  description: {
    fontSize: 23,
    color: '#FEFCFB',
    position: 'absolute',
    fontFamily: 'Nunito',
    fontWeight: 'bold',
    top: '38.4%',
    left: 0
  },
  humidity: {
    fontSize: 23,
    color: '#FEFCFB',
    position: 'absolute',
    fontFamily: 'Nunito',
    top: '38.4%',
    right: '29%',
  },
  favoriteButton: {
    borderRadius: '100%',
    height: 30,
    width: 30,
    alignItems: 'center',
    position: 'absolute',
    top: '33.6%',
    left: 0,
  },
  favoriteButtonText: {
    color: 'rgba(254, 252, 251, 0.5)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoritesContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    position: 'absolute',
    bottom: '30%',
    left: 0,
  },
  noFavorites: {
    fontSize: 16,
    position: 'absolute',
    bottom: '27%',
    color: 'rgba(254, 252, 251, 0.4)',
    fontStyle: 'italic',
    left: 18
  },
  favoriteCityButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    marginBottom: 30,
  },
  favoriteCity: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#040710',
    position: 'absolute',
    backgroundColor: 'rgba(254, 252, 251, 0.4)',
    padding: 6,
    borderRadius: 10,
    top: 580,
    left: '5%',
    marginBottom: 20,
  },
});
