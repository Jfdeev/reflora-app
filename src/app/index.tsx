import { View, Text } from 'react-native';
import { router, Router } from 'expo-router';

export default function Index() {
    return (
        <View style={{ 
         flex: 1,
         padding: 40,
         gap: 40, 
         }}>
            <Text>Reflora</Text>
        </View>
    )
}