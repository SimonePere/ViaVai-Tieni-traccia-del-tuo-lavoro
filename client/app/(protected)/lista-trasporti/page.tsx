/** @format */

"use client";

import { EasyTable, TableData } from "@/components/easy-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Per accedere allo stato Redux
import { setTrasporti } from "@/app/redux/slices/trasportiSlice";
import {
  fetchTrasporti,
  createTrasporto,
  deleteTrasporto,
  updateTrasporto,
} from "@/app/hooks/services/trasportiServices";
import { Utente } from "@/app/types/utente";
import { TrasportoInterface } from "@/app/types/trasporto";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataDialog } from "@/components/data-dialog";

interface EasyTableProps {
  row: TableData;
  type: string;
  showActions: boolean;
  onAdd: () => void;
  onEdit: (row: TableData) => void;
  onDelete: (row: TableData) => void;
  fetchData: () => Promise<void>;
  onSave: (row: TableData) => void;
}

export default function ListaTrasporti() {
  const dispatch = useDispatch();
  const { access_token, isAuthenticated } = useSelector(
    (state: any) => state.auth
  );
  const { trasporti } = useSelector((state: any) => state.trasporti);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTrasporto, setSelectedTrasporto] = useState<
    TableData | undefined
  >();

  const fetchData = async () => {
    if (!access_token) return;
    try {
      setIsLoading(true);
      const data = await fetchTrasporti(access_token);
      dispatch(setTrasporti(data));
    } catch (error) {
      console.error("Errore nel recupero dei trasporti:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [access_token, isAuthenticated]);

  const handleDelete = async (row: TableData) => {
    try {
      const id = (row as any)._id || row.id;
      if (!id) {
        throw new Error("ID non trovato");
      }
      await deleteTrasporto(id.toString(), access_token);
      console.log("Trasporto eliminato con successo");
      fetchData();
    } catch (error) {
      console.error("Errore durante l'eliminazione del trasporto:", error);
    }
  };

  const handleEdit = (row: TableData) => {
    setSelectedTrasporto(row);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedTrasporto(undefined);
    setDialogOpen(true);
  };

  const handleSave = async (data: TableData) => {
    try {
      if (selectedTrasporto) {
        // Modifica
        const id = (selectedTrasporto as any)._id || selectedTrasporto.id;
        const trasportoData = {
          ...data,
          _id: id.toString(),
        } as TrasportoInterface;
        await updateTrasporto(id.toString(), trasportoData, access_token);
      } else {
        // Nuovo trasporto - non inviare _id
        const { _id, ...trasportoData } = data as any;
        await createTrasporto(
          trasportoData as TrasportoInterface,
          access_token
        );
      }
      fetchData();
    } catch (error) {
      console.error("Errore durante il salvataggio del trasporto:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista Trasporti</h2>
        {isAuthenticated && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="h-8"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Aggiungi Trasporto
          </Button>
        )}
      </div>

      {!isAuthenticated || isLoading ? (
        <div className="text-center p-8 text-gray-500">
          {!isAuthenticated
            ? "Per visualizzare i trasporti è necessario effettuare l'accesso."
            : "Caricamento trasporti in corso..."}
        </div>
      ) : trasporti && trasporti.length > 0 ? (
        <EasyTable
          data={trasporti}
          type="trasporto"
          showActions={true}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          fetchData={fetchData}
          onSave={handleSave}
        />
      ) : (
        <div className="text-center p-8 text-gray-500">
          Nessun trasporto disponibile
        </div>
      )}

      <DataDialog
        type="trasporto"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={selectedTrasporto}
        onSave={handleSave}
      />
    </div>
  );
}
