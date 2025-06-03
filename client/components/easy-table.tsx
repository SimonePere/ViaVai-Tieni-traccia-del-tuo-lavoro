/** @format */

"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CustomPopover } from "@/components/ui/custom-popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, CheckCircle2 } from "lucide-react";

// Definizione degli schemi Zod per la validazione dei dati
// Schema per i dati dei trasporti
const trasportoSchema = z.object({
  id: z.number(), // ID univoco del trasporto
  tipo_lavoro: z.string(), // Tipo di lavoro (es. Trasloco, Installazione)
  descrizione_lavoro: z.string(), // Descrizione dettagliata del lavoro
  destinazione: z.string(), // Indirizzo di destinazione
  tipo_giornata: z.string(), // Tipo di giornata (es. Giornata, Trasferta)
  ore_lavoro: z.number(), // Numero di ore di lavoro
  importo: z.number(), // Importo in euro
});

// Schema per i dati degli utenti
const utenteSchema = z.object({
  id: z.number(), // ID univoco dell'utente
  nome: z.string(), // Nome dell'utente
  cognome: z.string(), // Cognome dell'utente
  email: z.string(), // Email dell'utente
  telefono: z.string(), // Numero di telefono
  utente_citta: z.string(), // Città dell'utente
  dataRegistrazione: z.string(), // Data di registrazione
});

// Tipo unione che può essere sia un trasporto che un utente
export type TableData =
  | z.infer<typeof trasportoSchema>
  | z.infer<typeof utenteSchema>;

/**
 * Type guard per verificare se un dato è un trasporto
 * @param data - Il dato da verificare
 * @returns true se il dato è un trasporto, false altrimenti
 */
function isTrasporto(data: TableData): data is z.infer<typeof trasportoSchema> {
  return "tipo_lavoro" in data;
}

/**
 * Type guard per verificare se un dato è un utente
 * @param data - Il dato da verificare
 * @returns true se il dato è un utente, false altrimenti
 */
function isUtente(data: TableData): data is z.infer<typeof utenteSchema> {
  return "nome" in data;
}

/**
 * Funzione che ritorna LE COLONNE in base al tipo di tabella
 * @param type - Il tipo di tabella ('trasporto' o 'utente')
 * @param onDelete - Funzione per eliminare una riga
 * @param onEdit - Funzione per editare una riga
 * @returns Array di definizioni di colonne
 */
