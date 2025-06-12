import * as Crypto from 'expo-crypto';
import * as Linking from "expo-linking";
import ExpoLocalization from "expo-localization/src/ExpoLocalization";
import * as SecureStore from 'expo-secure-store';

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
