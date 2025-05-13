import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';


export default function SplashScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    PixelFont: require('@/src/assets/fonts/PixelGameFont.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        router.replace('/screens/welcome'); 
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <Text>Carregando fontes...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/src/assets/images/reflora-logo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>REFLORA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BED88B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'PixelFont',
    marginTop: 35,
  },
});