function getColumns(
  type: string,
  onDelete: (row: TableData) => void,
  onEdit?: (row: TableData) => void
): ColumnDef<TableData>[] {
  // Colonne base comuni a tutti i tipi di tabella
  const baseColumns: ColumnDef<TableData>[] = [
    // CHECKBOX PER SELEZIONARE PIU ELEMENTI (eliminata x inutilizzo)
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <div className="flex items-center justify-center">
    //       <Checkbox
    //         checked={
    //           table.getIsAllPageRowsSelected() ||
    //           (table.getIsSomePageRowsSelected() && "indeterminate")
    //         }
    //         onCheckedChange={(value) =>
    //           table.toggleAllPageRowsSelected(!!value)
    //         }
    //         aria-label="Seleziona tutto"
    //       />
    //     </div>
    //   ),
    //   cell: ({ row }) => (
    //     <div className="flex items-center justify-center">
    //       <Checkbox
    //         checked={row.getIsSelected()}
    //         onCheckedChange={(value) => row.toggleSelected(!!value)}
    //         aria-label="Seleziona riga"
    //       />
    //     </div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      id: "actions",
      header: "Azioni",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit?.(row.original)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <CustomPopover
              triggerIcon={<TrashIcon className="h-4 w-4" />}
              align="end"
              side="left"
            >
              <div className="flex flex-col gap-4 p-2">
                <p className="text-sm">
                  Sei sicuro di voler eliminare questo elemento?
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Annulla
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onDelete(row.original);
                    }}
                  >
                    Elimina
                  </Button>
                </div>
              </div>
            </CustomPopover>
          </div>
        );
      },
    },
  ];

  // Definizione delle colonne specifiche per i trasporti
  if (type === "trasporto") {
    return [
      ...baseColumns,
      {
        accessorKey: "tipo_lavoro",
        header: "Tipo Lavoro",
        cell: ({ row }) => {
          if (!isTrasporto(row.original)) return null;
          return (
            <div className="w-32">
              <Badge variant="outline" className="px-1.5 text-muted-foreground">
                {row.original.tipo_lavoro}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "descrizione_lavoro",
        header: "Descrizione",
        cell: ({ row }) => {
          if (!isTrasporto(row.original)) return null;
          return row.original.descrizione_lavoro;
        },
      },
      {
        accessorKey: "destinazione",
        header: "Destinazione",
        cell: ({ row }) => {
          if (!isTrasporto(row.original)) return null;
          return row.original.destinazione;
        },
      },
      {
        accessorKey: "tipo_giornata",
        header: "Tipo Giornata",
        cell: ({ row }) => {
          if (!isTrasporto(row.original)) return null;
          return row.original.tipo_giornata;
        },
      },
      {
        accessorKey: "ore_lavoro",
        header: "Ore Lavoro",
        cell: ({ row }) => {
          if (!isTrasporto(row.original)) return null;
          return row.original.ore_lavoro;
        },
      },
      {
        accessorKey: "importo",
        header: "Importo",
        cell: ({ row }) => {
          if (!isTrasporto(row.original)) return null;
          return `€${row.original.importo}`;
        },
      },
    ];
  }

  // Definizione delle colonne specifiche per gli utenti
  if (type === "utente") {
    return [
      ...baseColumns,
      {
        accessorKey: "nome",
        header: "Nome",
        cell: ({ row }) => {
          if (!isUtente(row.original)) return null;
          return row.original.nome;
        },
      },
      {
        accessorKey: "cognome",
        header: "Cognome",
        cell: ({ row }) => {
          if (!isUtente(row.original)) return null;
          return row.original.cognome;
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
          if (!isUtente(row.original)) return null;
          return row.original.email;
        },
      },
      {
        accessorKey: "telefono",
        header: "Telefono",
        cell: ({ row }) => {
          if (!isUtente(row.original)) return null;
          return row.original.telefono;
        },
      },
      {
        accessorKey: "utente_citta",
        header: "Città",
        cell: ({ row }) => {
          if (!isUtente(row.original)) return null;
          return row.original.utente_citta;
        },
      },
      {
        accessorKey: "dataRegistrazione",
        header: "Data Registrazione",
        cell: ({ row }) => {
          if (!isUtente(row.original)) return null;
          return row.original.dataRegistrazione;
        },
      },
    ];
  }

  return baseColumns;
}

interface EasyTableProps {
  data: TableData[];
  type: string;
  fetchData: () => void;
  onAdd?: () => void;
  onEdit?: (row: TableData) => void;
  onSave: (row: TableData) => void;
  onDelete: (row: TableData) => void;
  showActions?: boolean;
}

/**
 * Componente EasyTable - Una tabella dati flessibile e personalizzabile
 * @param data - Array di dati da visualizzare (trasporti o utenti)
 * @param type - Tipo di dati ('trasporto' o 'utente')
 */
export function EasyTable({
  data,
  type,
  fetchData,
  onAdd,
  onEdit,
  onSave,
  onDelete,
  showActions = true,
}: EasyTableProps) {
  // Stati per gestire la selezione delle righe
  const [rowSelection, setRowSelection] = React.useState({});
  // Stati per gestire la visibilità delle colonne
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  // Stati per gestire il filtraggio globale
  const [globalFilter, setGlobalFilter] = React.useState("");
  // Stati per gestire l'ordinamento
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // Stati per gestire la paginazione
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Inizializzazione della tabella con le configurazioni
  const table = useReactTable({
    data,
    columns: getColumns(type, onDelete, onEdit),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Barra degli strumenti della tabella */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* Campo di ricerca globale */}
          <Input
            placeholder="Cerca..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {onAdd && (
            <Button variant="outline" size="sm" onClick={onAdd} className="h-8">
              <PlusIcon className="h-4 w-4 mr-2" />
              Aggiungi
            </Button>
          )}
        </div>
        {/* Menu per la visibilità e filtri delle colonne */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              Colonne <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contenitore principale della tabella Header */}
      <div className="rounded-md border">
        <Table>
          {/* Intestazione della tabella */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {/* Corpo della tabella Body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={getColumns(type, onDelete, onEdit).length}
                  className="h-24 text-center"
                >
                  Nessun risultato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Controlli di paginazione */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} di{" "}
          {table.getFilteredRowModel().rows.length} riga(e) selezionata(e).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Precedente
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Successivo
          </Button>
        </div>
      </div>
    </div>
  );
}
