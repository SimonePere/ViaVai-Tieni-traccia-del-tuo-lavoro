/** @format */


// Interfaccia per il modello Trasporto
export interface TrasportoInterface {
  tipo_lavoro: "Trasloco" | "Installazione" | "Consegna";
  descrizione_lavoro: string;
  destinazione: string;
  tipo_giornata: "Giornata" | "Trasferta";
  ore_lavoro: number;
  importo: number;
  _id:string;

}

