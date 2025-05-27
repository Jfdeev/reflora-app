import { StyleSheet } from 'react-native';

export default StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#e5d3b1',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e3b22',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    color: '#000',
    paddingRight: 30, // para o ícone não sobrepor
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
    width: '100%',
  },
  cardTextLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  cardTextValue: {
    fontSize: 16,
    color: '#000',
  },
  suggestionText: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#333',
  },
  dateText: {
    marginTop: 6,
    fontSize: 12,
    color: '#555',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#e5d3b1',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
});