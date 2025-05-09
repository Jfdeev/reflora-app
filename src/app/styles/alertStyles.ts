import { StyleSheet } from 'react-native';


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEAD7',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3A34',
  },
  notifications: {
    gap: 15,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  seeMore: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
