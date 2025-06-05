/** @format */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../app/redux/slices/registerSlice";

import Link from "next/link";
import dotenv from "dotenv";

import { RootState } from "@/app/types/redux";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

export function RegisterForm2({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.register
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    confermaPassword: "",
    telefono: "",
    utente_citta: "",
  });

  // Controllo errori
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    setEmailError(null);
    console.log("Form Inviato");
    const newErrors: { [key: string]: string } = {};

    // Validazione
    if (!formData.nome.trim()) {
      newErrors.nome = "Il nome è obbligatorio";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email è obbligatoria";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email non valida";
    }
    if (!formData.password) {
      newErrors.password = "La password è obbligatoria";
    } else if (formData.password.length < 10) {
      newErrors.password = "La password deve contenere almeno 10 caratteri";
    }
    if (formData.password !== formData.confermaPassword) {
      newErrors.confermaPassword = "Le password non coincidono";
    }

    setErrors(newErrors);

    // Controlla se ci sono errori prima di inviare i dati
    if (Object.keys(newErrors).length === 0) {
      console.log("Form valido, dati:", formData); // Log dei dati del modulo se non ci sono errori
      console.log("Valore di utente_citta:", formData.utente_citta);
      try {
        dispatch(registerStart());
        const url = `${LOCAL_HOST}/auth/register`;
        // console.log("URL di richiesta:", url); // Log dell'URL di richiesta
        console.log("Corpo della richiesta:", {
          nome: formData.nome,
          cognome: formData.cognome,
          email: formData.email,
          password: formData.password,
          confermaPassword: formData.confermaPassword,
          telefono: formData.telefono,
          citta: formData.utente_citta, // Assicurati che questo campo sia corretto
        });
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: formData.nome,
            cognome: formData.cognome,
            email: formData.email,
            password: formData.password,
            confermaPassword: formData.confermaPassword,
            telefono: formData.telefono,
            citta: formData.utente_citta,
          }),
        });

        console.log("Response status:", response.status); // Log dello stato della risposta
        if (!response.ok) {
          const errorData = await response.json();
          // Gestione specifica per l'errore di email duplicata
          if (
            errorData.message?.includes("E11000") ||
            errorData.message?.includes("duplicate key")
          ) {
            setEmailError(
              "Questa email è già registrata nel sistema. Prova ad accedere o usa un'altra email."
            );
            throw new Error("Email già registrata");
          }
          throw new Error(
            errorData.message || "Errore durante la registrazione"
          );
        }

        const data = await response.json();

        if (data.message === "Utente creato con successo") {
          dispatch(registerSuccess(data));
          setIsSuccess(true);
          console.log("Utente creato correttamente: ", data);
        } else {
          throw new Error("Registrazione fallita");
        }
      } catch (error: unknown) {
        console.error("Register error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Registrazione fallita (RegisterFailure)";
        dispatch(registerFailure(errorMessage));
      }
    }
  };
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold">Registrati</h2>
        <p className="text-balance text-sm text-muted-foreground">
          Inserisci i dati richiesti per completare la registrazione
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="nome"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Nome
              </Label>
            </div>
            <Input
              id="nome"
              name="nome"
              type="text"
              placeholder="Nome"
              required
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="nome">Cognome</Label>
            </div>
            <Input
              id="cognome"
              type="text"
              name="cognome"
              placeholder="Cognome"
              value={formData.cognome}
              onChange={(e) =>
                setFormData({ ...formData, cognome: e.target.value })
              }
            />
          </div>
        </div>

        {/* Email Telefono e Password */}
        <div className="grid md:grid-cols-1 gap-4">
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="email"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Email
              </Label>
            </div>
            <Input
              id="email"
              type="email"
              placeholder="latua@email.it"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="telefono">Telefono</Label>
            </div>
            <Input
              id="telefono"
              type="number"
              placeholder="+ 39"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-4">
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Password
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Min. 10 caratteri, deve includere: lettere maiuscole e
                minuscole, caratteri speciali (!@#$%^&*)
              </p>
            </div>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              color={errors.password ? "failure" : undefined}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="confermaPassword"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Conferma password
              </Label>
            </div>
            <Input
              id="confermaPassword"
              type="password"
              value={formData.confermaPassword}
              onChange={(e) =>
                setFormData({ ...formData, confermaPassword: e.target.value })
              }
              color={errors.confermaPassword ? "failure" : undefined}
              required
            />
          </div>
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

        {error && !emailError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Registrazione completata con successo!
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className={cn(
            "font-semibold",
            isSuccess && "bg-green-600 hover:bg-green-700"
          )}
          disabled={isLoading}
        >
          {isLoading
            ? "Registrazione in corso..."
            : isSuccess
            ? "Registrazione completata"
            : "Registrati"}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Oppure continua con
          </span>
        </div>
      </div>
      <div className="text-center text-sm">
        Hai già un account?{" "}
        <Link href="/login-user" className="underline underline-offset-4">
          Accedi
        </Link>
      </div>
    </form>
  );
}
