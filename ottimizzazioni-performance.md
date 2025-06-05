<!-- @format -->

# Ottimizzazioni di Performance - ViaVai

## 1. Ottimizzazioni dei Click Handler

### Problema

Il click handler impiegava 230ms per essere eseguito, causando un ritardo percepibile nell'interfaccia utente.

### Soluzioni Implementate

#### 1.1 Memoizzazione delle Colonne

```typescript
const columns = React.useMemo(
  () => getColumns(type, onDelete, onEdit),
  [type, onDelete, onEdit]
);
```

- **Dove**: `client/components/easy-table.tsx`
- **Perché**: Evita la ricreazione delle colonne ad ogni render
- **Come funziona**: Memorizza il risultato di `getColumns` e lo ricrea solo quando cambiano le dipendenze
- **Benefici**: Riduce il carico di lavoro durante il rendering della tabella

#### 1.2 Memoizzazione dei Gestori Eventi

```typescript
const handleGlobalFilterChange = React.useCallback(
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(event.target.value);
  },
  []
);

const handleColumnVisibilityChange = React.useCallback(
  (column: { toggleVisibility: (value: boolean) => void }, value: boolean) => {
    column.toggleVisibility(!!value);
  },
  []
);
```

- **Dove**: `client/components/easy-table.tsx`
- **Perché**: Evita la ricreazione delle funzioni ad ogni render
- **Come funziona**: Memorizza le funzioni e le ricrea solo quando cambiano le dipendenze
- **Benefici**: Migliora le performance dei click handler

## 2. Ottimizzazioni del Forced Reflow

### Problema

Il forced reflow impiegava 52ms durante l'esecuzione di JavaScript, causando scatti nell'interfaccia.

### Soluzioni Implementate

#### 2.1 Utilizzo di Transform GPU

```typescript
<div className="rounded-md border transform-gpu">
  <Table>
    <TableBody className="transform-gpu">
      <TableRow className="transform-gpu">
```

- **Dove**: `client/components/easy-table.tsx`
- **Perché**: Sposta le operazioni di rendering sulla GPU
- **Come funziona**: Utilizza l'accelerazione hardware per le trasformazioni
- **Benefici**: Riduce il carico sulla CPU e migliora la fluidità delle animazioni

#### 2.2 Ottimizzazione del Rendering della Tabella

- **Dove**: `client/components/easy-table.tsx`
- **Perché**: Riduce il numero di reflow durante l'aggiornamento della tabella
- **Come funziona**: Utilizza tecniche di batch rendering e ottimizzazione del DOM
- **Benefici**: Migliora la performance complessiva della tabella

## 3. Ottimizzazione del Metadata

### Problema

L'errore indicava che `themeColor` era configurato nel metadata export invece che nel viewport export.

### Soluzione Implementata

#### 3.1 Spostamento della Configurazione

```typescript
// Prima
export const metadata: Metadata = {
  themeColor: "#ffffff",
  // ... altri metadata
};

// Dopo
export const viewport: Viewport = {
  themeColor: "#ffffff",
};
```

- **Dove**: `client/app/layout.tsx`
- **Perché**: Segue le best practices di Next.js per la configurazione del viewport
- **Come funziona**: Sposta la configurazione nel contesto corretto
- **Benefici**: Risolve l'errore e migliora la compatibilità con Next.js

## 4. Ottimizzazione dell'Autenticazione

### Problema

Su dispositivi mobili, la verifica del token di autenticazione spesso falliva con errori "failed to fetch" dovuti a:

- Connessioni di rete instabili
- Timeout non gestiti
- Mancanza di meccanismi di retry
- URL hardcoded

### Soluzioni Implementate

#### 4.1 Timeout Gestito

- Implementato timeout di 5 secondi usando `AbortController`
- La richiesta viene automaticamente interrotta se non completa entro il timeout

#### 4.2 Sistema di Retry

