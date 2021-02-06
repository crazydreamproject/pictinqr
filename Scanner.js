import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const ScannerView = (props) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const initialQrData = {
        x: 0,
        y: 0,
        width: 128,
        height: 128,
        uri: "http://picsum.phtos/128/128",
    }
    const [qrdata, setQrData] = useState(initialQrData);
    const imageStyle = {
        position: 'absolute',
        left: qrdata.x,
        top: qrdata.y,
        width: qrdata.width,
        height: qrdata.height,
    }

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data, bounds, cornerPoints }) => {
        setScanned(true);
        setQrData({
            x: bounds.origin.x,
            y: bounds.origin.y,
            width: bounds.size.width,
            height: bounds.size.height,
            uri: data,
        });
        //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        console.log(`Bar code data ${data} has been scanned`);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            />
            {scanned && <Image style={imageStyle} source={ { uri: qrdata.uri } } 
            />}
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        </View>
    );
};
