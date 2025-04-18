"use client";

import React, { forwardRef, useEffect, useState } from "react";
import Link from "next/link";
import LoadingIcon from "../ui/LoadingIcon";
import { usePathname, useRouter } from "next/navigation"; // App Router
import useLoading from "../../hooks/useLoading";
import { HiOutlineHome, HiOutlineUser, HiOutlineLogin, HiOutlineLogout, HiOutlineClipboardList, HiExclamationCircle } from "react-icons/hi"; // Importa le icone di Flowbite
import { Button } from "flowbite-react";
import { logout } from "@/app/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import dotenv from "dotenv";
import { FaCheckCircle } from "react-icons/fa";
import Pop from "../ui/Pop";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;



interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen, toggleSidebar }, ref) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const pathname = usePathname(); // Nuovo modo di gestire il cambio pagina
  const [showPop, setShowPop] = useState(false); // Stato per gestire la visualizzazione del Pop
  const [popMessage, setPopMessage] = useState(""); // Messaggio da passare al Pop
  const [popColor, setPopColor] = useState("green-600"); // Colore del Pop
  const [popIcon, setPopIcon] = useState(<FaCheckCircle className="h-5 w-5 text-green-600" />); // Icona del Pop
  const authState = useSelector((state: any) => state.auth);


  useEffect(() => {
    startLoading();
    const timeout = setTimeout(() => stopLoading(), 500); // Simula caricamento
    return () => clearTimeout(timeout);
  }, [pathname]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authState.access_token) {
        try {
            dispatch(logout());
            setPopMessage("Logout avvenuto con successo. A presto!🖖");
            setPopIcon(<FaCheckCircle className="h-5 w-5 text-green-600" />);
            setPopColor("green-600");
            setShowPop(true);

            // piccolo delay prima del reindirizzamento per mostrare il messaggio
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (error: any) {
            console.error('Logout error:', error);
            setPopMessage("Errore durante il logout: " + error.message);
            setPopColor("red-600");
            setPopIcon(<HiExclamationCircle className="h-5 w-5 text-red-600" />);
            setShowPop(true);
        }
    } else {
        console.error('Logout error: Nessun utente autenticato');
        setPopMessage("Errore durante il logout: Nessun utente autenticato");
        setPopColor("red-600");
        setPopIcon(<HiExclamationCircle className="h-5 w-5 text-red-600" />);
        setShowPop(true);
    }
  };

  return (
    <aside
      ref={ref}
      className={`bg-gray-800 fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform 
        border-r border-gray-700 dark:bg-gray-800 dark:border-gray-700 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Sidebar"
      id="drawer-navigation"
    >
      {isLoading && <LoadingIcon />}
      <div className="overflow-y-auto py-5 px-3 h-full dark:bg-gray-800 ">
        <form action="#" method="GET" className="md:hidden mb-2">
          <label htmlFor="sidebar-search" className="sr-only">
            Cerca
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="sidebar-search"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Cerca"
            />
          </div>
        </form>
        <ul className="space-y-2">
          <li>
            <Link
              href="/trasporti"
              className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={startLoading}
            >
              <HiOutlineClipboardList className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ml-3">Trasporti</span>
            </Link>
          </li>
          <li>
            <Link
              href="/utenti"
              className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={startLoading}
            >
              <HiOutlineUser className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ml-3">Utenti</span>
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={startLoading}
            >
              <HiOutlineLogin className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-900" />
              <span className="ml-3">Login</span>
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={startLoading}
            >
              <HiOutlineUser className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ml-3">Registrazione</span>
            </Link>
          </li>
          <li>
            <Button
              className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={handleSubmit}
            >
              <HiOutlineLogout className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ml-3">Logout</span>
            </Button>
          </li>
          {/* Aggiungi altri elementi della sidebar qui */}
        </ul>
      {showPop && ( // Renderizza il Pop se showPop è true
        <Pop message={popMessage} icon={popIcon} color={popColor} />
      )}
      </div>
    </aside>
  );
});

export default Sidebar;