- Massimo 3 tentativi in caso di errore
- Backoff esponenziale tra i tentativi (1s, 2s, 3s)
- Logging dei tentativi per debugging

#### 4.3 Gestione Errori Robusta

- Distinzione tra errori di timeout e altri errori
- Type safety per la gestione degli errori
- Messaggi di errore specifici per ogni tipo di fallimento

#### 4.4 Configurazione Dinamica

- URL del backend configurato tramite variabili d'ambiente
- Nessun URL hardcoded nel codice

### Implementazione

```typescript
const checkLoggedUser = async () => {
  const token = localStorage.getItem("access_token");
  const maxRetries = 3;
  let retryCount = 0;

  if (!token) {
    console.log("Nessun token trovato");
    setIsLoading(false);
    return;
  }

  const verifyToken = async () => {
    try {
      setIsLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${LOCAL_HOST}/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        dispatch(loginSuccess(data));
      } else {
        console.log("Token non valido");
        localStorage.removeItem("access_token");
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error("Richiesta timeout");
      } else {
        console.error("Errore nel recupero dei dati dell'Utente:", error);
      }

      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Tentativo ${retryCount} di ${maxRetries}`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
        return verifyToken();
      }
    } finally {
      setIsLoading(false);
    }
  };

  await verifyToken();
};
```

### Benefici

- Maggiore affidabilità su connessioni mobili instabili
- Migliore esperienza utente con feedback appropriati
- Debugging più semplice grazie ai log dettagliati
- Codice più manutenibile e type-safe

## 5. Best Practices Generali Implementate

### 5.1 Gestione dello Stato

- Utilizzo di `useState` per stati locali
- Memoizzazione di valori calcolati con `useMemo`
- Memoizzazione di funzioni con `useCallback`

### 5.2 Ottimizzazione del Rendering

- Utilizzo di `transform-gpu` per le animazioni
- Batch rendering per le operazioni multiple
- Evitare reflow non necessari

### 5.3 Gestione delle Dipendenze

- Dipendenze corrette negli hooks
- Evitare dipendenze circolari
- Ottimizzazione delle re-render

## 6. Monitoraggio e Verifica

Per verificare l'efficacia delle ottimizzazioni:

1. Utilizzare gli strumenti di sviluppo del browser (DevTools)
2. Monitorare la Performance tab
3. Verificare i tempi di esecuzione dei click handler
4. Controllare la presenza di forced reflow

## 7. Risultati Attesi

- Riduzione del tempo di esecuzione dei click handler
- Eliminazione o riduzione significativa dei forced reflow
- Miglioramento generale della fluidità dell'interfaccia
- Risoluzione degli errori di configurazione
- Maggiore affidabilità dell'autenticazione su dispositivi mobili

## 8. Problemi di Idratazione

### Problema

L'errore di idratazione si verifica quando c'è una discrepanza tra il contenuto renderizzato lato server e quello renderizzato lato client. Questo può causare:

- Avvisi di idratazione nella console
- Comportamenti imprevedibili dell'interfaccia
- Problemi di performance durante l'idratazione

### Soluzioni Implementate

#### 8.1 Gestione dell'Idratazione nel Layout

```typescript
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProviders>
            <BaseLayout>{children}</BaseLayout>
          </StoreProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- **Dove**: `client/app/layout.tsx`
- **Perché**: Previene gli avvisi di idratazione non necessari
- **Come funziona**:
  - `suppressHydrationWarning` sopprime gli avvisi di idratazione per elementi che si prevede abbiano contenuti diversi tra server e client
  - `disableTransitionOnChange` evita transizioni non necessarie durante l'idratazione
- **Benefici**: Migliora l'esperienza utente durante il caricamento iniziale

#### 8.2 Best Practices per l'Idratazione

1. **Gestione del Tema**

   - Utilizzo di `ThemeProvider` per gestire il tema in modo consistente
   - Evita cambiamenti di tema durante l'idratazione

2. **Gestione dello Stato**

   - Inizializzazione corretta dello stato Redux
   - Evita aggiornamenti di stato non necessari durante l'idratazione

