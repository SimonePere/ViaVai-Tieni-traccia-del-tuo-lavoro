"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
} from "flowbite-react";
import { useState, useEffect } from "react";
import EditForm from "./EditForm";
import Pop from "./Pop";
import { HiCheck, HiX, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { TrasportoInterface } from "../../types/trasporto";
import { Utente } from "../../types/utente";
import {
  createTrasporto,
  isTrasporto,
  updateTrasporto,
} from "@/app/hooks/services/trasportiServices";

// Definizione del tipo generico per supportare sia TrasportoInterface che Utente
type DataType = TrasportoInterface | Utente;

interface GridListProps<T extends DataType> {
  dataList: T[];
  fetchData: () => Promise<void>;
  onSave: (data: T) => Promise<void>;
  onDelete: (data: T) => Promise<void>;
}

const GridList = <T extends DataType>({
  dataList,
  fetchData,
  onSave,
  onDelete,
}: GridListProps<T>) => {
  const dispatch = useDispatch();
  const { access_token } = useSelector((state: any) => state.auth);

  const [editFormState, setEditFormState] = useState<T | null>(null);
  const [formType, setFormType] = useState<"utente" | "trasporto">("trasporto");
  const [showPop, setShowPop] = useState(false);
  const [popConfig, setPopConfig] = useState({
    message: "",
    icon: <></>,
    color: "",
  });

  useEffect(() => {
    if (access_token) {
      fetchData();
    }
  }, [access_token]);

  const handleEditClick = (data: T, type: "trasporto" | "utente") => {
    setEditFormState(data);
    setFormType(type);
  };

  const handleClose = () => {
    setEditFormState(null);
  };

  const handleSave = async (updatedData: T) => {
    try {
      if (isTrasporto(updatedData)) {
        // Se l'oggetto è di tipo TrasportoInterface, chiama la funzione di aggiornamento
        await updateTrasporto(updatedData._id, updatedData, access_token);
      } else {
        // Altrimenti, chiama la funzione di creazione
        await createTrasporto(
          updatedData as unknown as TrasportoInterface,
          access_token
        );
      }
      fetchData(); // Ricarica i dati
      setPopConfig({
        message: "Salvato con successo!",
        icon: <HiCheck className="h-5 w-5 text-green-500" />,
        color: "green-500",
      });
      setShowPop(true);
      setTimeout(() => setShowPop(false), 3000);
    } catch (errore) {
      console.error("Errore durante il salvataggio:", errore);
      setPopConfig({
        message: "Errore nel salvataggio",
        icon: <HiX className="h-5 w-5 text-red-500" />,
        color: "red-500",
      });
      setShowPop(true);
      setTimeout(() => setShowPop(false), 3000);
    }
  };

  const handleDeleteClick = async (data: T) => {
    try {
      if (isTrasporto(data)) {
        // Se l'oggetto è di tipo TrasportoInterface, chiama la funzione di eliminazione
        await onDelete(data);
      } else {
        console.error(
          "Tentativo di eliminare un utente, operazione non supportata."
        );
        // Gestisci il caso in cui non vuoi eliminare un utente
      }
      fetchData();
      setPopConfig({
        message: "Eliminato con successo!",
        icon: <HiCheck className="h-5 w-5 text-green-500" />,
        color: "green-500",
      });
      setShowPop(true);
      setTimeout(() => setShowPop(false), 3000);
    } catch (errore) {
      console.error("Errore durante l'eliminazione:", errore);
      setPopConfig({
        message: "Errore nell'eliminazione",
        icon: <HiX className="h-5 w-5 text-red-500" />,
        color: "red-500",
      });
      setShowPop(true);
      setTimeout(() => setShowPop(false), 3000);
    }
  };

  return (
    <div className="relative overflow-x-auto">
      {showPop && (
        <Pop
          message={popConfig.message}
          icon={popConfig.icon}
          color={popConfig.color}
        />
      )}
      <Table hoverable>
        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Riepilogo Trasporti
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            {/* Changed description to be dynamic */}
            {access_token
              ? dataList.length > 0
                ? "Di seguito trovi l'elenco dei trasporti registrati."
                : "Nessun trasporto registrato o trovato per il tuo account."
              : "Effettua il login per visualizzare lo storico dei trasporti."}
          </p>
        </caption>
        <TableHead>
          <TableHeadCell className="w-24 md:w-auto">Tipo</TableHeadCell>
          <TableHeadCell className="w-32 md:w-auto">Descrizione</TableHeadCell>
          <TableHeadCell className="w-32 md:w-auto">Destinazione</TableHeadCell>
          <TableHeadCell className="hidden md:table-cell">
            Giornata
          </TableHeadCell>
          <TableHeadCell className="hidden md:table-cell">
            Ore di Lavoro
          </TableHeadCell>
          <TableHeadCell className="hidden md:table-cell">
            Importo
          </TableHeadCell>
          <TableHeadCell>
            {/* <span className="sr-only">Modifica</span> */}
          </TableHeadCell>
          <TableHeadCell>
            {/* <span className="sr-only">Elimina</span> */}
          </TableHeadCell>
        </TableHead>
        <TableBody>
          {dataList.length > 0 ? (
            dataList.map((data: T, index: number) => (
              <TableRow
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                {isTrasporto(data) ? (
                  <>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {/* Mostra il testo completo su schermi md e superiori */}
                      <span className="hidden md:block">
                        {data.tipo_lavoro}
                      </span>
                      {/* Mostra solo l'iniziale su schermi più piccoli */}

                      <span className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-lg">
                        {data.tipo_lavoro.charAt(0)}
                      </span>
                    </TableCell>
                    <TableCell>{data.descrizione_lavoro}</TableCell>
                    <TableCell>{data.destinazione}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {data.tipo_giornata}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {data.ore_lavoro}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {data.importo} €
                    </TableCell>
                  </>
                ) : (
                  <TableCell colSpan={6} className="text-center">
                    Dati non disponibili per questo utente
                  </TableCell>
                )}
                <TableCell>
                  <div onClick={() => handleEditClick(data, "trasporto")}>
                    <HiPencil className="h-5 w-5 cursor-pointer" />
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    onClick={() => handleDeleteClick(data)}
                    className="text-red-500"
                  >
                    <HiTrash className="h-5 w-5 cursor-pointer" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Nessun dato disponibile
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {editFormState && (
        <EditForm
          data={editFormState}
          onSave={handleSave}
          onClose={handleClose}
          type={formType}
        />
      )}
    </div>
  );
};

export default GridList;
