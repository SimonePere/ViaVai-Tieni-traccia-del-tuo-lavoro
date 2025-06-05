/** @format */

"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start px-4 py-6 md:px-8 lg:px-16 max-w-6xl mx-auto w-full space-y-10">
      {/* HERO + Immagine */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            ViaVai — L&apos;app per chi lavora in movimento 🚚
          </h1>
          <p className="text-muted-foreground text-lg">
            Traccia in modo semplice consegne, installazioni e incassi. Tutto in
            un&apos;unica app pensata per lavoratori sul campo.
          </p>
          <div className="flex gap-4 mt-4">
            <Button asChild>
              <Link href="/login-user">🔐 Accedi</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register-user">📝 Registrati</Link>
            </Button>
          </div>
        </div>

        <Image
          src="/images/backgrounds/undraw_data-reports_l2u3.svg"
          alt="Hero Illustration"
          className="w-full max-w-md"
          width={500}
          height={500}
        />
      </section>

      {/* Alert Benvenuto */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle className="text-lg font-bold">
          Benvenuto su ViaVai!
        </AlertTitle>
        <AlertDescription>
          L&apos;app pensata per chi lavora in movimento. Tieni traccia di
          consegne, installazioni e incassi in pochi clic. Accedi o registrati
          per iniziare subito!
        </AlertDescription>
      </Alert>

      {/* Tabs descrittivi */}
      <section className="w-full rounded-lg border p-4 md:p-6 bg-muted/50">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger className="w-full" value="overview">
              🚀 Cos&apos;è ViaVai
            </TabsTrigger>
            <TabsTrigger className="w-full" value="features">
              🛠 Funzionalità
            </TabsTrigger>
            <TabsTrigger className="w-full" value="workflow">
              📋 Come funziona
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <p className="text-muted-foreground">
              <strong>ViaVai</strong> è il tuo alleato quotidiano se lavori nel
              mondo delle consegne o delle installazioni. Ti aiuta a{" "}
              <span className="font-medium">gestire il lavoro</span> in modo
              ordinato e automatico, così puoi concentrarti su ciò che conta
              davvero.
            </p>
          </TabsContent>

          <TabsContent value="features" className="pt-4">
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>📆 Registro consegne e installazioni con pochi tocchi</li>
              <li>🧾 Monitoraggio ore lavorate e giorni attivi</li>
              <li>💰 Calcolo automatico incassi mensili</li>
              <li>
                📍 Integrazione futura con mappe e ottimizzazione percorsi
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="workflow" className="pt-4">
            <p className="text-muted-foreground">
              1. <strong>Registrati</strong> per creare il tuo profilo
              <br />
              2. <strong>Accedi</strong> e inizia a registrare ogni lavoro
              svolto
              <br />
              3. <strong>Consulta</strong> i tuoi dati, incassi e attività in
              tempo reale
            </p>
          </TabsContent>
        </Tabs>
      </section>

      {/* Sezione Vantaggi */}
      <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 mt-6 w-full">
        <Card>
          <CardHeader>
            <CardTitle>📱 Tutto dal tuo smartphone</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            ViaVai è pensato per funzionare anche dal tuo telefono, senza
            complicazioni.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>⏱ Zero perdite di tempo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Aggiungi lavori in pochi clic e visualizza i tuoi incassi in tempo
            reale.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>🧠 Pensato per il lavoro sul campo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Nessuna funzione inutile: solo ciò che ti serve davvero per lavorare
            meglio.
          </CardContent>
        </Card>
      </section>

      {/* Testimonianze */}
      <section className="mt-10 space-y-4 w-full">
        <h2 className="text-xl font-semibold text-center">
          📣 Cosa dicono gli utenti
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mario R., tecnico installatore</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              &ldquo;Con ViaVai finalmente riesco a segnarmi tutto in pochi
              secondi. È diventato il mio assistente personale!&rdquo;
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lucia P., corriere freelance</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              &ldquo;Prima perdevo tempo con fogli sparsi. Ora ho tutto sotto
              controllo: lavoro, soldi, orari. Fantastico!&rdquo;
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action finale */}
      <section className="text-center mt-10">
        <h3 className="text-xl font-bold mb-2">Pronto a partire?</h3>
        <p className="text-muted-foreground mb-4">
          Registrati ora e scopri quanto può essere semplice lavorare con
          ViaVai.
        </p>
        <Button size="lg" asChild>
          <Link href="/register-user">🚀 Inizia subito</Link>
        </Button>
      </section>
    </div>
  );
}
