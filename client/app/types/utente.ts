// types/utente.ts


  
  export interface Utente {
    _id?: string;
    nome: string;
    cognome: string;
    email: string;
    telefono?: string;
    indirizzo_via?: string;
    indirizzo_citta?: string;
    indirizzo_cap?: string;
    indirizzo_provincia?: string;
    dataRegistrazione: Date;
    immagineProfilo?:string
    
    // Altri campi che potrebbero essere necessari
  }
  