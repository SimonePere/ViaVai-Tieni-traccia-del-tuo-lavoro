"use client"
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../../redux/slices/authSlice";
import { HiExclamationCircle } from "react-icons/hi";
import Pop from "../Pop";
import { FaCheckCircle } from "react-icons/fa"; // Icona per il successo
import Link from "next/link";
import dotenv from "dotenv";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;



const LoginForm = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: any) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });
  const [showPop, setShowPop] = useState(false); // Stato per gestire la visualizzazione del Pop
  const [popMessage, setPopMessage] = useState(""); // Messaggio da passare al Pop
  const [popColor, setPopColor] = useState("green-600"); // Colore del Pop
  const [popIcon, setPopIcon] = useState(<FaCheckCircle className="h-5 w-5 text-green-600" />); // Icona del Pop

  // console.log("LOCAL_HOST:", LOCAL_HOST); // Verifica il valore


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        dispatch(loginStart());
        const url = `${LOCAL_HOST}/auth/login`;
        console.log("URL di richiesta:", url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Errore durante il login');
        }

        const data = await response.json();

        if (data.status === "ok") {
            dispatch(loginSuccess(data));
            // Mostra il Pop di successo
            setPopMessage("Login avvenuto con successo!");
            setPopIcon(<FaCheckCircle className="h-5 w-5 text-green-600" />);
            setPopColor("green-600");
            setShowPop(true);
            
            // Stampa in console le informazioni dell'utente
            console.log("Informazioni utente:", data);
            console.log("data access_token da LOGINFORM: ",data.access_token)

            // Messaggio di reindirizzamento
            setPopMessage("Accesso avvenuto con successo ❤️");

            
        } else {
            throw new Error('Login fallito');
        }
    } catch (error: any) {
        console.error('Login error:', error);
        dispatch(loginFailure(error.message));
        // Mostra il Pop di errore
        setPopMessage("Errore durante il login: " + error.message);
        setPopColor("red-600");
        setPopIcon(<HiExclamationCircle className="h-5 w-5 text-red-600" />);
        setShowPop(true);
    }
  };

  return (
    <Card className="max-w-sm">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="La tua email" />
          </div>
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="nome@esempio.com"
            required
            value={formData.email}
            onChange={handleChange}
            color={error ? "failure" : undefined}
          />
          {error && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <HiExclamationCircle className="mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="La tua password" />
          </div>
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            color={error ? "failure" : undefined}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
          />
          <Label htmlFor="remember">Ricordami</Label>
        </div>
        <Button type="submit" className="font-semibold" disabled={isLoading}>
          {isLoading ? "Accesso in corso..." : "Accedi"}
        </Button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Non hai un account? 
          <Link href="/register" className="font-semibold text-indigo-500 hover:text-indigo-700"> Registrati qui</Link>
        </p>
      </form>
      {showPop && ( // Renderizza il Pop se showPop è true
        <Pop message={popMessage} icon={popIcon} color={popColor} />
      )}
      <p><Link href="/">Torna alla Home</Link></p>
      <p><Link href="/utenti">Utenti</Link></p>
      <p><Link href="/trasporti">Trasporti</Link></p>
    </Card>
  );
}

export default LoginForm;


// Ecco fatto! Ti spiego come funziona il tutto:
// Redux Store e Slice:
// Abbiamo creato un nuovo slice authSlice.js che gestisce lo stato dell'autenticazione
// Lo stato include: user, token, isLoading e error
// Abbiamo definito le azioni: loginStart, loginSuccess, loginFailure e logout
// Il slice è stato aggiunto allo store Redux
// LoginForm:
// Il form ora è connesso a Redux usando useDispatch e useSelector
// Gestisce lo stato locale del form con useState
// Implementa la gestione degli errori e lo stato di caricamento
// Comunica con il backend tramite fetch API
// Flusso di autenticazione:
// Quando l'utente compila il form e fa submit:
// Viene chiamato loginStart() per indicare che il login è in corso
// I dati vengono inviati al backend
// Se il login ha successo, viene chiamato loginSuccess() con i dati dell'utente
// Se c'è un errore, viene chiamato loginFailure() con il messaggio di errore
// Gestione degli errori e UI:
// Il form mostra un messaggio di errore se qualcosa va storto
// Il pulsante di submit mostra uno stato di caricamento
// I campi del form diventano rossi in caso di errore
// Per utilizzare questo sistema, assicurati che il tuo backend abbia un endpoint /auth/login che:
// Accetta email e password
// Verifica le credenziali
// Restituisce un token JWT e i dati dell'utente