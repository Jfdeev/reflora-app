import { Stack } from "expo-router"
import { 
    useFonts, 
    Rubik_600SemiBold_Italic,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
 } from "@expo-google-fonts/rubik"

 import Loading from "../components/loading"

 import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function Layout() {
    const [fontsLoaded] = useFonts({
        Rubik_400Regular,
        Rubik_500Medium,
        Rubik_600SemiBold_Italic,
        Rubik_700Bold,
    })

    if(!fontsLoaded) {
        return <Loading />
    }

    return (
    <GestureHandlerRootView style={{flex: 1}}>
    <Stack 
    screenOptions={{
      headerShown: false,
      contentStyle:  {backgroundColor: "#f5f5dc"},
    }}
    />
    </GestureHandlerRootView>
  )
}