/** @format */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../app/redux/slices/authSlice";

import Link from "next/link";
import dotenv from "dotenv";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

export function LoginForm2({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: any) => state.auth);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    try {
      dispatch(loginStart());
      const url = `${LOCAL_HOST}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Credenziali non valide");
      }

      const data = await response.json();

      if (data.status === "ok") {
        dispatch(loginSuccess(data));
        setIsSuccess(true);
        console.log("Informazioni utente:", data);
        console.log("data access_token da LOGINFORM: ", data.access_token);
      } else {
        throw new Error("Login fallito");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      dispatch(loginFailure("Email o password non valide"));
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold">Accedi al tuo account</h2>
        <p className="text-balance text-sm text-muted-foreground">
          Inserisci la tua email qui sotto per accedere al tuo account
        </p>
      </div>
      <div className="grid gap-6">
        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Accesso effettuato con successo!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nome@esempio.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Password dimenticata?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          className={cn(
            "font-semibold",
            isSuccess && "bg-green-600 hover:bg-green-700"
          )}
          disabled={isLoading}
        >
          {isLoading
            ? "Accesso in corso..."
            : isSuccess
            ? "Accesso effettuato"
            : "Accedi"}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Oppure continua con
          </span>
        </div>
      </div>
      <div className="text-center text-sm">
        Non hai un account?{" "}
        <Link href="/register-user" className="underline underline-offset-4">
          Registrati
        </Link>
      </div>
    </form>
  );
}
