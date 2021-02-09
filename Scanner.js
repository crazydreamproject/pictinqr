/**
 * QR Code scan
 */
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Container, Header, View, Button, Icon, Fab, Text, Toast } from 'native-base';
import * as Device from 'expo-device';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { DeviceMotion } from 'expo-sensors';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

/* will be updated on calibration */
let initialMotion = {
    rotation: {
        alpha: 0, beta: 0, gamma: 0
    }
};

const initialQrData = {
    x: 0,
    y: 0,
    width: 128,
    height: 128,
    data: "http://picsum.phtos/128/128",
};

const QrDataType = {
    none: "null",
    image: "Image URL",
    url: "Web URL but not image",
    data: "RAW data"
};

export const ScannerView = (props) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [calibrate, setCalibrate] = useState(true);
    const [motion, setMotion] = useState(initialMotion);
    const [qrdata, setQrData] = useState(initialQrData);
    const [datatype, setDataType] = useState(QrDataType.none);
    const [isWebUrl, setIsWebUrl] = useState(false);
    console.log(typeof qrdata);
    const imageStyle = {
        position: 'absolute',
        
        left: qrdata.x,
        top: qrdata.y,
        width: qrdata.width,
        height: qrdata.height,
        
        /*
        left: qrdata.x,
        //left: qrdata ? qrdata.x : 0,
        top: qrdata ? qrdata.y : 0,
        width: qrdata ? qrdata.width : 0,
        height: qrdata ? qrdata.height : 0,
        */

        transform: [
            //            { rotate: `${(motion.rotation.alpha -)}rad` },
            { rotateX: `${(motion.rotation.alpha - initialMotion.rotation.alpha) / 2}rad` },
            { rotateY: `${(motion.rotation.beta - initialMotion.rotation.beta) / 2}rad` },
            { rotateZ: `${(motion.rotation.gamma - initialMotion.rotation.gamma) / 2}rad` },
        ],
    }
    //console.log(JSON.stringify(motion.rotation));

    const handleCalibrate = () => {
        if (motion.rotation) {
            initialMotion.rotation.alpha = motion.rotation.alpha;
            initialMotion.rotation.beta = motion.rotation.beta;
            initialMotion.rotation.gamma = motion.rotation.gamma;
        }
        setCalibrate(false);
    };

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        (async () => {
            const isAvailable = await DeviceMotion.isAvailableAsync();
            if (isAvailable) {
                /*
                DeviceMotion.addListener((motionData) => {
                    // humm. using both motion and camera(barcodescanner) in android drops qrscan speed hopelessly...
                    if (Device.osName === 'Android') {
                        return;
                    }
                    setMotion(motionData);
                    if (calibrate) {
                        handleCalibrate();
                    }
                });
                */
            } else {
                //console.log("DeviceMotion not available...");
            }
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data, bounds, cornerPoints }) => {
        setScanned(true);
        //setIsImage(data.startsWith("http"));
        //setIsWebUrl(false);
        setDataType(data.startsWith("http") ? QrDataType.image : QrDataType.data);
        setQrData({
            x: bounds.origin.x,
            y: bounds.origin.y,
            width: bounds.size.width,
            height: bounds.size.height,
            data: data,
        });
        //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        //console.log(`Bar code data ${data} has been scanned`);
    };

    const handleImageError = (ev) => {
        Toast.show({
            text: "QR Code: Not Image URL",
        });
        //setDataType(QrDataType.url);
        setIsWebUrl(true);
    };

    const handleImageLoad = () => {
        Toast.show({
            text: qrdata.data,
        });
        setDataType(QrDataType.image);
    }

    const handleShowData = () => {
        Toast.show({
            text: qrdata.data,
        });
    };

    const handleOpenUrl = () => {
        Toast.show({
            text: `Opening ${qrdata.data} in browser...`
        });
        WebBrowser.openBrowserAsync(qrdata.data);
    };

    const handleReset = () => {
        setIsWebUrl(false);
        setQrData(QrDataType.none);
        setCalibrate(true);
        setScanned(false);
        //setQrData(initialQrData);
        //setMotion(initialMotion);
    };

    /**
     * UI related stuffs
     */
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    if (scanned) {
        /*
        Toast.show({
            text: qrdata.data
        });
        */
    } else {
        Toast.show({
            text: "Scanning QR...",
            position: "top",
            duration: 9999,
        });
    }
    return (
        <Container>
            <View style={styles.container}>
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                />
                {(scanned && datatype === QrDataType.image) && 
                    <Image style={imageStyle} source={{ uri: qrdata.data }} onError={handleImageError} onLoad={handleImageLoad} />
                }
                {(scanned && isWebUrl) && <Button primary style={{opacity: 0.8, ...imageStyle}} onPress={handleOpenUrl} >
                    <Icon style={{ fontSize: imageStyle.width / 2, color: 'black' }} type="Ionicons" name="earth"></Icon>
                </Button>}
                {(scanned && datatype === QrDataType.data) && <Button primary style={{opacity: 0.8, ...imageStyle}} onPress={handleShowData} >
                    <Icon style={{ fontSize: imageStyle.width / 2, color: 'black' }} type="Ionicons" name="information-circle"></Icon>
                </Button>}
                <Fab
                    active={true}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={handleReset}>
                    <Icon name="sync" />
                </Fab>
            </View>
        </Container>
    );
};
