/** @format */

"use client";
// Al momento non è corretta la creazione dell utente da questo form,
// per creare un utente è necessario passare da /register
import * as React from "react";
import { TableData } from "@/app/types/redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

type DataDialogProps = {
  type: "trasporto" | "utente";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: TableData;
  onSave: (data: TableData) => void;
};

type FormData = {
  tipo_lavoro?: string;
  tipo_giornata?: string;
  descrizione_lavoro?: string;
  destinazione?: string;
  ore_lavoro?: number;
  importo?: number;
  nome?: string;
  cognome?: string;
  email?: string;
  password?: string;
  confermaPassword?: string;
  telefono?: string;
  utente_citta?: string;
};

export function DataDialog({
  type,
  open,
  onOpenChange,
  data,
  onSave,
}: DataDialogProps) {
  const [formData, setFormData] = React.useState<FormData>(() =>
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
          password: "",
          confermaPassword: "",
          telefono: "",
          utente_citta: "",
        }
  );

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    if (data) {
      // Rimuoviamo id e _id dai dati prima di impostarli nel form
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, _id, ...formDataWithoutIds } = data;
      setFormData(formDataWithoutIds as FormData);
    } else {
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
              password: "",
              confermaPassword: "",
              telefono: "",
              utente_citta: "",
            }
      );
    }
  }, [data, open, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      onSave(formData as TableData);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ form: error.message });
      } else {
        setErrors({ form: "Si è verificato un errore sconosciuto" });
      }
    }
  };

  const handleChange = (
    field: string,
    value: string | number,
    valueType: "string" | "number" = "string"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: valueType === "number" ? Number(value) : value,
    }));
  };

  const renderTrasportoFields = () => {
    if (type !== "trasporto") return null;

    return (
      <>
        <div className="grid gap-4 py-4">
          {errors.form && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="tipo_lavoro"
              className="text-right pt-2 after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Tipo Lavoro
            </Label>
            <div className="col-span-3 space-y-2">
              <Select
                value={formData.tipo_lavoro || ""}
                onValueChange={(value) => handleChange("tipo_lavoro", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo lavoro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trasloco">Trasloco</SelectItem>
                  <SelectItem value="Installazione">Installazione</SelectItem>
                  <SelectItem value="Consegna">Consegna</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Seleziona il tipo di servizio da eseguire
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="descrizione_lavoro"
              className="text-right pt-2 after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Descrizione
            </Label>
            <div className="col-span-3 space-y-2">
              <Input
                id="descrizione_lavoro"
                value={formData.descrizione_lavoro || ""}
                onChange={(e) =>
                  handleChange("descrizione_lavoro", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Inserisci una descrizione dettagliata del lavoro
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="destinazione"
              className="text-right pt-2 after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Destinazione
            </Label>
            <div className="col-span-3 space-y-2">
              <Input
                id="destinazione"
                value={formData.destinazione || ""}
                onChange={(e) => handleChange("destinazione", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Indica l&apos;indirizzo di destinazione
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="tipo_giornata"
              className="text-right pt-2 after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Tipo Giornata
            </Label>
            <div className="col-span-3 space-y-2">
              <Select
                value={formData.tipo_giornata || ""}
                onValueChange={(value) => handleChange("tipo_giornata", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo giornata" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Giornata">Giornata</SelectItem>
                  <SelectItem value="Trasferta">Trasferta</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Seleziona se si tratta di una giornata normale o trasferta
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="ore_lavoro"
              className="text-right pt-2 after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Ore Lavoro
            </Label>
            <div className="col-span-3 space-y-2">
              <Input
                id="ore_lavoro"
                type="number"
                value={formData.ore_lavoro || ""}
                onChange={(e) =>
                  handleChange("ore_lavoro", e.target.value, "number")
                }
              />
              <p className="text-xs text-muted-foreground">
                Inserisci il numero di ore di lavoro previste
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="importo"
              className="text-right pt-2 after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Importo
            </Label>
            <div className="col-span-3 space-y-2">
              <Input
                id="importo"
                type="number"
                value={formData.importo || ""}
                onChange={(e) =>
                  handleChange("importo", e.target.value, "number")
                }
              />
              <p className="text-xs text-muted-foreground">
                Inserisci l&apos;importo totale del servizio in euro
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderUtenteFields = () => {
    if (type !== "utente") return null;

    return (
      <>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="nome"
              className="text-right after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Nome
            </Label>
            <Input
              id="nome"
              value={formData.nome || ""}
              onChange={(e) => handleChange("nome", e.target.value)}
              className="col-span-3"
              required
            />
            {errors.nome && (
              <p className="col-span-3 col-start-2 text-sm text-red-500">
                {errors.nome}
              </p>
            )}
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
            <Label
              htmlFor="email"
              className="text-right after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="col-span-3"
              required
            />
            {errors.email && (
              <p className="col-span-3 col-start-2 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="password"
              className="text-right after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Password
            </Label>
            <div className="col-span-3">
              <Input
                id="password"
                type="password"
                value={formData.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Min. 10 caratteri, deve includere: lettere maiuscole e
                minuscole, caratteri speciali (!@#$%^&*)
              </p>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="confermaPassword"
              className="text-right after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Conferma Password
            </Label>
            <Input
              id="confermaPassword"
              type="password"
              value={formData.confermaPassword || ""}
              onChange={(e) => handleChange("confermaPassword", e.target.value)}
              className="col-span-3"
              required
            />
            {errors.confermaPassword && (
              <p className="col-span-3 col-start-2 text-sm text-red-500">
                {errors.confermaPassword}
              </p>
            )}
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
        </div>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {type === "trasporto" ? "Nuovo Trasporto" : "Nuovo Utente"}
          </DialogTitle>
          <DialogDescription>
            {type === "trasporto"
              ? "Inserisci i dettagli del trasporto"
              : "Inserisci i dettagli dell&apos;utente"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {type === "trasporto"
            ? renderTrasportoFields()
            : renderUtenteFields()}
          <DialogFooter>
            <Button type="submit">
              {type === "trasporto" ? "Salva Trasporto" : "Salva Utente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
