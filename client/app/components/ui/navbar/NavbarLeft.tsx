/** @format */

import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";

// Interfaccia per tipizzare le props di NavbarLeft
interface NavbarLeftProps {
  toggleSidebar: () => void; // Funzione per aprire/chiudere la sidebar
}

export default function NavbarLeft({ toggleSidebar }: NavbarLeftProps) {
  return (
    <div className="flex justify-start items-center">
      <button
        type="button"
        className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        onClick={toggleSidebar} // Chiama la funzione per aprire/chiudere la sidebar
      >
        <span className="sr-only">Apri sidebar</span>
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <Link href="/" className="flex items-center justify-between mr-4">
        <Image
          src="/images/avatars/profilo.webp"
          className="mr-3 h-8"
          alt="Logo Flowbite"
          width={32}
          height={32}
        />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          ViaVai 
        </span>
      </Link>
      <SearchBar />
    </div>
  );
}
