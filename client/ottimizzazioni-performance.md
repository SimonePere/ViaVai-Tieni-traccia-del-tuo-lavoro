<!-- @format -->

# Ottimizzazioni Performance

## Verifica Token di Autenticazione

### Problema

Su dispositivi mobili, la verifica del token di autenticazione spesso falliva con errori "failed to fetch" dovuti a:

- Connessioni di rete instabili
- Timeout non gestiti
- Mancanza di meccanismi di retry
- URL hardcoded

### Soluzione Implementata

1. **Timeout Gestito**

   - Implementato timeout di 5 secondi usando `AbortController`
   - La richiesta viene automaticamente interrotta se non completa entro il timeout

2. **Sistema di Retry**

   - Massimo 3 tentativi in caso di errore
   - Backoff esponenziale tra i tentativi (1s, 2s, 3s)
   - Logging dei tentativi per debugging

3. **Gestione Errori Robusta**

   - Distinzione tra errori di timeout e altri errori
   - Type safety per la gestione degli errori
   - Messaggi di errore specifici per ogni tipo di fallimento

4. **Configurazione Dinamica**
   - URL del backend configurato tramite variabili d'ambiente
   - Nessun URL hardcoded nel codice

### Benefici

- Maggiore affidabilità su connessioni mobili instabili
- Migliore esperienza utente con feedback appropriati
- Debugging più semplice grazie ai log dettagliati
- Codice più manutenibile e type-safe

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

// ... existing code ...
