import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#EFEAD7',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 40,
    },
    loginregister: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#000',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginBottom: 12,
      width: '80%',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
    },
  });

  export default styles;