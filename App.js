import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Root } from 'native-base';
import { ScannerView } from './Scanner';

export default function App() {
  return (
    <Root>
      <ScannerView />
    </Root>
  );
}
