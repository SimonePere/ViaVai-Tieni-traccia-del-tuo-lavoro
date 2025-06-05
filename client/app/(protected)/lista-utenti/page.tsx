/** @format */

"use client";

import { EasyTable, TableData } from "@/components/easy-table";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "@/app/redux/slices/usersSlice";
import debounce from "lodash/debounce";

import {
  fetchUtenti,
  createUtente,
  deleteUtente,
  updateUtente,
} from "@/app/hooks/services/utentiServices";

import { UtenteInterface } from "@/app/types/utente";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataDialog } from "@/components/data-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, CheckCircle2 } from "lucide-react";
import { RootState, UtenteTableData } from "@/app/types/redux";

export default function ListaUtenti() {
  const dispatch = useDispatch();
  const { access_token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { users } = useSelector((state: RootState) => state.users);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUtente, setSelectedUtente] = useState<
    UtenteTableData | undefined
  >();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const fetchData = useCallback(async () => {
    if (!access_token) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchUtenti(access_token);
      dispatch(setUsers(data));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Errore nel recupero degli utenti";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [access_token, dispatch]);

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 300),
    [fetchData]
  );

  const handleDelete = useCallback(
    async (row: TableData) => {
      if (!access_token) {
        setError("Token di accesso non disponibile");
        return;
      }
      try {
        setError(null);
        const id = (row as UtenteTableData)._id || row.id;
        if (!id) {
          throw new Error("ID non trovato");
        }
        await deleteUtente(id.toString(), access_token);
        setSuccessMessage("Utente eliminato con successo!");
        setIsSuccess(true);
        debouncedFetchData();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Errore durante l'eliminazione dell'utente";
        setError(errorMessage);
        setIsSuccess(false);
      }
    },
    [access_token, debouncedFetchData]
  );

  const handleEdit = useCallback((row: TableData) => {
    setSelectedUtente(row as UtenteTableData);
    setDialogOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedUtente(undefined);
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(
    async (data: TableData) => {
      if (!access_token) {
        setError("Token di accesso non disponibile");
        return;
      }
      try {
        setIsSaving(true);
        setError(null);
        if (selectedUtente) {
          const id =
            (selectedUtente as UtenteTableData)._id || selectedUtente.id;
          const utenteData = {
            ...data,
            _id: id.toString(),
          } as UtenteInterface;
          await updateUtente(id.toString(), utenteData, access_token);
          setSuccessMessage("Utente modificato con successo!");
        } else {
          const utenteData = { ...data } as UtenteInterface;
          await createUtente(utenteData, access_token);
          setSuccessMessage("Utente creato con successo!");
        }
        setIsSuccess(true);
        debouncedFetchData();
        setDialogOpen(false);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Errore durante il salvataggio dell'utente";
        setError(errorMessage);
        setIsSuccess(false);
      } finally {
        setIsSaving(false);
      }
    },
    [access_token, selectedUtente, debouncedFetchData]
  );

  useEffect(() => {
    if (isAuthenticated) {
      debouncedFetchData();
    } else {
      setIsLoading(false);
    }
    return () => {
      debouncedFetchData.cancel();
    };
  }, [isAuthenticated, debouncedFetchData]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista Utenti</h2>
        {isAuthenticated && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="h-8"
            disabled={isLoading || isSaving}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {isLoading ? "Caricamento..." : "Aggiungi Utente"}
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
            ? "Per visualizzare gli Utenti è necessario effettuare l'accesso."
            : "Caricamento Utenti in corso..."}
        </div>
      ) : users && users.length > 0 ? (
        <EasyTable
          data={users as unknown as TableData[]}
          type="utente"
          showActions={true}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          fetchData={debouncedFetchData}
          onSave={handleSave}
        />
      ) : (
        <div className="text-center p-8 text-gray-500">
          Nessun Utente disponibile
        </div>
      )}

      <DataDialog
        type="utente"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={selectedUtente}
        onSave={handleSave}
      />
    </div>
  );
}
