import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2E9D7',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 60, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    text: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#1B3A34',
    },
    input: {
        height: 50,
        borderColor: '#1B3A34',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 20,
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
    },
    card: {
        width: '45%', 
        height: 100,
        margin: '2.5%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
    chartPlaceholder: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
      },
      chartText: {
        color: '#999',
      },
});

export default styles;