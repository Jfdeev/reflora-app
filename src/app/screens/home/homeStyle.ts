import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F2E9D7',
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#1B3A34',
    },
    actions: {
      marginTop: 30,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#1B3A34',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    actionText: {
      fontSize: 18,
      color: '#1B3A34',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 25,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1B3A34',
      marginHorizontal: 10,
      flex: 1,
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
    alertBox: {
      marginTop: 10,
      backgroundColor: '#1B3A34',
      borderRadius: 12,
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    alertText: {
      color: '#F2E9D7',
      marginLeft: 10,
      flex: 1,
      fontSize: 16,
    },
  });

export default styles;