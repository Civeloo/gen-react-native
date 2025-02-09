import * as Crypto from 'expo-crypto';

export const getUUIDv4 = () => Crypto.randomUUID();

export const getDate = () =>  new Date().toISOString();