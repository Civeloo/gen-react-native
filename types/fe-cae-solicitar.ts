import { Errors } from "./errors";
import { Events } from "./events";

type FeCabResp = {
    Cuit: number;
    PtoVta: number;
    CbteTipo: number;
    FchProceso: number;
    CantReg: number;
    Resultado: string;
    Reproceso: string;
}

type FECAEDetResponse = {
    Concepto: number;
    DocTipo: number;
    DocNro: number;
    CbteDesde: number;
    CbteHasta: number;
    CbteFch: number;
    Resultado: string;
    CAE: string;
    CAEFchVto: string;
}

type FEDetResp = {
    FECAEDetResponse: FECAEDetResponse;
}

export type FECAESolicitarResult = {
    FeCabResp: FeCabResp;
    FeDetResp: FEDetResp;
    Events: Events;
    Errors: Errors;
}

export type FECAESolicitarResponse = {
    FECAESolicitarResult: FECAESolicitarResult;
}