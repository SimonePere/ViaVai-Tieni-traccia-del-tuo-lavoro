/** @format
 * ==============================================
 * 📁 DOCUMENTAZIONE NAVBAR
 * ==============================================
 *
 * 🏗️ STRUTTURA GENERALE
 * La Navbar è organizzata in componenti modulari:
 *
 * client/app/components/
 * ├── layout/
 * │   └── Navbar.tsx (componente principale)
 * └── ui/navbar/
 *     ├── NavbarLeft.tsx
 *     ├── NavbarRight.tsx
 *     ├── SearchBar.tsx
 *     └── dropdowns/
 *         ├── NotificationsDropdown.tsx
 *         ├── AppsDropdown.tsx
 *         └── UserDropdown.tsx
 *
 * 🔍 COMPONENTI PRINCIPALI
 * -----------------------
 * 1. Navbar.tsx
 *    - Container principale con posizionamento fisso
 *    - Layout flex per divisione left/right
 *
 * 2. NavbarLeft.tsx
 *    - Hamburger menu (solo mobile)
 *    - Logo e nome sito
 *    - SearchBar desktop
 *
 * 3. NavbarRight.tsx
 *    - SearchBar mobile
 *    - Dropdown notifiche, apps e utente
 *
 * 4. SearchBar.tsx
 *    - Versione desktop: form completo
 *    - Versione mobile: icona
 *
 * 🔽 DROPDOWN
 * -----------
 * - NotificationsDropdown: notifiche utente
 * - AppsDropdown: menu applicazioni
 * - UserDropdown: menu profilo utente
 *
 * 🎨 RESPONSIVE DESIGN
 * -------------------
 * Mobile (< 768px):
 * - Menu hamburger visibile
 * - SearchBar come icona
 * - Layout compatto
 *
 * Desktop (≥ 768px):
 * - Menu hamburger nascosto
 * - SearchBar completa
 * - Layout espanso
 *
 * 🔧 FEATURES
 * -----------
 * - Dark Mode supportata
 * - Accessibilità (sr-only labels)
 * - Interattività (hover, focus)
 * - Dropdown toggle via data attributes
 */

import { useEffect, useRef, useState } from "react";
import NavbarLeft from "../ui/navbar/NavbarLeft";
import NavbarRight from "../ui/navbar/NavbarRight";
import Sidebar from "./Sidebar";

const Navbar = () => {
  // Stato per gestire l'apertura della sidebar
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null); // Riferimento alla sidebar

  // Funzione per alternare lo stato della sidebar
  const toggleSidebar = () => {
    console.log("Toggle Sidebar Called"); // Aggiungi questo per il debug
    setSidebarOpen(!isSidebarOpen);
  };

  // Effetto per impostare lo stato iniziale della sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Apri la sidebar su desktop
      } else {
        setSidebarOpen(false); // Chiudi la sidebar su mobile
      }
    };

    // Imposta lo stato iniziale
    handleResize();

    // Aggiungi l'event listener per il resize
    window.addEventListener("resize", handleResize);

    // Rimuovi l'event listener al momento della pulizia
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Gestione del clic al di fuori della sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false); // Chiudi la sidebar se il clic è al di fuori
      }
    };

    // Aggiungi l'event listener per il clic
    document.addEventListener("mousedown", handleClickOutside);

    // Rimuovi l'event listener al momento della pulizia
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="border-b bg-gray-800 border-gray-700 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
        <div className="flex flex-wrap justify-between items-center">
          <NavbarLeft toggleSidebar={toggleSidebar} />
          <NavbarRight />
        </div>
      </nav>
      <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Navbar;
