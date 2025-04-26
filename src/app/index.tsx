import { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

export default function SplashScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    PixelFont: require('@/src/assets/fonts/PixelGameFont.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        router.replace('/screens/home'); 
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
      <Text style={styles.text}>R E F L O R A</Text>
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