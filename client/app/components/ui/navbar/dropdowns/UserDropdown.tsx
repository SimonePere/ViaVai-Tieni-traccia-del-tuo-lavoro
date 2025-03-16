/** @format */

import Image from "next/image";
import Link from "next/link";

export default function UserDropdown() {
  return (
    <>
      <button
        type="button"
        className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button"
        aria-expanded="false"
        data-dropdown-toggle="dropdown"
      >
        <span className="sr-only">Apri menu utente</span>
        <Image
          className="w-8 h-8 rounded-full"
          src="/images/avatars/profilo.webp"
          alt="user photo"
          width={32}
          height={32}
        />
      </button>

      <div
        className="hidden z-50 my-4 w-56 text-base list-none bg-white  divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl"
        id="dropdown"
      >
        {/* ... contenuto del dropdown ... */}
      </div>
    </>
  );
}
