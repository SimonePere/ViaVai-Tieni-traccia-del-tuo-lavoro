"use client";

import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import { Utente } from "../../types/utente";
import { TrasportoInterface } from "../../types/trasporto";

interface EditFormProps<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  onClose: () => void;
  type: "utente" | "trasporto";
}

const EditForm = <T,>({ data, onSave, onClose, type }: EditFormProps<T>) => {
  console.log("Dati ricevuti in EditForm:", data);
  const [openModal, setOpenModal] = useState(true);
  const [formData, setFormData] = useState<T>(data);

  useEffect(() => {
    console.log("Dati ricevuti nel form di modifica:", data);
    setFormData(data);
  }, [data]);

  function handleCloseModal() {
    setOpenModal(false);
    onClose();
  }

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
    const updatedData = { ...formData, _id: (formData as TrasportoInterface)._id }; // Usa l'asserzione di tipo
    await onSave(updatedData);
    handleCloseModal();
  }

  return (
    <Modal show={openModal} size="md" onClose={handleCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Modifica {type === "utente" ? "Utente" : "Trasporto"}
          </h3>
          {type === "utente" && (
            <>
              <div>
                <Label htmlFor="nome" value="Nome" />
                <TextInput
                  id="nome"
                  name="nome"
                  value={(formData as Utente).nome || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cognome" value="Cognome" />
                <TextInput
                  id="cognome"
                  name="cognome"
                  value={(formData as Utente).cognome || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  name="email"
                  value={(formData as Utente).email || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefono" value="Telefono" />
                <TextInput
                  id="telefono"
                  name="telefono"
                  value={(formData as Utente).telefono || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="indirizzo" value="Indirizzo" />
                <TextInput
                  id="indirizzo"
                  name="indirizzo"
                  value={(formData as Utente).utente_citta || ""}
                  onChange={handleChange}
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
                  value={(formData as TrasportoInterface).tipo_lavoro || ""}
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
                  value={
                    (formData as TrasportoInterface).descrizione_lavoro || ""
                  }
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="destinazione" value="Destinazione" />
                <TextInput
                  id="destinazione"
                  name="destinazione"
                  value={(formData as TrasportoInterface).destinazione || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo_giornata" value="Tipo di giornata" />
                <Select
                  id="tipo_giornata"
                  name="tipo_giornata"
                  value={(formData as TrasportoInterface).tipo_giornata || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleziona un tipo di lavoro</option>
                  <option value="Giornata">Giornata</option>
                  <option value="Trasferta">Trasferta</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="ore_lavoro" value="Ore lavoro" />
                <TextInput
                  id="ore_lavoro"
                  name="ore_lavoro"
                  type="number"
                  value={(formData as TrasportoInterface).ore_lavoro || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="importo" value="Importo" />
                <TextInput
                  id="importo"
                  name="importo"
                  type="number"
                  value={(formData as TrasportoInterface).importo || ""}
                  onChange={handleChange}
                  required
                />
              </div>

            </>
          )}
          <div className="w-full">
            <Button onClick={handleSubmit}>Salva modifiche</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditForm;
