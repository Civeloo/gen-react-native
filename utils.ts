import * as Crypto from 'expo-crypto';
import * as Linking from "expo-linking";
import ExpoLocalization from "expo-localization/src/ExpoLocalization";
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

export enum MimeTypes {
    all = '*/*',
    csr = 'application/pkcs10',
    crt = 'application/x-x509-ca-cert'
}

const DIRECTORY_KEY = 'downloads_directory_uri';

export const getUUIDv4 = () => Crypto.randomUUID();

export const getDate = () => new Date().toISOString();

export const cleanPhoneNumber = (phoneNumber: string) => String(Number(phoneNumber.replace(/[^a-zA-Z0-9]/g, '')));

export const sendWhatsapp = (phoneNumber: number, message: string) => {
    const text = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${text}`;
    Linking.openURL(url)
        .catch((e) => {
            console.error('An error occurred', e);
        });
}

export const getRegionCode = () => ExpoLocalization.getLocales()[0].regionCode || 'US';

export const getCustomerCode = (regionCode) => regionCode == 'AR' ? 'C' : '0';

export const saveSecureStore = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
}

export const getValueForSecureStore = async (key: string) =>
    await SecureStore.getItemAsync(key);

const getOrRequestDirectory = async (): Promise<string | null> => {
    // const stored = await AsyncStorage.getItem(DIRECTORY_KEY);
    // if (stored) return stored;
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) return null;
    const uri = permissions.directoryUri;
    await AsyncStorage.setItem(DIRECTORY_KEY, uri);
    return uri;
};

const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = () => {
            const base64 = reader.result?.toString().split(',')[1];
            resolve(base64 || '');
        };
        reader.readAsDataURL(blob);
    });

export const saveFile = async (blob: Blob, fileName: string, mimeType: string, directoryUri?: string | null) => {
    try {
        if (!directoryUri) directoryUri = await getOrRequestDirectory();
        const data = await blobToBase64(blob);
        if (directoryUri) {
            FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, mimeType)
                .then(async (uri) => {
                    await FileSystem.writeAsStringAsync(uri, data, {encoding: FileSystem.EncodingType.Base64});
                })
                .catch((e) => {
                    // console.error(e)
                });
        }
    } catch (error) {
        // console.error('Error', `Could not Download file ${error}`)
    }
}

export const pickDocuments = async (mimeType = MimeTypes.all, multiple = false) => {
    try {
        const result = await DocumentPicker.getDocumentAsync(
            {
                type: mimeType,
                multiple: multiple,
            }
        );
        if (!result.canceled) {
            const successResult = result as DocumentPicker.DocumentPickerSuccessResult;
            return successResult.assets;
        } else {
            console.log("Document selection cancelled.");
        }
    } catch (error) {
        console.log("Error picking documents:", error);
    }
};
