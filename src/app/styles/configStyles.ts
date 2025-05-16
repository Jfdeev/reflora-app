import { StyleSheet } from 'react-native';


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5d3b1',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e3b22',
    alignSelf: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003920',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  switchContainer: {
    marginTop: 5,
    alignItems: 'flex-start',
  },
  logoutButton: {
    backgroundColor: '#B94141',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 30,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
