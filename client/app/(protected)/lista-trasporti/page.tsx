/** @format */

"use client";

import { EasyTable, TableData } from "@/components/easy-table";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTrasporti } from "@/app/redux/slices/trasportiSlice";
import {
  fetchTrasporti,
  createTrasporto,
  deleteTrasporto,
  updateTrasporto,
} from "@/app/hooks/services/trasportiServices";
import { TrasportoInterface } from "@/app/types/trasporto";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";
import { DataDialog } from "@/components/data-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, CheckCircle2 } from "lucide-react";
import { RootState, TrasportoTableData } from "@/app/types/redux";

export default function ListaTrasporti() {
  const dispatch = useDispatch();
  const { access_token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { trasporti } = useSelector((state: RootState) => state.trasporti);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTrasporto, setSelectedTrasporto] = useState<
    TrasportoTableData | undefined
  >();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const fetchData = useCallback(async () => {
    if (!access_token) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTrasporti(access_token);
      dispatch(setTrasporti(data));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Errore nel recupero dei trasporti";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [access_token, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchData]);

  const handleDelete = async (row: TableData) => {
    if (!access_token) return;
    try {
      setError(null);
      const id = (row as TrasportoTableData)._id || row.id;
      if (!id) {
        throw new Error("ID non trovato");
      }
      await deleteTrasporto(id.toString(), access_token);
      setSuccessMessage("Trasporto eliminato con successo!");
      setIsSuccess(true);
      fetchData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Errore durante l'eliminazione del trasporto";
      setError(errorMessage);
      setIsSuccess(false);
    }
  };

  const handleEdit = (row: TableData) => {
    setSelectedTrasporto(row as TrasportoTableData);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedTrasporto(undefined);
    setDialogOpen(true);
  };

  const handleSave = async (data: TableData) => {
    if (!access_token) return;
    try {
      setError(null);
      if (selectedTrasporto) {
        const id =
          (selectedTrasporto as TrasportoTableData)._id || selectedTrasporto.id;
        const trasportoData = {
          ...data,
          _id: id.toString(),
        } as unknown as TrasportoInterface;
        await updateTrasporto(id.toString(), trasportoData, access_token);
        setSuccessMessage("Trasporto modificato con successo!");
      } else {
        const trasportoData = { ...data } as unknown as TrasportoInterface;
        await createTrasporto(trasportoData, access_token);
        setSuccessMessage("Trasporto creato con successo!");
      }
      setIsSuccess(true);
      fetchData();
      setDialogOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Errore durante il salvataggio del trasporto";
      setError(errorMessage);
      setIsSuccess(false);
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
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Caricamento...
              </span>
            ) : (
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                Aggiungi Trasporto
              </>
            )}
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      {isSuccess && successMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {!isAuthenticated || isLoading ? (
        <div className="text-center p-8 text-gray-500">
          {!isAuthenticated
            ? "Per visualizzare i trasporti è necessario effettuare l'accesso."
            : "Caricamento trasporti in corso..."}
        </div>
      ) : trasporti && trasporti.length > 0 ? (
        <EasyTable
          data={trasporti as unknown as TableData[]}
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
