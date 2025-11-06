import {
    dateToRFC3339,
    getValueForSecureStore,
    MimeTypes,
    pickDocuments,
    saveFile,
    saveSecureStore
} from "@/utils/utils";
import * as FileSystem from "expo-file-system";
import {User} from "@firebase/auth-types";
import {Invoice, Order} from "@/types/types";

const ARCA_KEY = String(process.env.EXPO_PUBLIC_ARCA_KEY);
export const ARCA_HOMO = String(process.env.EXPO_PUBLIC_ARCA_HOMO);
const ARCA_URL = String(process.env.EXPO_PUBLIC_ARCA_API);
const ARCA_REGISTER_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_REGISTER);
const ARCA_LOGIN_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_LOGIN);
const ARCA_VALUES_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_VALUES);
const ARCA_INVOICE_LAST_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_INVOICE_LAST_URL);
const ARCA_CSR_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_CSR);
const ARCA_CSR_FILE_NAME = 'arca.csr'
const ARCA_CRT_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_CRT);
const ARCA_INVOICE_URL = ARCA_URL + String(process.env.EXPO_PUBLIC_ARCA_INVOICE);

export const arcaGetToken = (email: string) => {
    const uid = email.replace('@', '').replace('.', '');
    return getValueForSecureStore(ARCA_KEY + uid) || '';
};

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
        //console.error("arcaRegister", error)
    }
}

interface ArcaLogin {
    email: string;
    password: string;
}

export const arcaLogin = async (user: ArcaLogin) => {
    try {
        const response = await fetch(ARCA_LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify({email: user.email, password: user.password}),
            headers: new Headers({'Content-Type': 'application/json'}),
        });
        const result = await response.json()
        const uid = user.email.replace('@', '').replace('.', '');
        const token = result?.token || '';
        if (token) await saveSecureStore(ARCA_KEY + uid, token);
        return token;
    } catch (error) {
        //console.error("arcaLogin", error)
    }
}

export const arcaGetValues = async (token: string) => {
    return fetch(ARCA_VALUES_URL, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        })
    }).then(res => {
        return res.json();
    })
        .catch((error) => {
            //console.error("arcaGetValues", error)
            return;
        });
};

export const arcaGetInvoiceLast = async (token: string) => {
    return fetch(ARCA_INVOICE_LAST_URL, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        })
    }).then(res => {
        return res.json();
    })
        .catch((error) => {
            //console.error('arcaGetInvoiceLast', error);
            return;
        });
};

export const arcaGetCSR = async (token: string, tin: string, org: string, cname: string, country: string, concept: string, pos: string) => {
    return fetch(ARCA_CSR_URL, {
        method: 'POST',
        body: JSON.stringify({
            id: tin,
            org: org,
            cn: cname,
            ctry: country,
            cpt: concept,
            pvt: pos,
            homo: ARCA_HOMO
        }),
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(JSON.stringify(response));
            }
            return response.blob();
        })
        .then(async (blob) => {
            await saveFile(blob, ARCA_CSR_FILE_NAME, MimeTypes.csr);
        })
        .catch((error) => {
            //console.error("arcaGetCSR", error)
        });
}

export const arcaSendCRT = async (email: string) => {
    const token = await arcaGetToken(email);
    try {
        const assets = await pickDocuments(MimeTypes.crt);
        if (assets && assets?.length > 0) {
            const fileUri = assets[0].uri;
            await FileSystem.uploadAsync(ARCA_CRT_URL, fileUri, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                fieldName: 'file',
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART
            });
        }
    } catch (error) {
        //console.error("arcaSendCRT", error);
    }
}

export interface ArcaInvoiceProps {
    user: User,
    order: Order,
    customerTin: string,
    total: number,
}

export const arcaInvoice = async (
    {
        user,
        order,
        customerTin,
        total
    }: ArcaInvoiceProps) => {
    const usr = {
        email: String(user?.email),
        password: String(user?.uid)
    };
    const invoice: { cbteTipo?:number, cbte: string, cbteFch?: string, docNro: string, impNeto: number } = {
        cbte: order.orderCode?.slice(1),
        docNro: customerTin,
        impNeto: total
    };
    if (!!order?.orderSignature) invoice['cbteTipo'] = 13;
    let token = await arcaGetToken(usr.email);
    token = !token ? await arcaLogin(usr) : token;

    const bodyProps = {...invoice};
    const body = JSON.stringify(bodyProps);
    return fetch(ARCA_INVOICE_URL, {
        method: 'POST',
        body: body,
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        })
    }).then(res => {
        return res.json().then(json => JSON.parse(json));
    })
        .catch((error) => {
            console.error("arcaInvoice", error)
            return;
        });
}

export const getDoc = (docNro:string)=>
    (docNro && docNro !== '0') ? {nro: docNro, tipo: 96} : {nro: '23000000000', tipo: 80};

export const arcaQrValue = (invoice: Invoice) => {
    const {order, customer, company, total} = invoice;
    const orderNumber = order?.orderCode.slice(1);
    const doc = getDoc(customer?.customerTin);
    const qrValues = {
        ver: 1,
        fecha: dateToRFC3339(order?.orderDate),
        cuit: Number(company?.companyTin),
        ptoVta: Number(company?.companyPOS),
        tipoCmp: 11,
        nroCmp: Number(orderNumber),
        importe: Number(total),
        moneda: 'PES',
        ctz: 1,
        tipoDocRec: Number(doc.tipo),
        nroDocRec: Number(doc.nro),
        tipoCodAut: 'A',
        codAut: Number(order?.orderSignature)
    };
    const qrValuesJSON = JSON.stringify(qrValues);
    return `https://www.afip.gob.ar/fe/qr/?p=${btoa(qrValuesJSON)}`;
}
