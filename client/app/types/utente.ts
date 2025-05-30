// types/utente.ts


  
  export interface Utente {
    _id?: string;
    nome: string;
    cognome: string;
    email: string;
    telefono?: string;
    utente_citta: string,
    dataRegistrazione: Date;
    immagineProfilo?:string
    
    // Altri campi che potrebbero essere necessari
  }
  