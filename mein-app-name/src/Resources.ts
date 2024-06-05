//istanbul ignore file 

import { StringKeyframeTrack } from "three";

export type LoginResource = {
    id: string;
    role: 'customer' | 'worker' | 'admin'; 
    exp: number;
}

export type WorkerResource = {
    id?: string;
    name: string;
    password:string;
    location: string;
    status: string;
    statusOrder: string;
    range: Number;
    jobType: string;
    minPayment: Number;
    rating: Number;
    verification: Boolean;
    email: string;
    latitude: number;
    longitude: number;
    profileBase64:string;
    slogan: string;

}
export type WorkerResourceProfil = {
    id?: string;
    name: string;
    password:string;
    location: string;
    email: string;
    latitude: number;
    longitude: number;
    profileBase64:string;
    slogan: string;
}
export interface Position {
    latitude: number;
    longitude: number;
}
  
export type ContractResource = {
    id?: number;
    adress?: string;
    description?:string;
    jobType?: string;
    payment?: string;
    range?: number;
    statusOrder?: string;  
    customer?: CustomerResource;
    worker?: WorkerResource;
    longitude?: number;
    latitude?: number;
    maxPayment?: number;
}


export type ContractResourceforWorker = {
    id?: number;
    adress: string;
    description:string;
    jobType: string;
    payment: string;
    range: number;
    statusOrder: string;  
    customer: CustomerResource;
    worker?: WorkerResource;
    longitude: number;
    latitude: number;
    maxPayment: number;
}


export type CustomerResource = {
    id?: string;
    name: string;
    password: string;
    email: string;
    role: string; 
    profileBase64:string;

}

export enum JobType {
    Hausmeister, Haushälter, Gärtner, Kindermädchen, Koch, 
    Putzkraft, Handwerker, Elektriker, Installateur, Klempner,
    Maler, Schädlingsbekämpfer, Tierpfleger, Hausbetreuer, Gassigeher,
    Wäscher, Einkäufer, Caterer, PersonalTrainer, Ernährungsberater,
    Musiklehrer, Babysitter, Hauslehrer, Chauffeur, Reinigungskraft,
    Schneider, Organisator, Tischler, Möbelträger, Hundetrainer,
    Kammerjäger, Fensterputzer, Kammerzofen, Hausdoktor, Blumenpfleger,
    Renovierer, Fensterreiniger, Gartenarbeiter, Bügeler, Bodenleger,
    Hundepfleger, Autobesorger
}

export type PaymentResource = {
    amount: number;
    currency: string;
    method: string;
    status: string; 
}

export type TokenRessource = {
    id: number;
    toke: string;
    receiver: string;
}


export type RatingRessource = {
    id: String;
    rating: number;
}

export type WorkerStatus = {
    AVAILABLE: string,
    INAVAILABLE : string,
    TERMINATED: string
}

  export type ConractStatus = {
    ACCEPTED: string,
    DECLINED:string,
    PAID :string,
    FINISHED:string,
    UNDEFINED:string
  }