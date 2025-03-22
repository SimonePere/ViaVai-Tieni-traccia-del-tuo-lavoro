"use client";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../../redux/slices/registerSlice";
import { HiExclamationCircle } from "react-icons/hi";
import Pop from "../Pop";
import { FaCheckCircle } from "react-icons/fa"; // Icona per il successo
import Link from "next/link";
import dotenv from "dotenv";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: any) => state.register);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    confermaPassword: "",
    telefono: "",
    utente_citta:"",
  });
  const [showPop, setShowPop] = useState(false); // Stato per gestire la visualizzazione del Pop
  const [popMessage, setPopMessage] = useState(""); // Messaggio da passare al Pop
  const [popColor, setPopColor] = useState("green-600"); // Colore del Pop
  const [popIcon, setPopIcon] = useState(
    <FaCheckCircle className="h-5 w-5 text-green-600" />
  ); // Icona del Pop

  // Controllo errori
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Inviato"); // Log quando il modulo viene inviato
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
          console.error("Error data:", errorData); // Log dei dati di errore
          throw new Error(
            errorData.message || "Errore durante la registrazione"
          );
        }

        const data = await response.json();

        if (data.message === "Utente creato con successo") {
          dispatch(registerSuccess(data));
          // Mostra il Pop di successo
          setPopMessage("Registrazione avvenuta con successo!");
          setPopIcon(<FaCheckCircle className="h-5 w-5 text-green-600" />);
          setPopColor("green-600");
          setShowPop(true);

          // Stampa in console le informazioni dell'utente
          console.log("Utente creato correttamente: ", data);
        } else {
          throw new Error("Registrazione fallita");
        }
      } catch (error: any) {
        console.error("Register error:", error); // Log dell'errore di registrazione
        dispatch(registerFailure(error.message));
        // Mostra il Pop di errore
        setPopMessage("Errore durante la registrazione: " + error.message);
        setPopColor("red-600");
        setPopIcon(<HiExclamationCircle className="h-5 w-5 text-red-600" />);
        setShowPop(true);
      }
    } else {
      console.log("Form non valido, errori presenti."); // Log se ci sono errori nel modulo
    }
  };

  return (
    <Card className="max-w-2xl  mx-auto">
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Dati personali */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="nome"
                value="Nome"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              />
            </div>
            <TextInput
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              color={errors.nome ? "failure" : undefined}
              helperText={errors.nome}
              icon={errors.nome ? HiExclamationCircle : undefined}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="cognome" value="Cognome" />
            </div>
            <TextInput
              id="cognome"
              type="text"
              value={formData.cognome}
              onChange={(e) =>
                setFormData({ ...formData, cognome: e.target.value })
              }
            />
          </div>
        </div>

        {/* Email e Password */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="email"
                value="Email"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              />
            </div>
            <TextInput
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              color={errors.email ? "failure" : undefined}
              helperText={errors.email}
              icon={errors.email ? HiExclamationCircle : undefined}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="telefono" value="Telefono" />
            </div>
            <TextInput
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password"
                value="Password"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              />
            </div>
            <TextInput
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              color={errors.password ? "failure" : undefined}
              helperText={errors.password}
              icon={errors.password ? HiExclamationCircle : undefined}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="confermaPassword"
                value="Conferma Password"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              />
            </div>
            <TextInput
              id="confermaPassword"
              type="password"
              value={formData.confermaPassword}
              onChange={(e) =>
                setFormData({ ...formData, confermaPassword: e.target.value })
              }
              color={errors.confermaPassword ? "failure" : undefined}
              helperText={errors.confermaPassword}
              icon={errors.confermaPassword ? HiExclamationCircle : undefined}
              required
            />
          </div>
        </div>


       
        {/* Indirizzo */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Indirizzo
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="citta" value="Città" />
              </div>
              <TextInput
                id="citta"
                type="text"
                value={formData.utente_citta}
                onChange={(e) =>
                  setFormData({ ...formData, utente_citta: e.target.value })
                }
              />
            </div>
            
            
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Registrazione in corso" : "Registrati"}
        </Button>
      </form>
      {showPop && (
        // Renderizza il Pop se showPop è true
        <Pop message={popMessage} icon={popIcon} color={popColor} />
      )}
      <p>
        <Link href="/">Torna alla Home</Link>
      </p>
    </Card>
  );
};

export default RegisterForm;