3. **Componenti Client/Server**
   - Utilizzo appropriato di "use client" directive
   - Separazione chiara tra componenti client e server

## 9. Ottimizzazioni TypeScript e ESLint

### Problema

La presenza di tipi `any` e warning ESLint potevano causare:

- Errori di tipo a runtime
- Codice meno manutenibile
- Warning che potevano nascondere problemi reali

### Soluzioni Implementate

#### 9.1 Ottimizzazione dei Tipi Redux

```typescript
// Definizione dello stato root con tutti i reducer
export interface RootState {
  auth: AuthState;
  register: RegisterState;
  trasporti: TrasportiState;
  users: UsersState;
}

// Definizione dello stato users
export interface UsersState {
  users: UtenteInterface[];
  loading?: boolean;
  error?: string | null;
}
```

- **Dove**: `client/app/types/redux.ts`
- **Perché**: Fornisce type safety per lo stato Redux
- **Come funziona**: Definisce interfacce specifiche per ogni slice dello stato
- **Benefici**:
  - Elimina l'uso di `any` nei selector
  - Migliora l'autocompletamento
  - Previene errori di tipo

#### 9.2 Ottimizzazione della Gestione degli Errori

```typescript
try {
  // ... codice ...
} catch (error: unknown) {
  const errorMessage =
    error instanceof Error ? error.message : "Messaggio di errore di default";
  setError(errorMessage);
}
```

- **Dove**: `client/app/(protected)/lista-utenti/page.tsx`
- **Perché**: Gestione più sicura degli errori
- **Come funziona**:
  - Usa `unknown` invece di `any` per gli errori
  - Verifica il tipo di errore con `instanceof`
  - Fornisce messaggi di fallback
- **Benefici**:
  - Migliore type safety
  - Gestione errori più robusta
  - Messaggi di errore più chiari

#### 9.3 Ottimizzazione dei Callback

```typescript
// Ottimizzazione dei callback in easy-table.tsx
const handleGlobalFilterChange = React.useCallback(
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(event.target.value);
  },
  []
);

const handleColumnVisibilityChange = React.useCallback(
  (column: { toggleVisibility: (value: boolean) => void }, value: boolean) => {
    column.toggleVisibility(!!value);
  },
  []
);

// Ottimizzazione dei callback in lista-utenti/page.tsx
const fetchData = useCallback(async () => {
  // ... logica fetch ...
}, [access_token, dispatch]);

const debouncedFetchData = useMemo(() => debounce(fetchData, 300), [fetchData]);
```

- **Dove**:
  - `client/components/easy-table.tsx`
  - `client/app/(protected)/lista-utenti/page.tsx`
- **Perché**:
  - Risolve warning ESLint
  - Ottimizza le performance
  - Migliora la type safety
- **Come funziona**:
  - Sostituisce `any` con tipi specifici
  - Usa `useCallback` per memoizzare le funzioni
  - Separa la logica di fetch dal debounce
  - Usa `useMemo` per il debounce
- **Benefici**:
  - Elimina warning ESLint
  - Migliora la performance
  - Codice più manutenibile
  - Type safety migliorata

#### 9.4 Ottimizzazione degli Schemi di Validazione

```typescript
// Prima
const trasportoSchema = z.object({
  id: z.number(),
  tipo_lavoro: z.string(),
  // ... altri campi
});

const utenteSchema = z.object({
  id: z.number(),
  nome: z.string(),
  // ... altri campi
});

// Dopo
import { TrasportoTableData, UtenteTableData } from "@/app/types/redux";
export type TableData = TrasportoTableData | UtenteTableData;
```

- **Dove**: `client/components/easy-table.tsx`
- **Perché**:
  - Elimina duplicazione dei tipi
  - Rimuove schemi Zod non utilizzati
  - Centralizza la definizione dei tipi
