import {BarcodeScanningResult, CameraView, useCameraPermissions} from 'expo-camera';
import {Button, StyleSheet, Text, View} from 'react-native';
import {getLocalizedText} from "@/languages/languages";

interface Props {
    onScan: (data: string) => void;
}

export const BarcodeScanner = (props: Props) => {
    const {onScan} = props;
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View/>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>{getLocalizedText('camera_permission')}</Text>
                <Button onPress={requestPermission} title={getLocalizedText('permission_grant')}/>
            </View>
        );
    }

    const handleBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
        const {data} = scanningResult;
        data && onScan && onScan(data);
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={'back'}
                barcodeScannerSettings={{
                    barcodeTypes:
                        ['ean13', 'aztec', 'ean8', 'qr', 'pdf417', 'upc_e', 'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128', 'upc_a'],
                }}
                onBarcodeScanned={handleBarcodeScanned}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        borderWidth: 1,
        minHeight: 200,
        backgroundColor: 'white'
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 64,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '100%',
        paddingHorizontal: 64,
    },
    button: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
