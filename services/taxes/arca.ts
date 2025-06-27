import {getValueForSecureStore, MimeTypes, pickDocuments, saveFile, saveSecureStore} from "@/utils";
import * as FileSystem from "expo-file-system";

const ARCA_KEY = String(process.env.EXPO_PUBLIC_ARCA_KEY);
const ARCA_URL = String(process.env.EXPO_PUBLIC_ARCA_API);
const ARCA_REGISTER_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_REGISTER);
const ARCA_LOGIN_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_LOGIN);
const ARCA_CSR_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_CSR);
const ARCA_CSR_FILE_NAME = 'arca.csr'
const ARCA_CRT_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_CRT);

export const arcaGetToken = async () => await getValueForSecureStore(ARCA_KEY);

export const arcaRegister = async (email: string, password: string) => {
    try {
        await fetch(ARCA_REGISTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, password: password}),
        });
    } catch (error) {
        // console.error("arcaRegister", error)
    }
}

export const arcaLogin = async (email: string, password: string) => {
    try {
        const response = await fetch(ARCA_LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify({email: email, password: password}),
            headers: new Headers({'Content-Type': 'application/json'}),
        });
        const result: any = await response.json()
        result?.token && await saveSecureStore(ARCA_KEY, result.token);
    } catch (error) {
        // console.error("arcaLogin", error)
    }
}

export const arcaGetCSR = async (email: string, password: string, tin: string, org: string, cname: string, country: string) => {
    !(await arcaGetToken()) && await arcaLogin(email, password);
    fetch(ARCA_CSR_URL, {
        method: 'POST',
        body: JSON.stringify({email: email, id: tin, password: password, org: org, cn: cname, ctry: country}),
        headers: new Headers({
            'Authorization': 'Bearer ' + await arcaGetToken(),
            'Content-Type': 'application/json'
        })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('...');
            }
            return response.blob();
        })
        .then(async (blob) => {
            await saveFile(blob, ARCA_CSR_FILE_NAME, MimeTypes.csr);
        })
        .catch((error) => {
            console.error("arcaGetCSR", error)
        });
}

export const arcaSendCRT = async (email: string) => {
    try {
        const assets = await pickDocuments(MimeTypes.crt);
        if (assets && assets?.length > 0) {
            const fileUri = assets[0].uri;
            await FileSystem.uploadAsync(ARCA_CRT_URL, fileUri, {
                headers: {
                    'Authorization': 'Bearer ' + await arcaGetToken(),
                },
                fieldName: 'file',
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                parameters: {
                    email: email
                },
            });
        }
    } catch (error) {
        // console.log("arcaSendCRT", error);
    }
}
