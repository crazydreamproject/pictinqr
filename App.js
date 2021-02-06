import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScannerView } from './Scanner';

export default function App() {
  return (
    <ScannerView />
  );
}
/*
    <View style={styles.container}>
      <ScannerView></ScannerView>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>

*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
