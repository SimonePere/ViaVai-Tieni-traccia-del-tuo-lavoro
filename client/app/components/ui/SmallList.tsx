import { Card } from "flowbite-react";
import Image from "next/image";
import { Utente } from "@/app/types/utente"; // Importiamo il tipo per l'utente
import dotenv from "dotenv";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

interface SmallListProps {
  users: Utente[]; // Cambiato da user singolo ad array di users
  onUserSelect?: (user: Utente) => void; // Solo questa prop è necessaria
}

const SmallList = ({ users, onUserSelect }: SmallListProps) => {
  return (
    <Card className="max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Utenti{" "}
        </h5>
        <a
          href="#"
          className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          Vedi tutti
        </a>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <li
            key={user._id}
            className="py-3 sm:py-4"
            onClick={() => onUserSelect && onUserSelect(user)}
            style={{ cursor: onUserSelect ? 'pointer' : 'default' }}
            >
              <div className="flex items-center space-x-4">
                {onUserSelect && (
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                <div className="shrink-0">
                  <Image
                    alt={`${user.nome} ${user.cognome}`}
                    height="32"
                    src={user.immagineProfilo || "/images/avatars/profilo.webp"}
                    width="32"
                    className="rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {user.nome} {user.cognome}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {user.telefono}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default SmallList;
