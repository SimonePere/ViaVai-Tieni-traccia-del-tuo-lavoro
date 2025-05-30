/** @format */

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
import {
  HiCheck,
  HiX,
  HiPlus,
  HiPencil,
  HiTrash,
  HiTruck,
  HiLocationMarker,
  HiCalendar,
  HiClock,
  HiCurrencyEuro,
  HiDocumentText,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { TrasportoInterface } from "../../types/trasporto";
import { Utente } from "../../types/utente";
import {
  createTrasporto,
  isTrasporto,
  updateTrasporto,
} from "@/app/hooks/services/trasportiServices";
import TransportCard from "./TransportCard";

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
  const [selectedTransport, setSelectedTransport] =
    useState<TrasportoInterface | null>(null);
  const [popConfig, setPopConfig] = useState({
    message: "",
    icon: <></>,
    color: "",
  });
  const [captionMessage, setCaptionMessage] = useState<string>("");

  useEffect(() => {
    if (access_token) {
      fetchData();
    }
  }, [access_token]);

  useEffect(() => {
    if (access_token) {
      if (dataList.length > 0) {
        setCaptionMessage(
          "Di seguito trovi l'elenco dei trasporti registrati."
        );
      } else {
        setCaptionMessage(
          "Nessun trasporto registrato o trovato per il tuo account."
        );
      }
    } else {
      setCaptionMessage(
        "Effettua il login per visualizzare lo storico dei trasporti."
      );
    }
  }, [access_token, dataList.length]);

  const handleEditClick = (data: T, type: "trasporto" | "utente") => {
    setEditFormState(data);
    setFormType(type);
  };

  const handleClose = () => {
    setEditFormState(null);
  };

  const handleRowClick = (data: T) => {
    if (data && isTrasporto(data)) {
      setSelectedTransport(data);
    }
  };

  const handleCloseTransportCard = () => {
    setSelectedTransport(null);
  };

  const handleTransportUpdate = async (
    updatedTransport: TrasportoInterface
  ) => {
    if (updatedTransport) {
      await fetchData();
    }
  };

  const handleSave = async (updatedData: T) => {
    try {
      if (isTrasporto(updatedData)) {
        await updateTrasporto(updatedData._id, updatedData, access_token);
      } else {
        await createTrasporto(
          updatedData as unknown as TrasportoInterface,
          access_token
        );
      }
      fetchData();
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
    if (!data) return;

    try {
      if (isTrasporto(data)) {
        await onDelete(data);
      } else {
        console.error(
          "Tentativo di eliminare un utente, operazione non supportata."
        );
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

      {selectedTransport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseTransportCard}
        >
          <div
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-right mb-2">
              <button
                onClick={handleCloseTransportCard}
                className="text-white text-sm px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                Chiudi
              </button>
            </div>
            <TransportCard
              transport={selectedTransport as TrasportoInterface}
              onTransportUpdate={handleTransportUpdate}
              onDelete={() => {
                if (selectedTransport) {
                  handleDeleteClick(selectedTransport as T);
                  handleCloseTransportCard();
                }
              }}
            />
          </div>
        </div>
      )}

      <Table hoverable>
        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Riepilogo Trasporti
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            {captionMessage}
          </p>
        </caption>
        <TableHead>
          <TableHeadCell className="w-24 md:w-auto">
            <div className="flex items-center gap-2">
              <HiTruck className="h-5 w-5 text-blue-600" />
              <span>Tipo</span>
            </div>
          </TableHeadCell>
          <TableHeadCell className="w-32 md:w-auto">
            <div className="flex items-center gap-2">
              <HiDocumentText className="h-5 w-5 text-gray-700" />
              <span>Descrizione</span>
            </div>
          </TableHeadCell>
          <TableHeadCell className="w-32 md:w-auto">
            <div className="flex items-center gap-2">
              <HiLocationMarker className="h-5 w-5 text-red-600" />
              <span>Destinazione</span>
            </div>
          </TableHeadCell>
          <TableHeadCell className="hidden md:table-cell">
            <div className="flex items-center gap-2">
              <HiCalendar className="h-5 w-5 text-indigo-600" />
              <span>Giornata</span>
            </div>
          </TableHeadCell>
          <TableHeadCell className="hidden md:table-cell">
            <div className="flex items-center gap-2">
              <HiClock className="h-5 w-5 text-yellow-600" />
              <span>Ore di Lavoro</span>
            </div>
          </TableHeadCell>
          <TableHeadCell className="hidden md:table-cell">
            <div className="flex items-center gap-2">
              <HiCurrencyEuro className="h-5 w-5 text-green-700" />
              <span>Importo</span>
            </div>
          </TableHeadCell>
          <TableHeadCell></TableHeadCell>
          <TableHeadCell></TableHeadCell>
        </TableHead>
        <TableBody>
          {dataList.length > 0 ? (
            dataList.map((data: T, index: number) => (
              <TableRow
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                onClick={() => handleRowClick(data)}
              >
                {isTrasporto(data) ? (
                  <>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <span className="hidden md:block">
                        {data.tipo_lavoro}
                      </span>

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
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(data, "trasporto");
                  }}
                >
                  <div>
                    <HiPencil className="h-5 w-5 cursor-pointer" />
                  </div>
                </TableCell>
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(data);
                  }}
                >
                  <div className="text-red-500">
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
