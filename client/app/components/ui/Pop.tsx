// client/app/components/ui/Pop.tsx

import React from 'react';
import { Toast } from "flowbite-react";
import { JSX } from 'react/jsx-dev-runtime';

interface PopProps {
  message: string; // Messaggio da visualizzare
  icon: JSX.Element; // Icona da visualizzare
  color: string; // Colore del toast
}

const Pop: React.FC<PopProps> = ({ message, icon, color }) => {
  return (
    <Toast>
      {icon}
      <div className={`pl-4 text-sm font-normal text-${color}`}>
        {message}
      </div>
    </Toast>
  );
}

export default Pop;