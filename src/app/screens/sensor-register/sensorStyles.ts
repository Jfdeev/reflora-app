import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F1DE',
    padding: 20,
    paddingTop: 60, 
  
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B3612',
  },
  text: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    fontSize: 22,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  checkboxText: {
    marginLeft: 8,
    flexShrink: 1,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
  },
  submitButton: {
    backgroundColor: '#1B3612',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles; 