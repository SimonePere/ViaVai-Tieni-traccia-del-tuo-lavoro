"use client";

import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { useState } from "react";
import { Utente } from "../../types/utente";
import { TrasportoInterface } from "../../types/trasporto";

interface CreateFormProps<T> {
  onSave: (data: T) => Promise<void>;
  onClose: () => void;
  type: "utente" | "trasporto";
}

const CreateForm = <T,>({ onSave, onClose, type }: CreateFormProps<T>) => {
  const [formData, setFormData] = useState<T>({} as T); // Inizializza formData come oggetto vuoto

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    await onSave(formData); // Salva i dati
    onClose(); // Chiudi il modulo
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
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cognome" value="Cognome" />
                <TextInput
                  id="cognome"
                  name="cognome"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefono" value="Telefono" />
                <TextInput
                  id="telefono"
                  name="telefono"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="citta" value="Citta" />
                <TextInput
                  id="citta"
                  name="citta"
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="password" value="Password*" />
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="conferma_password" value="Conferma Password*" />
                <TextInput
                  id="conferma_password"
                  name="conferma_password"
                  type="password"
                  onChange={handleChange}
                  required
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
                  onChange={handleChange}
                  required
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
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="destinazione" value="Destinazione" />
                <TextInput
                  id="destinazione"
                  name="destinazione"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo_giornata" value="Tipo di giornata" />
                <Select
                  id="tipo_giornata"
                  name="tipo_giornata"
                  onChange={handleChange}
                  required
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
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="importo" value="Importo*" />
                <TextInput
                  id="importo"
                  name="importo"
                  type="number"
                  onChange={handleChange}
                  required
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
