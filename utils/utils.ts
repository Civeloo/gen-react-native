import * as Crypto from 'expo-crypto';
import * as Linking from "expo-linking";
import ExpoLocalization from "expo-localization/src/ExpoLocalization";
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import Storage from 'expo-sqlite/kv-store';
import * as DocumentPicker from 'expo-document-picker';
import {SQLiteDatabase} from "expo-sqlite";

export enum MimeTypes {
    all = '*/*',
    csr = 'application/pkcs10',
    crt = 'application/x-x509-ca-cert',
    csv = 'text/comma-separated-values'
}

const separator = ';';

const DIRECTORY_KEY = 'downloads_directory_uri';

export const getUUIDv4 = () => Crypto.randomUUID();

export const getDate = () => new Date().toISOString();

export const cleanPhoneNumber = (phoneNumber: string) => String(Number(phoneNumber.replace(/[^a-zA-Z0-9]/g, '')));

export const sendWhatsapp = (phoneNumber: number, message: string) => {
    const text = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${text}`;
    Linking.openURL(url)
        .catch((err) => {
            console.error('An error occurred', err);
        });
};

export const getRegionCode = () => ExpoLocalization.getLocales()[0].regionCode || 'US';

export const getCustomerCode = (regionCode?: string) => regionCode === 'AR' ? 'C' : '#';

export const saveSecureStore = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
};

export const getValueForSecureStore = async (key: string) =>
    await SecureStore.getItemAsync(key) || '';

const getOrRequestDirectory = async (): Promise<string | null> => {
    const stored = Storage.getItemSync(DIRECTORY_KEY);
    if (stored) return stored;
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) return null;
    const uri = permissions.directoryUri;
    Storage.setItemSync(DIRECTORY_KEY, uri);
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
            alert("Document selection cancelled.");
        }
    } catch (err) {
        console.error("Error picking documents:", err);
    }
};

export const saveFile = async (blob: Blob, fileName: string, mimeType: string, directoryUri?: string | null) => {
    try {
        if (!directoryUri) directoryUri = await getOrRequestDirectory();
        const data = await blobToBase64(blob);
        if (directoryUri) {
            FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, mimeType)
                .then(async (uri) => {
                    await FileSystem.writeAsStringAsync(uri, data, {encoding: FileSystem.EncodingType.Base64});
                })
                .catch((err) => {
                    console.error(err)
                });
        }
    } catch (err) {
        console.error('Error', `Could not Download file ${err}`)
    }
};

export const saveTextToFile = async (content: string, fileName: string, mimeType: string) => {
    if (!content) return alert('Not content!');
    try {
        const directoryUri = await getOrRequestDirectory();
        if (!directoryUri) return;
        FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, mimeType)
            .then(async (uri) => {
                await FileSystem.writeAsStringAsync(uri, content);
                alert('File saved!');
            })
            .catch((err) => {
                console.error(err)
            });
    } catch (err) {
        console.error(`Error saving file "${fileName}":`, err);
    }
};

export const loadTextFromFile = async (mimeType: MimeTypes) => {
    try {
        const assets = await pickDocuments(mimeType);
        if (assets && assets?.length > 0) {
            const fileUri = assets[0].uri;
            return await FileSystem.readAsStringAsync(fileUri);
        }
    } catch (err) {
        console.error(err);
    }
}

export const getFieldKey = (table: string) => {
    return (table.at(-1) === 'y') ? table : table.slice(0, -1);
};

export const dataToCsv = (data: any[]) => {
    if (!(data?.length > 0) || !(Object.keys(data[0]).length > 0)) return '';
    const fields = Object.keys(data[0]).join(separator);
    const rows = data.map(e => Object.values(e).join(separator)).join('\n');
    return `${fields}\n${rows}`;
}

export const csvToDb = (db: SQLiteDatabase, table: string, csv: string) => {
    try {
        if ((csv.match(/;/g)?.length || 0) < 1)
            return alert(`USE ${separator} AS SEPARATOR`);
        const tableID = getFieldKey(table) + 'ID';
        const lines = csv.split('\n');
        const fields = lines[0].split(separator);
        const index = fields.findIndex(uid => uid === tableID);
        const fieldsStr = fields.join(',');
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(separator);
            let valueTableID = (index !== -1) ? row.at(index) : '';
            if (!valueTableID) row[index] = getUUIDv4();
            const values = '"' + row.join('","') + '"';
            let sql = `SELECT COUNT(*)
                       FROM ${table}
                       WHERE ${tableID} = "${valueTableID}";`;
            const result = db.getFirstSync(sql);
            const count = result ? Number(Object.values(result).at(0)) : 0;
            if (count > 0) {
                let valueID = '';
                const setValues = [] as string[];
                row.forEach((value, i) => {
                    if (i === index) {
                        valueID = value;
                    } else {
                        if (fields[i]) setValues.push(`${fields[i]}="${value}"`);
                    }
                });
                sql = `UPDATE ${table}
                       SET ${setValues.join(', ')}
                       WHERE ${tableID} = "${valueID}";`;
            } else {
                sql = `INSERT INTO ${table} (${fieldsStr})
                       VALUES (${values});`;
            }
            db.execSync(sql);
            alert('File imported!');
        }
    } catch (error) {
        console.error(error);
    }
}

export const getVersion = () => new Date().getTime();

export const dateToRFC3339 = (yyyymmdd: string) =>
    yyyymmdd.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
