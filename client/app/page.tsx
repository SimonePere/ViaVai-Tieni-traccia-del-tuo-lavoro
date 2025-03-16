"use client";

import Dashboard from "./components/layout/Dashboard";
import GridList from "./components/ui/GridList";

export default function Home() {
   
  return (
    <Dashboard>
      <div>
        <h1>Benvenuto nella tua Dashboard</h1>
        {/* qua potremmo mettere un riepilogo a widget con tutti
        overview di quello che si puo controllare
        sorta di pannello controllo */}
      </div>
    </Dashboard>
  );
}


