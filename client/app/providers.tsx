/** @format */

// app/providers.tsx
"use client";
import { Provider } from "react-redux";
import store from "./redux/store/store";

interface ProvidersProps {
  children: React.ReactNode;
}

export function StoreProviders({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
