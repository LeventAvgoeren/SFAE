//istanbul ignore file 

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
}

export type ContractResource = {
    id?: Number;
    adress: string;
    description:string;
    jobType: string;
    payment: string;
    range: number;
    statusOrder: string;  
    customerId: string;
    workerId?: string;
}

export type CustomerResource = {
    id?: string;
    name: string;
    password: string;
    email: string;
    role: string; 
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