import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;

const styles = StyleSheet.create({
  container: {
    padding: HORIZONTAL_PADDING,
    backgroundColor: '#F7F1E3',
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#CC5050',
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#33582B',
    textAlign: 'center',
    marginRight: 24, // espaço para alinhamento do ícone de voltar
  },
  currentCard: {
    backgroundColor: '#33582B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  currentTime: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#33582B',
    marginBottom: 8,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#33582B',
    marginTop: 4,
  },
  chart: {
    width: SCREEN_WIDTH - HORIZONTAL_PADDING * 2,
  },
});

const chartConfig = {
  backgroundGradientFrom: '#F7F1E3',
  backgroundGradientTo: '#F7F1E3',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(51, 88, 43, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(51, 88, 43, ${opacity})`,
  style: {
    borderRadius: 12,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#33582B',
  },
};

export default { styles, chartConfig };