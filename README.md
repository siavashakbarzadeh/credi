# Credi - Piattaforma di Gestione Prestiti

Sistema di gestione pratiche di prestito per istituti di credito in Italia.

## Stack tecnologico

| Componente | Tecnologia |
|-----------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Fastify 5, TypeScript |
| Database | PostgreSQL 16, Prisma ORM |
| Cache / Jobs | Redis 7, BullMQ |
| Realtime | Socket.IO |
| Google | Google Docs API, Google Drive API, OAuth 2.0 |
| State | TanStack Query, React Hook Form, Zod |

## Struttura del progetto

```
credi/
├── apps/
│   ├── backend/       # Server Fastify + Prisma + Socket.IO
│   └── frontend/      # Applicazione Next.js
├── packages/
│   └── shared-types/  # Tipi e schemi Zod condivisi
├── docker-compose.yml
├── .env.example
└── README.md
```

## Prerequisiti

- Node.js >= 20
- npm >= 10
- Docker e Docker Compose
- Google Cloud Console (per integrazione Google Docs)

## Setup rapido

### 1. Installare le dipendenze

```bash
npm install
```

### 2. Avviare PostgreSQL e Redis

```bash
docker-compose up -d
```

### 3. Configurare le variabili d'ambiente

```bash
cp .env.example .env
# Modificare .env con le tue configurazioni
```

Copiare anche i file di env nelle singole app:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

### 4. Eseguire le migrazioni del database

```bash
npm run db:migrate
```

### 5. Popolare il database con dati di esempio

```bash
npm run db:seed
```

### 6. Avviare l'applicazione

```bash
npm run dev
```

Il frontend sarà disponibile su http://localhost:3000 e il backend su http://localhost:3001.

## Credenziali di test (dopo seed)

| Ruolo | Email | Password |
|-------|-------|----------|
| Admin | admin@credi.it | admin123 |
| Responsabile | responsabile@credi.it | password123 |
| Consulente | consulente1@credi.it | password123 |
| Consulente | consulente2@credi.it | password123 |
| Revisore | revisore@credi.it | password123 |

## Variabili d'ambiente

### Backend

| Variabile | Descrizione |
|-----------|------------|
| `NODE_ENV` | Ambiente (development/production) |
| `PORT` | Porta del server (default: 3001) |
| `DATABASE_URL` | URL di connessione PostgreSQL |
| `REDIS_URL` | URL di connessione Redis |
| `JWT_SECRET` | Segreto per i JWT access token |
| `JWT_REFRESH_SECRET` | Segreto per i JWT refresh token |
| `FRONTEND_URL` | URL del frontend (per CORS) |
| `BACKEND_URL` | URL del backend (per webhook) |
| `GOOGLE_CLIENT_ID` | ID client Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Secret client Google OAuth |
| `GOOGLE_REDIRECT_URI` | URI di callback Google OAuth |
| `GOOGLE_WEBHOOK_ADDRESS` | URL webhook Google Drive |

### Frontend

| Variabile | Descrizione |
|-----------|------------|
| `NEXT_PUBLIC_API_URL` | URL dell'API backend |
| `NEXT_PUBLIC_APP_LOCALE` | Locale dell'applicazione |
| `NEXT_PUBLIC_WS_URL` | URL WebSocket per Socket.IO |

## Configurazione Google Cloud Console

### 1. Creare un progetto

1. Andare su https://console.cloud.google.com
2. Creare un nuovo progetto denominato "Credi"
3. Abilitare le API:
   - Google Docs API
   - Google Drive API

### 2. Configurare OAuth 2.0

1. Andare su "API e servizi" > "Credenziali"
2. Creare un client ID OAuth 2.0
3. Tipo applicazione: "Applicazione web"
4. URI di reindirizzamento autorizzati: `http://localhost:3001/api/auth/google/callback`
5. Copiare Client ID e Client Secret nelle variabili d'ambiente

### 3. Configurare Google Drive Push Notifications

1. Abilitare Google Drive API
2. Configurare un endpoint webhook HTTPS pubblico
3. Per lo sviluppo locale, utilizzare un servizio come ngrok:
   ```bash
   ngrok http 3001
   ```
4. Impostare `GOOGLE_WEBHOOK_ADDRESS` con l'URL pubblico