- **Come funziona**:
  - Rimuove gli schemi Zod definiti ma non utilizzati
  - Utilizza le interfacce già definite in `redux.ts`
  - Mantiene la type safety attraverso le interfacce TypeScript
- **Benefici**:
  - Codice più DRY (Don't Repeat Yourself)
  - Migliore manutenibilità
  - Eliminazione di warning ESLint
  - Centralizzazione dei tipi in un unico file
  - Riduzione della complessità del codice

### Best Practices Implementate

1. **Gestione dei Tipi**

   - Eliminazione di tutti i tipi `any`
   - Uso di interfacce specifiche
   - Type narrowing appropriato

2. **Gestione degli Errori**

   - Uso di `unknown` per gli errori
   - Verifica dei tipi di errore
   - Messaggi di errore chiari

3. **Ottimizzazione delle Performance**
   - Uso appropriato di `useCallback` e `useMemo`
   - Debounce ottimizzato
   - Dipendenze corrette negli hooks

### Risultati Attesi

- Eliminazione di tutti i warning ESLint
- Migliore type safety
- Codice più manutenibile
- Performance ottimizzate
- Gestione errori più robusta

## 10. Ottimizzazione del Componente NavUser

### Problema

Il componente NavUser presentava problemi di idratazione durante il ricaricamento della pagina, causando:

- Errori di idratazione nella console
- Discrepanze tra il rendering server e client
- Problemi di visualizzazione dei dati utente

### Soluzioni Implementate

#### 10.1 Gestione dell'Idratazione nel NavUser

```typescript
export function NavUser() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "Utente",
    email: "",
    avatar: undefined,
  });

  // Gestione del montaggio del componente
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Gestione dei dati utente
  useEffect(() => {
    if (!mounted) return;
    // ... logica di aggiornamento dati
  }, [mounted, authState]);

  // Renderizzazione condizionale
  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Avatar>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <span>Caricamento...</span>
              <span>Caricamento...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
}
```

- **Dove**: `client/components/nav-user.tsx`
- **Perché**: Risolve i problemi di idratazione e migliora l'esperienza utente
- **Come funziona**:
  - Utilizza un `setTimeout` per assicurare il montaggio solo dopo il rendering iniziale
  - Fornisce uno stato di caricamento visibile
  - Gestisce correttamente i dati dell'utente durante l'idratazione
- **Benefici**:
  - Elimina gli errori di idratazione
  - Migliora l'esperienza utente durante il caricamento
  - Mantiene la coerenza visiva durante l'idratazione
  - Gestione robusta dei dati utente

#### 10.2 Gestione dei Tipi

```typescript
interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

// Gestione dei dati utente con type safety
const name =
  typeof authState.user === "string"
    ? authState.user
    : (authState.user as UtenteInterface)?.nome || "Utente";

const email =
  authState.email ||
  (typeof authState.user !== "string" && authState.user?.email) ||
  "";
```

- **Dove**: `client/components/nav-user.tsx`
- **Perché**: Fornisce type safety e gestione robusta dei dati
- **Come funziona**:
  - Definisce interfacce chiare per i dati utente
  - Gestisce correttamente i tipi union
  - Fornisce valori di fallback appropriati
- **Benefici**:
  - Elimina errori TypeScript
  - Migliora la manutenibilità del codice
  - Gestione robusta dei casi edge

### Best Practices Implementate

1. **Gestione dell'Idratazione**

   - Montaggio ritardato del componente
   - Stato di caricamento visibile
   - Cleanup appropriato degli effetti

2. **Gestione dei Dati**

   - Type safety completa
   - Gestione robusta dei casi null/undefined
   - Valori di fallback appropriati

3. **Ottimizzazione delle Performance**
   - Evita re-render non necessari
   - Gestione efficiente degli effetti
   - Cleanup appropriato delle risorse

### Risultati Attesi

- Eliminazione degli errori di idratazione
- Migliore esperienza utente durante il caricamento
- Gestione robusta dei dati utente
- Type safety completa
- Performance ottimizzate
