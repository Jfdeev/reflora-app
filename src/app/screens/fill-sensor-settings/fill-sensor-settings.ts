import { StyleSheet } from "react-native";

  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start', 
      padding: 20,
      paddingTop: 50,
      backgroundColor: '#e5d3b1',
    },
    text: {
      fontSize: 22,
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
    },
    title: {
      color: '#0e3b22',
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 120, 
      textAlign: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#050038',
      marginBottom: 10,
      marginTop: 10,
      textAlign: 'left',
    },
    input: {
      height: 45,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
      color: '#333',
    },
    button: {
      marginTop: 20,   
      backgroundColor: '#1A1A1A',
      borderRadius: 5,
      paddingVertical: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    backButton: {
      position: 'absolute',
      top: 50, // Ajuste conforme necessidade
      left: 20,
      zIndex: 1,
      padding: 10,
    },
    error: {
      color: 'red',
      fontSize: 12,
      marginBottom: 8,
    }
  });

  export default styles;