/** @format */

"use client";
// Al momento non è corretta la creazione dell utente da questo form,
// per creare un utente è necessario passare da /register
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

const utenteSchema = z
  .object({
    id: z.number().optional(),
    nome: z.string().min(1, "Il nome è obbligatorio"),
    cognome: z.string(),
    email: z.string().email("Email non valida"),
    password: z
      .string()
      .min(10, "La password deve contenere almeno 10 caratteri"),
    confermaPassword: z.string(),
    telefono: z.string(),
    utente_citta: z.string().optional(),
  })
  .refine((data) => data.password === data.confermaPassword, {
    message: "Le password non coincidono",
    path: ["confermaPassword"],
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
  const [formData, setFormData] = React.useState<Record<string, any>>(() =>
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
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

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
              password: "",
              confermaPassword: "",
              telefono: "",
              utente_citta: "",
            }
      );
    }
  }, [data, open, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    setEmailError(null);
    setErrors({});

    // Controllo campi obbligatori per il form di trasporto
    if (type === "trasporto") {
      const requiredFields = [
        "tipo_lavoro",
        "descrizione_lavoro",
        "destinazione",
        "tipo_giornata",
        "ore_lavoro",
        "importo",
      ];

      const emptyFields = requiredFields.filter(
        (field) => !formData[field] || formData[field] === ""
      );

      if (emptyFields.length > 0) {
        setErrors({
          form: "Per favore, compila tutti i campi obbligatori",
        });
        return;
      }
    }

    try {
      const schema = type === "trasporto" ? trasportoSchema : utenteSchema;
      const validatedData = schema.parse(formData);
      onSave(validatedData as TableData);
      setIsSuccess(true);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Errore di validazione:", error);
      if (error.errors) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err: any) => {
          if (err.path[0] === "confermaPassword") {
            newErrors.confermaPassword = "Le password non coincidono";
          } else {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
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
              value={formData.tipo_lavoro}
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
              Indica l'indirizzo di destinazione
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
              value={formData.tipo_giornata}
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
              Inserisci l'importo totale del servizio in euro
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const renderUtenteFields = () => (
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
              Min. 10 caratteri, deve includere: lettere maiuscole e minuscole,
              caratteri speciali (!@#$%^&*)
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

        {emailError && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">
              {emailError}
            </AlertDescription>
          </Alert>
        )}

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {Object.values(errors).map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Operazione completata con successo!
            </AlertDescription>
          </Alert>
        )}
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
            <Button
              type="submit"
              className={cn(
                "font-semibold",
                isSuccess && "bg-green-600 hover:bg-green-700"
              )}
            >
              {isSuccess ? "Operazione completata" : "Salva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
