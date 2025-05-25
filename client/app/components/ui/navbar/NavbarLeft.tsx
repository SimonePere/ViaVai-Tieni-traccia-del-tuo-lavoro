/** @format */

import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { HiOutlineMenu } from "react-icons/hi";

// Interfaccia per tipizzare le props di NavbarLeft
interface NavbarLeftProps {
  toggleSidebar: () => void; // Funzione per aprire/chiudere la sidebar
}

export default function NavbarLeft({ toggleSidebar }: NavbarLeftProps) {
  return (
    <div className="flex justify-start items-center">
      <button
        title="Apri/Chiudi la sidebar"
        type="button"
        className="p-2 mr-2  text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        onClick={toggleSidebar} // Chiama la funzione per aprire/chiudere la sidebar
      >
        <HiOutlineMenu className="w-6 h-6" />
      </button>
      <Link href="/" className="flex items-center justify-between mr-4">
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          ViaVai
        </span>
      </Link>
      <SearchBar />
    </div>
  );
}
