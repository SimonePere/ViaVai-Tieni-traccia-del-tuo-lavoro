"use client";

import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { useState } from "react";
import { Utente } from "../../types/utente";
import { TrasportoInterface } from "../../types/trasporto";
import { HiExclamationCircle } from "react-icons/hi";

interface CreateFormProps<T> {
  onSave: (data: T) => Promise<void>;
  onClose: () => void;
  type: "utente" | "trasporto";
}

// Estendo l'interfaccia Utente per la creazione
interface UtenteCreate extends Utente {
  password?: string;
  conferma_password?: string;
}

const CreateForm = <T,>({ onSave, onClose, type }: CreateFormProps<T>) => {
  // Stato specifico per utente
  const [utenteData, setUtenteData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    citta: "",
    password: "",
    conferma_password: "",
  });

  // Stato specifico per trasporto
  const [trasportoData, setTrasportoData] = useState({
    tipo_lavoro: "",
    descrizione_lavoro: "",
    destinazione: "",
    tipo_giornata: "",
    ore_lavoro: 0,
    importo: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    
    if (type === "utente") {
      setUtenteData({
        ...utenteData,
        [name]: value,
      });
    } else {
      setTrasportoData({
        ...trasportoData,
        [name]: name === "ore_lavoro" || name === "importo" 
          ? parseFloat(value) || 0 
          : value,
      });
    }
  }

  async function handleSubmit() {
    const newErrors: { [key: string]: string } = {};
    
    if (type === "utente") {
      // Validazione utente
      if (!utenteData.nome.trim()) {
        newErrors.nome = "Il nome è obbligatorio";
      }
      
      if (!utenteData.email.trim()) {
        newErrors.email = "L'email è obbligatoria";
      } else if (!/\S+@\S+\.\S+/.test(utenteData.email)) {
        newErrors.email = "Email non valida";
      }
      
      if (!utenteData.password) {
        newErrors.password = "La password è obbligatoria";
      } else if (utenteData.password.length < 10) {
        newErrors.password = "La password deve contenere almeno 10 caratteri";
      }
      
      if (utenteData.password !== utenteData.conferma_password) {
        newErrors.conferma_password = "Le password non coincidono";
      }
    } else if (type === "trasporto") {
      // Validazione trasporto
      if (!trasportoData.tipo_lavoro) {
        newErrors.tipo_lavoro = "Il tipo di lavoro è obbligatorio";
      }
      
      if (!trasportoData.descrizione_lavoro.trim()) {
        newErrors.descrizione_lavoro = "La descrizione è obbligatoria";
      }
      
      if (!trasportoData.destinazione.trim()) {
        newErrors.destinazione = "La destinazione è obbligatoria";
      }
      
      if (!trasportoData.tipo_giornata) {
        newErrors.tipo_giornata = "Il tipo di giornata è obbligatorio";
      }
      
      if (!trasportoData.ore_lavoro || trasportoData.ore_lavoro <= 0) {
        newErrors.ore_lavoro = "Inserire un numero valido di ore";
      }
      
      if (!trasportoData.importo || trasportoData.importo <= 0) {
        newErrors.importo = "Inserire un importo valido";
      }
    }
    
    setErrors(newErrors);
    
    // Procedi solo se non ci sono errori
    if (Object.keys(newErrors).length === 0) {
      if (type === "utente") {
        await onSave(utenteData as unknown as T);
      } else {
        await onSave(trasportoData as unknown as T);
      }
      onClose();
    }
  }

  return (
    <Modal show={true} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Crea {type === "utente" ? "Utente" : "Trasporto"}
          </h3>
          {type === "utente" && (
            <>
              <div>
                <Label htmlFor="nome" value="Nome" />
                <TextInput
                  id="nome"
                  name="nome"
                  value={utenteData.nome}
                  onChange={handleChange}
                  required
                  color={errors.nome ? "failure" : undefined}
                  helperText={errors.nome}
                  icon={errors.nome ? HiExclamationCircle : undefined}
                />
              </div>
              <div>
                <Label htmlFor="cognome" value="Cognome" />
                <TextInput
                  id="cognome"
                  name="cognome"
                  value={utenteData.cognome}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  name="email"
                  value={utenteData.email}
                  onChange={handleChange}
                  required
                  color={errors.email ? "failure" : undefined}
                  helperText={errors.email}
                  icon={errors.email ? HiExclamationCircle : undefined}
                />
              </div>
              <div>
                <Label htmlFor="telefono" value="Telefono" />
                <TextInput
                  id="telefono"
                  name="telefono"
                  value={utenteData.telefono}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="citta" value="Citta" />
                <TextInput
                  id="citta"
                  name="citta"
                  value={utenteData.citta}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="password" value="Password*" />
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  value={utenteData.password}
                  onChange={handleChange}
                  required
                  color={errors.password ? "failure" : undefined}
                  helperText={errors.password}
                  icon={errors.password ? HiExclamationCircle : undefined}
                />
              </div>
              <div>
                <Label htmlFor="conferma_password" value="Conferma Password*" />
                <TextInput
                  id="conferma_password"
                  name="conferma_password"
                  type="password"
                  value={utenteData.conferma_password}
                  onChange={handleChange}
                  required
                  color={errors.conferma_password ? "failure" : undefined}
                  helperText={errors.conferma_password}
                  icon={errors.conferma_password ? HiExclamationCircle : undefined}
                />
              </div>
            </>
          )}
          {type === "trasporto" && (
            <>
              <div>
                <Label htmlFor="tipo_lavoro" value="Tipo di lavoro" />
                <Select
                  id="tipo_lavoro"
                  name="tipo_lavoro"
                  value={trasportoData.tipo_lavoro}
                  onChange={handleChange}
                  required
                  color={errors.tipo_lavoro ? "failure" : undefined}
                  helperText={errors.tipo_lavoro}
                >
                  <option value="">Seleziona un tipo di lavoro</option>
                  <option value="Trasloco">Trasloco</option>
                  <option value="Installazione">Installazione</option>
                  <option value="Consegna">Consegna</option>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="descrizione_lavoro"
                  value="Descrizione lavoro"
                />
                <TextInput
                  id="descrizione_lavoro"
                  name="descrizione_lavoro"
                  value={trasportoData.descrizione_lavoro}
                  onChange={handleChange}
                  required
                  color={errors.descrizione_lavoro ? "failure" : undefined}
                  helperText={errors.descrizione_lavoro}
                  icon={errors.descrizione_lavoro ? HiExclamationCircle : undefined}
                />
              </div>

              <div>
                <Label htmlFor="destinazione" value="Destinazione" />
                <TextInput
                  id="destinazione"
                  name="destinazione"
                  value={trasportoData.destinazione}
                  onChange={handleChange}
                  required
                  color={errors.destinazione ? "failure" : undefined}
                  helperText={errors.destinazione}
                  icon={errors.destinazione ? HiExclamationCircle : undefined}
                />
              </div>

              <div>
                <Label htmlFor="tipo_giornata" value="Tipo di giornata" />
                <Select
                  id="tipo_giornata"
                  name="tipo_giornata"
                  value={trasportoData.tipo_giornata}
                  onChange={handleChange}
                  required
                  color={errors.tipo_giornata ? "failure" : undefined}
                  helperText={errors.tipo_giornata}
                >
                  <option value="">Seleziona un tipo di lavoro</option>
                  <option value="Giornata">Giornata</option>
                  <option value="Trasferta">Trasferta</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="ore_lavoro" value="Ore lavoro*" />
                <TextInput
                  id="ore_lavoro"
                  name="ore_lavoro"
                  type="number"
                  value={trasportoData.ore_lavoro || ""}
                  onChange={handleChange}
                  required
                  color={errors.ore_lavoro ? "failure" : undefined}
                  helperText={errors.ore_lavoro}
                  icon={errors.ore_lavoro ? HiExclamationCircle : undefined}
                />
              </div>
              <div>
                <Label htmlFor="importo" value="Importo*" />
                <TextInput
                  id="importo"
                  name="importo"
                  type="number"
                  value={trasportoData.importo || ""}
                  onChange={handleChange}
                  required
                  color={errors.importo ? "failure" : undefined}
                  helperText={errors.importo}
                  icon={errors.importo ? HiExclamationCircle : undefined}
                />
              </div>
            </>
          )}
          <div className="w-full">
            <Button onClick={handleSubmit}>Crea</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateForm;
