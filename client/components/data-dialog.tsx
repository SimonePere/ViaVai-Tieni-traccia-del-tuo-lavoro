/** @format */

"use client";

import * as React from "react";
import { z } from "zod";
import { TableData } from "./easy-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schemi Zod per la validazione
const trasportoSchema = z.object({
  _id: z.string().optional(),
  id: z.number().optional(),
  tipo_lavoro: z.enum(["Trasloco", "Installazione", "Consegna"]),
  descrizione_lavoro: z.string(),
  destinazione: z.string(),
  tipo_giornata: z.enum(["Giornata", "Trasferta"]),
  ore_lavoro: z.number(),
  importo: z.number(),
});

const utenteSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  cognome: z.string(),
  email: z.string().email(),
  telefono: z.string(),
  utente_citta: z.string().optional(),
  dataRegistrazione: z.string(),
});

interface DataDialogProps {
  type: "trasporto" | "utente";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: TableData;
  onSave: (data: TableData) => void;
}

export function DataDialog({
  type,
  open,
  onOpenChange,
  data,
  onSave,
}: DataDialogProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>(
    type === "trasporto"
      ? {
          tipo_lavoro: "",
          tipo_giornata: "",
          descrizione_lavoro: "",
          destinazione: "",
          ore_lavoro: 0,
          importo: 0,
        }
      : {
          nome: "",
          cognome: "",
          email: "",
          telefono: "",
          utente_citta: "",
          dataRegistrazione: new Date().toISOString().split("T")[0],
        }
  );

  React.useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      // Reset form quando si apre per un nuovo inserimento
      setFormData(
        type === "trasporto"
          ? {
              tipo_lavoro: "",
              tipo_giornata: "",
              descrizione_lavoro: "",
              destinazione: "",
              ore_lavoro: 0,
              importo: 0,
            }
          : {
              nome: "",
              cognome: "",
              email: "",
              telefono: "",
              utente_citta: "",
              dataRegistrazione: new Date().toISOString().split("T")[0],
            }
      );
    }
  }, [data, open, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const schema = type === "trasporto" ? trasportoSchema : utenteSchema;
      const validatedData = schema.parse(formData);
      onSave(validatedData as TableData);
      onOpenChange(false);
    } catch (error) {
      console.error("Errore di validazione:", error);
    }
  };

  const handleChange = (
    field: string,
    value: string | number,
    type: "string" | "number" = "string"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: type === "number" ? Number(value) : value,
    }));
  };

  const renderTrasportoFields = () => (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tipo_lavoro" className="text-right">
            Tipo Lavoro
          </Label>
          <Select
            value={formData.tipo_lavoro}
            onValueChange={(value) => handleChange("tipo_lavoro", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Seleziona tipo lavoro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Trasloco">Trasloco</SelectItem>
              <SelectItem value="Installazione">Installazione</SelectItem>
              <SelectItem value="Consegna">Consegna</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="descrizione_lavoro" className="text-right">
            Descrizione
          </Label>
          <Input
            id="descrizione_lavoro"
            value={formData.descrizione_lavoro || ""}
            onChange={(e) => handleChange("descrizione_lavoro", e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="destinazione" className="text-right">
            Destinazione
          </Label>
          <Input
            id="destinazione"
            value={formData.destinazione || ""}
            onChange={(e) => handleChange("destinazione", e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tipo_giornata" className="text-right">
            Tipo Giornata
          </Label>
          <Select
            value={formData.tipo_giornata}
            onValueChange={(value) => handleChange("tipo_giornata", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Seleziona tipo giornata" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Giornata">Giornata</SelectItem>
              <SelectItem value="Trasferta">Trasferta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="ore_lavoro" className="text-right">
            Ore Lavoro
          </Label>
          <Input
            id="ore_lavoro"
            type="number"
            value={formData.ore_lavoro || ""}
            onChange={(e) =>
              handleChange("ore_lavoro", e.target.value, "number")
            }
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="importo" className="text-right">
            Importo
          </Label>
          <Input
            id="importo"
            type="number"
            value={formData.importo || ""}
            onChange={(e) => handleChange("importo", e.target.value, "number")}
            className="col-span-3"
          />
        </div>
      </div>
    </>
  );

  const renderUtenteFields = () => (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nome" className="text-right">
            Nome
          </Label>
          <Input
            id="nome"
            value={formData.nome || ""}
            onChange={(e) => handleChange("nome", e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cognome" className="text-right">
            Cognome
          </Label>
          <Input
            id="cognome"
            value={formData.cognome || ""}
            onChange={(e) => handleChange("cognome", e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="telefono" className="text-right">
            Telefono
          </Label>
          <Input
            id="telefono"
            value={formData.telefono || ""}
            onChange={(e) => handleChange("telefono", e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="utente_citta" className="text-right">
            Città
          </Label>
          <Input
            id="utente_citta"
            value={formData.utente_citta || ""}
            onChange={(e) => handleChange("utente_citta", e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="dataRegistrazione" className="text-right">
            Data Registrazione
          </Label>
          <Input
            id="dataRegistrazione"
            type="date"
            value={formData.dataRegistrazione || ""}
            onChange={(e) => handleChange("dataRegistrazione", e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {data ? "Modifica" : "Aggiungi"}{" "}
            {type === "trasporto" ? "Trasporto" : "Utente"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {type === "trasporto"
            ? renderTrasportoFields()
            : renderUtenteFields()}
          <DialogFooter>
            <Button type="submit">Salva</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
