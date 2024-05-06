//istanbul ignore file 

export type LoginResource = {
    id: number;
    role: 'customer' | 'worker' | 'admin'; 
    exp: number;  
}

export type WorkerResource = {
    id?: string;
    name: string;
    location: string;
    status: boolean;
    statusOrder: boolean;
    distanceRange: number;  
    jobType: JobType;
    minPayment: PaymentResource;
    rating: number;  
    verification: boolean;
    email: string;
}

export type CustomerResource = {
    name: string;
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