import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions } from 'react-native'; // Switch bileşeni ekledik
import { LineChart } from 'react-native-chart-kit';
import { Table, Row } from 'react-native-table-component';

export default function Page() {
  const [pulse, setPulse] = useState(new Animated.Value(0));
  const [data, setData] = useState([]);
  const [maxValue, setMaxValue] = useState(100);
  const [minValue, setMinValue] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
      Animated.timing(pulse, {
        toValue: newValue,
        duration: 500,
        useNativeDriver: false,
      }).start();

      setData(prevData => [...prevData, newValue]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#65D04D',
    backgroundGradientFromOpacity: 0.1,
    backgroundGradientTo: '#5EBD48',
    backgroundGradientToOpacity: 0.3,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const labels = Array.from({ length: 24 }, (_, i) => i.toString());

  return (
    <View style={styles.container}>
      <View style={styles.pulseContainer}>
        <Text style={styles.title}>Patient Pulse</Text>
        <View style={styles.outerCircle}>
          <Animated.View
            style={[
              styles.pulse,
              {
                transform: [{ scale: pulse.interpolate({
                  inputRange: [minValue, maxValue],
                  outputRange: [1, 1.5],
                }) }],
              },
            ]}
          />
        </View>
        <Text style={styles.pulseText}>{Math.round(pulse._value)}</Text>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Pulse Chart</Text>
        <LineChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={Dimensions.get('window').width}
          height={256}
          verticalLabelRotation={30}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
      <View style={styles.tableContainer}>
        <Table borderStyle={{ borderWidth: 2, borderColor: '#C1C0B9' }}>
          {[...Array(2)].map((_, rowIndex) => (
            <Row
              key={rowIndex}
              data={[...Array(5)].map(() => <View style={styles.tableContainerInside}>
                <Text>Drug Bilgisi</Text>
                <Text>Drug Saati</Text>
                <Text>Alındı</Text>
              </View>)}
              style={styles.row}
              textStyle={styles.text}
            />
          ))}
        </Table>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  outerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'red',
  },
  pulseText: {
    fontSize: 18,
    marginTop: 10,
  },
  chartContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  tableContainer: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#C1C0B9',
    padding: 10,
    alignSelf: 'stretch', // Tablonun genişliğini ayarlar
  },
  tableContainerInside: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: { height: 50, backgroundColor: '#f1f8ff' },
  text: { margin: 6, textAlign: 'center' },
});