**Nota**: Le notifiche push di Google Drive richiedono un endpoint HTTPS accessibile pubblicamente. In sviluppo locale, utilizzare ngrok o simili.

### 4. Testare l'integrazione

1. Accedere all'applicazione
2. Andare su Impostazioni > Connessione Google
3. Cliccare "Collega account Google"
4. Autorizzare l'accesso
5. Creare una pratica e collegare un documento Google
6. Modificare il documento Google per verificare le notifiche

## Funzionalità implementate

### Gestione pratiche
- [x] Creazione pratica multi-step con 8 sezioni
- [x] Elenco pratiche con ricerca e filtri
- [x] Dettaglio pratica completo con tabs
- [x] Modifica pratica
- [x] Eliminazione soft
- [x] Storia stati con motivazione

### Workflow
- [x] Bozza → Sottoposta → In revisione → Documenti in attesa → Verifica documentale → Approvata / Rifiutata → Erogata → Chiusa
- [x] Aggiornamento stato con motivazione
- [x] Assegnazione consulente

### Documenti
- [x] Caricamento documenti multiplo
- [x] Checklist documenti mancanti
- [x] Stato documento (in attesa, ricevuto, verificato, rifiutato)

### Google Docs
- [x] Creazione documento Google per pratica
- [x] Collegamento documento Google esistente
- [x] Monitoraggio modifiche con Drive Push Notifications
- [x] Rinnovo automatico watch channel con BullMQ
- [x] Notifiche real-time al modifica del documento

### Notifiche
- [x] Notifiche in-app con stato letto/non letto
- [x] Notifiche real-time via Socket.IO
- [x] Toast notification in Italiano

### Interfaccia
- [x] Dashboard con statistiche
- [x] Dark mode
- [x] Responsive design
- [x] TUTTO in Italiano
- [x] Form multi-step per creazione pratica
- [x] Timeline attività
- [x] Note interne

### Privacy / GDPR
- [x] Record di consenso nel database
- [x] Sezione consenso nel form
- [x] Testi in italiano conformi

### Sicurezza
- [x] JWT access + refresh token
- [x] Cookie HTTP-only
- [x] Autenticazione richiesta su tutte le API
- [x] Rate limiting
- [x] Validazione input con Zod
- [x] Google API solo lato backend

### Database
- [x] 16 modelli Prisma
- [x] Enum per tutti gli stati
- [x] Indici per performance
- [x] Relazioni referenziali
- [x] Soft delete
- [x] Audit trail

### Backend
- [x] Moduli Fastify separati
- [x] Servizi, controller, routes
- [x] Middleware autenticazione e ruoli
- [x] Gestione errori centralizzata
- [x] Logging strutturato
- [x] BullMQ per job in background

## API Endpoints

| Methodo | Endpoint | Descrizione |
|---------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Profilo utente |
| GET | `/api/applications` | Elenco pratiche |
| POST | `/api/applications` | Crea pratica |
| GET | `/api/applications/:id` | Dettaglio pratica |
| PATCH | `/api/applications/:id` | Modifica pratica |
| PATCH | `/api/applications/:id/status` | Aggiorna stato |
| POST | `/api/applications/:id/assign` | Assegna pratica |
| GET | `/api/applications/:id/activity` | Attività |
| GET | `/api/applications/:id/notes` | Note interne |
| POST | `/api/applications/:id/notes` | Aggiungi nota |
| POST | `/api/applications/:id/documents` | Carica documento |
| GET | `/api/applications/:id/documents` | Elenco documenti |
| POST | `/api/applications/:id/google-doc/create` | Crea Google Doc |
| POST | `/api/applications/:id/google-doc/link` | Collega Google Doc |
| GET | `/api/applications/:id/google-doc` | Info Google Doc |
| POST | `/api/applications/:id/google-doc/watch` | Attiva monitoraggio |
| GET | `/api/notifications` | Elenco notifiche |
| PATCH | `/api/notifications/:id/read` | Segna come letta |
| PATCH | `/api/notifications/read-all` | Segna tutte lette |
| POST | `/api/webhooks/google-drive` | Webhook Google Drive |
| GET | `/api/health` | Health check |

## Licenza

Progetto privato.
