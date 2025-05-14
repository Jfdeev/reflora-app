import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F1E3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#33582B',
    textAlign: 'center',
    marginBottom: 12,
  },
  pickerIOS: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: '#333',
    paddingRight: 30,
    marginBottom: 20,
  },
  pickerAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: '#333',
    paddingRight: 30,
    marginBottom: 20,
  },

  // Grid dos cards
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardWrapper: {
    width: '48%',        // dois cards lado a lado
    height: 120,         // altura maior
    marginBottom: 16,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardTextLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  cardTextValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  chartPlaceholder: {
    height: 180,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    color: '#999',
  },
});

export default styles;
