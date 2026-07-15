"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import {
  CreditCard,
  Shield,
  FileText,
  FolderOpen,
  CheckCircle2,
  ArrowRight,
  Lock,
  Users,
  Zap,
  Sparkles,
  Cloud,
  Eye,
} from "lucide-react";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const steps = [
  {
    icon: CreditCard,
    title: "1. Accedi con Google",
    description:
      "Clicca sul pulsante \"Continua con Google\" in alto. Usa il tuo account Google esistente: non serve creare una nuova password. Tutti possono accedere liberamente.",
  },
  {
    icon: Cloud,
    title: "2. Prepara i documenti su Google Docs",
    description:
      "Apri Google Drive e carica i tuoi documenti (carta d'identità, redditi, buste paga). Organizzali in una cartella condivisa o in Google Docs e rendili accessibili.",
  },
  {
    icon: FolderOpen,
    title: "3. Invia la tua richiesta",
    description:
      "Compila il modulo di richiesta prestito all'interno della piattaforma e inserisci i link ai tuoi documenti su Google Docs. Il sistema li leggerà automaticamente.",
  },
  {
    icon: CheckCircle2,
    title: "4. Monitora lo stato",
    description:
      "Tieni traccia dello stato della tua pratica in tempo reale dal pannello di controllo. Riceverai notifiche ad ogni aggiornamento.",
  },
];

const features = [
  {
    icon: Shield,
    title: "Sicuro e protetto",
    description: "I tuoi dati sono protetti con crittografia e autenticazione Google.",
  },
  {
    icon: Users,
    title: "Accessibile a tutti",
    description: "Chiunque abbia un account Google può registrarsi e utilizzare la piattaforma.",
  },
  {
    icon: Zap,
    title: "Veloce e automatico",
    description: "Lettura automatica dei documenti e calcolo immediato dell'idoneità.",
  },
  {
    icon: Cloud,
    title: "Integrazione Google Docs",
    description: "Carica i documenti su Google Drive e noi li elaboriamo per te.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google/login";
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl animate-float-slow" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl animate-float-medium" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-400/15 blur-3xl animate-float-slow" />
        <div className="absolute right-1/4 bottom-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl animate-float-medium" />
      </div>

      <div className="relative z-10">
        <header
          className={`flex items-center justify-between px-6 py-5 transition-all duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Credi</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Accedi con email
          </Button>
        </header>

        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-12 text-center md:pt-20">
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 transition-all delay-75 duration-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Piattaforma di gestione prestiti online
          </div>

          <h1
            className={`max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 transition-all delay-150 duration-700 dark:text-white md:text-6xl md:leading-tight ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Richiedi il tuo{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">
              prestito
            </span>{" "}
            in pochi minuti
          </h1>

          <p
            className={`mt-6 max-w-2xl text-lg text-muted-foreground transition-all delay-300 duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Gestisci la tua pratica di prestito in modo semplice e veloce. Accedi con Google,
            carica i tuoi documenti e monitora lo stato della richiesta in tempo reale.
          </p>

          <div
            className={`mt-10 flex flex-col items-center gap-4 transition-all delay-500 duration-700 sm:flex-row ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <Button
              size="lg"
              onClick={handleGoogleLogin}
              className="group relative h-14 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40"
            >
              <GoogleIcon className="mr-3 h-5 w-5" />
              Continua con Google
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/login")}
              className="h-14 rounded-xl border-2 px-8 text-base font-semibold"
            >
              Accedi con email
            </Button>
          </div>

          <div
            className={`mt-6 flex items-center gap-6 text-sm text-muted-foreground transition-all delay-700 duration-700 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4" /> Connessione sicura
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> Aperto a tutti
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Senza registrazione
            </span>
          </div>

          <div
            className={`mt-16 grid w-full max-w-5xl gap-4 transition-all delay-1000 duration-700 sm:grid-cols-2 lg:grid-cols-4 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200/60 bg-white/60 p-5 text-left backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 transition-transform group-hover:scale-110">
                  <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Come funziona
            </h2>
            <p className="mt-3 text-muted-foreground">
              Quattro semplici passaggi per richiedere il tuo prestito
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 p-6 backdrop-blur transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 ${
                  mounted ? "animate-fade-up" : ""
                }`}
                style={{ animationDelay: `${1200 + i * 150}ms` }}
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-blue-500/5 to-transparent" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-center text-white shadow-2xl shadow-indigo-500/30 md:p-12">
            <div className="absolute inset-0 animate-gradient-shift bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500" />
            <div className="relative z-10">
              <Cloud className="mx-auto mb-4 h-12 w-12 animate-bounce-subtle" />
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                Documenti su Google Docs
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-blue-50">
                Non serve scaricare o stampare nulla. Carica tutti i tuoi documenti direttamente
                su <strong className="font-bold text-white">Google Drive</strong> e condividi i
                link nella piattaforma. Noi ci occupiamo del resto: il sistema legge e verifica
                automaticamente i tuoi documenti.
              </p>
              <div className="mx-auto grid max-w-2xl gap-3 text-left sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-white/15 p-3 backdrop-blur">
                  <FileText className="h-5 w-5 flex-shrink-0 text-blue-100" />
                  <span className="text-sm">Carta d'identità o passaporto</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/15 p-3 backdrop-blur">
                  <FileText className="h-5 w-5 flex-shrink-0 text-blue-100" />
                  <span className="text-sm">Buste paga o CUD</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/15 p-3 backdrop-blur">
                  <FileText className="h-5 w-5 flex-shrink-0 text-blue-100" />
                  <span className="text-sm">Documentazione reddituale</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/15 p-3 backdrop-blur">
                  <FileText className="h-5 w-5 flex-shrink-0 text-blue-100" />
                  <span className="text-sm">Eventuali garanzie</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/60 p-6 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
              <Eye className="mb-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h3 className="mb-1 font-semibold">Trasparenza totale</h3>
              <p className="text-sm text-muted-foreground">
                Vedi lo stato della tua pratica in ogni momento, senza intermediari.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/60 p-6 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
              <Shield className="mb-3 h-8 w-8 text-green-600 dark:text-green-400" />
              <h3 className="mb-1 font-semibold">Privacy garantita</h3>
              <p className="text-sm text-muted-foreground">
                I tuoi documenti restano sul tuo Google Drive. Nessuna copia locale.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/60 p-6 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
              <Users className="mb-3 h-8 w-8 text-purple-600 dark:text-purple-400" />
              <h3 className="mb-1 font-semibold">Per tutti</h3>
              <p className="text-sm text-muted-foreground">
                Bastano un account Google e i tuoi documenti. Nessun costo nascosto.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-20">
          <div
            className={`rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-10 text-center transition-all dark:border-blue-800 dark:bg-blue-950/30 ${
              mounted ? "animate-scale-in" : ""
            }`}
            style={{ animationDelay: "1400ms" }}
          >
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse-ring rounded-full bg-blue-500" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                  <GoogleIcon className="h-7 w-7" />
                </div>
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-bold">Pronto per iniziare?</h2>
            <p className="mb-6 text-muted-foreground">
              Accedi subito con il tuo account Google. È gratis e ci vogliono pochi secondi.
            </p>
            <Button
              size="lg"
              onClick={handleGoogleLogin}
              className="group h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 text-base font-semibold shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
            >
              <GoogleIcon className="mr-3 h-5 w-5" />
              Continua con Google
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </section>

        <footer className="border-t border-slate-200/60 py-8 text-center dark:border-slate-800">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">Credi</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Piattaforma di gestione pratiche di prestito &middot; Made with care
          </p>
        </footer>
      </div>
    </div>
  );
}
