/** @format */

"use client";
import { Card, Dropdown, DropdownItem } from "flowbite-react";
import Image from "next/image";
import { useState } from "react";
import EditForm from "./EditForm";
import { useDispatch, useSelector } from "react-redux";
import {
  HiCheck,
  HiX,
  HiTruck,
  HiLocationMarker,
  HiCalendar,
  HiClock,
  HiHome,
  HiShoppingBag,
  HiBriefcase,
  HiCog,
  HiCurrencyEuro,
} from "react-icons/hi";
import Pop from "./Pop";
import { TrasportoInterface } from "../../types/trasporto";
import dotenv from "dotenv";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

interface TransportCardProps {
  transport: TrasportoInterface;
  onTransportUpdate?: (updatedTransport: TrasportoInterface) => void;
  onDelete: () => void;
}

const TransportCard = ({
  transport,
  onTransportUpdate,
  onDelete,
}: TransportCardProps) => {
  // Controllo all'inizio del componente per evitare errori
  if (!transport) {
    return (
      <Card className="max-w-sm">
        <div className="p-4 text-center">
          <p>Dati del trasporto non disponibili</p>
        </div>
      </Card>
    );
  }

  const [editFormState, setEditFormState] = useState<TrasportoInterface | null>(
    null
  );
  const [showPop, setShowPop] = useState(false);
  const [popConfig, setPopConfig] = useState({
    message: "",
    icon: <></>,
    color: "",
  });

  const dispatch = useDispatch();
  const { access_token } = useSelector((state: any) => state.auth);

  const handleEditClick = () => {
    setEditFormState(transport);
  };

  const handleSave = async (updatedData: TrasportoInterface) => {
    try {
      const apiResponse = await fetch(
        `${LOCAL_HOST}/trasporti/${updatedData._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!apiResponse.ok) {
        throw new Error("Errore durante l'aggiornamento del trasporto");
      }

      const risultato = await apiResponse.json();
      console.log("Trasporto aggiornato con successo:", risultato);

      // Chiudi il form
      setEditFormState(null);

      // Notifica il componente genitore dell'aggiornamento
      if (onTransportUpdate) {
        onTransportUpdate(updatedData);
      }

      // Mostra Pop di successo
      setPopConfig({
        message: "Trasporto aggiornato con successo!",
        icon: <HiCheck className="h-5 w-5 text-green-500" />,
        color: "green-500",
      });
      setShowPop(true);

      setTimeout(() => {
        setShowPop(false);
      }, 3000);
    } catch (errore) {
      console.error("Errore durante il salvataggio:", errore);
      setPopConfig({
        message: "Errore durante l'aggiornamento del trasporto",
        icon: <HiX className="h-5 w-5 text-red-500" />,
        color: "red-500",
      });
      setShowPop(true);

      setTimeout(() => {
        setShowPop(false);
      }, 3000);
    }
  };

  const handleClose = () => {
    setEditFormState(null);
  };

  // Determina l'immagine da utilizzare in base al tipo di trasporto
  const getTransportImage = () => {
    if (!transport || !transport.tipo_lavoro)
      return "/images/backgrounds/amsterdam.webp";

    switch (transport.tipo_lavoro) {
      case "Trasloco":
        return "/images/backgrounds/trasloco.webp";
      case "Installazione":
        return "/images/backgrounds/installazione.webp";
      case "Consegna":
        return "/images/backgrounds/consegna.webp";
      default:
        return "/images/backgrounds/amsterdam.webp";
    }
  };

  // Funzione per ottenere l'icona in base al tipo di lavoro
  const getTipoLavoroIcon = () => {
    if (!transport || !transport.tipo_lavoro) return <HiTruck />;

    switch (transport.tipo_lavoro) {
      case "Trasloco":
        return <HiTruck className="h-5 w-5 text-blue-600" />;
      case "Installazione":
        return <HiCog className="h-5 w-5 text-green-600" />;
      case "Consegna":
        return <HiShoppingBag className="h-5 w-5 text-orange-600" />;
      default:
        return <HiTruck className="h-5 w-5 text-blue-600" />;
    }
  };

  // Funzione per ottenere l'icona in base al tipo di giornata
  const getTipoGiornataIcon = () => {
    if (!transport || !transport.tipo_giornata)
      return <HiCalendar className="h-5 w-5 text-indigo-600" />;

    switch (transport.tipo_giornata) {
      case "Giornata":
        return <HiHome className="h-5 w-5 text-indigo-600" />;
      case "Trasferta":
        return <HiBriefcase className="h-5 w-5 text-purple-600" />;
      default:
        return <HiCalendar className="h-5 w-5 text-indigo-600" />;
    }
  };

  return (
    <Card
      className="max-w-sm"
      imgAlt={`Immagine ${transport?.tipo_lavoro || "trasporto"}`}
      imgSrc={getTransportImage()}
    >
      {showPop && (
        <Pop
          message={popConfig.message}
          icon={popConfig.icon}
          color={popConfig.color}
        />
      )}

      <div className="flex justify-end px-4 pt-4">
        <Dropdown inline label="">
          <DropdownItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleEditClick}
            >
              Modifica
            </a>
          </DropdownItem>
          <DropdownItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onDelete}
            >
              Elimina
            </a>
          </DropdownItem>
        </Dropdown>
      </div>

      <div>
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {transport.descrizione_lavoro}
        </h5>
      </div>

      <div className="font-semibold tracking-tight text-gray-700 dark:text-white mt-2">
        <div className="flex items-center gap-2">
          {getTipoLavoroIcon()}
          <p>{transport.tipo_lavoro}</p>
        </div>
      </div>
      <div className="font-semibold tracking-tight text-gray-700 dark:text-white mt-2">
        <div className="flex items-center gap-2">
          <HiLocationMarker className="h-5 w-5 text-red-600" />
          <p>{transport.destinazione}</p>
        </div>
      </div>
      <div className="font-semibold tracking-tight text-gray-700 dark:text-white mt-2">
        <div className="flex items-center gap-2">
          {getTipoGiornataIcon()}
          <p>{transport.tipo_giornata}</p>
        </div>
      </div>
      <div className="font-semibold tracking-tight text-gray-700 dark:text-white mt-2">
        <div className="flex items-center gap-2">
          <HiClock className="h-5 w-5 text-yellow-600" />
          <p>{transport.ore_lavoro} ore</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <HiCurrencyEuro className="h-5 w-5 text-green-700" />

          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {transport.importo}{" "}
          </span>
          {/* <p className="text-gray-700"></p> */}
        </div>
        <a
          href="#"
          className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          onClick={handleEditClick}
        >
          Modifica
        </a>
      </div>

      {editFormState && (
        <EditForm
          data={editFormState}
          onSave={handleSave}
          onClose={handleClose}
          type="trasporto"
        />
      )}
    </Card>
  );
};

export default TransportCard;
