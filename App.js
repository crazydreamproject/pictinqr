import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Root } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ScannerView } from './Scanner';

export default function App() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            await Font.loadAsync({
                Roboto: require('native-base/Fonts/Roboto.ttf'),
                Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
                ...Ionicons.font,
            });
            setReady(true);
        })();
        return () => {
            ;
        }
    }, []);

    if (!ready) {
        return (
            <AppLoading />
        );
    } else {
        return (
            <Root>
                <ScannerView />
            </Root>
        );
    }
}
