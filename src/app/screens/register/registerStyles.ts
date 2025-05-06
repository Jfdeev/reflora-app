import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#EFEAD7',
    },
    title: {
        color: '#0B3824',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
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
    orSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    
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