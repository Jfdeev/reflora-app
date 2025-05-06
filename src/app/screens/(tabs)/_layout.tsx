import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1B3A34',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#F2E9D7',
          height: 60,
        },
      })}
      // Falta adicionar os icones
    >
      <Tabs.Screen name="home/index" options={{ title: 'Início' }} />
      <Tabs.Screen name="data-screen/index" options={{ title: 'Dados' }} />
      <Tabs.Screen name="alert/index" options={{ title: 'Alertas' }} />
      <Tabs.Screen name="config/index" options={{ title: 'Configurações' }} />
    </Tabs>
  );
}
