# Participium

**Participium** è una piattaforma web di **Civic Tech** per la segnalazione, il tracciamento e la risoluzione partecipata dei disservizi urbani.

La piattaforma permette ai cittadini di **segnalare problemi sul territorio**, geolocalizzandoli e corredandoli di descrizioni e fotografie. Gli operatori comunali e le aziende di manutenzione possono quindi gestire le segnalazioni attraverso un **workflow strutturato a stati**, dalla presa in carico fino alla risoluzione.

---

## 📑 Indice

- [Participium](#participium)
  - [📑 Indice](#-indice)
  - [🏗 Architettura del Sistema](#-architettura-del-sistema)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
    - [Object Storage](#object-storage)
  - [👥 Modello dei Ruoli e Permessi](#-modello-dei-ruoli-e-permessi)
  - [⚡ Funzionalità Principali](#-funzionalità-principali)
    - [1. Autenticazione e Verifica Email](#1-autenticazione-e-verifica-email)
    - [2. Macchina a Stati delle Segnalazioni](#2-macchina-a-stati-delle-segnalazioni)
    - [3. Mappa e Georeferenziazione](#3-mappa-e-georeferenziazione)
    - [4. Storage Multimediale con MinIO](#4-storage-multimediale-con-minio)
    - [5. Assegnazione Operativa alle Aziende](#5-assegnazione-operativa-alle-aziende)
    - [6. Aggiornamenti Real-Time — WebSocket](#6-aggiornamenti-real-time--websocket)
  - [🛠 Stack Tecnologico](#-stack-tecnologico)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
  - [📡 Specifiche API e WebSocket](#-specifiche-api-e-websocket)
    - [Swagger / OpenAPI](#swagger--openapi)
    - [Autenticazione](#autenticazione)
    - [Segnalazioni](#segnalazioni)
    - [File e Media](#file-e-media)
    - [Gestione Interna](#gestione-interna)
    - [WebSocket](#websocket)
- [🚀 Installazione e Configurazione](#-installazione-e-configurazione)
  - [Prerequisiti](#prerequisiti)
  - [1. Avvio dell'infrastruttura Docker](#1-avvio-dellinfrastruttura-docker)
    - [Porte utilizzate](#porte-utilizzate)
  - [2. Avvio del Backend](#2-avvio-del-backend)
  - [3. Avvio del Frontend](#3-avvio-del-frontend)
- [🔐 Variabili d'Ambiente](#-variabili-dambiente)
- [🧪 Testing e Qualità del Software](#-testing-e-qualità-del-software)
    - [Test](#test)
    - [Coverage](#coverage)
    - [WebSocket Smoke Test](#websocket-smoke-test)
    - [Linting](#linting)
    - [Code Formatting](#code-formatting)
- [📁 Struttura del Repository](#-struttura-del-repository)
    - [Backend — principali directory](#backend--principali-directory)
    - [Frontend — principali directory](#frontend--principali-directory)
  - [📌 Stato del Progetto](#-stato-del-progetto)

---

## 🏗 Architettura del Sistema

Participium utilizza un'architettura **Client-Server** scalabile e disaccoppiata.

### Frontend

Una **Single Page Application (SPA)** sviluppata con React e TypeScript che gestisce:

* interfaccia utente;
* mappa interattiva;
* creazione delle segnalazioni;
* visualizzazione dei ticket;
* dashboard operative.

### Backend

Un backend **REST API** sviluppato con Node.js, Express e TypeScript.

Il backend gestisce:

* logica di business;
* autenticazione e autorizzazione;
* gestione delle segnalazioni;
* gestione degli utenti e dei ruoli;
* gestione delle aziende;
* gestione degli allegati;
* comunicazioni real-time tramite WebSocket.

### Database

**PostgreSQL** viene utilizzato come database relazionale per la persistenza di:

* utenti;
* ruoli;
* categorie;
* aziende;
* segnalazioni.

Il database viene inizializzato tramite migrazioni e seed.

### Object Storage

**MinIO** viene utilizzato come object storage compatibile con S3 per l'archiviazione degli allegati multimediali associati alle segnalazioni.

---

## 👥 Modello dei Ruoli e Permessi

L'accesso alle funzionalità della piattaforma è regolato attraverso ruoli specifici.

| Ruolo            | Descrizione                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Citizen**      | Crea segnalazioni geolocalizzate con immagini, visualizza i ticket pubblici sulla mappa e consulta lo storico delle proprie segnalazioni. |
| **InternalUser** | Esegue il triage delle segnalazioni, approva o rifiuta i ticket e assegna gli interventi ai reparti o alle aziende incaricate.            |
| **Company**      | Visualizza le segnalazioni assegnate alla propria organizzazione e aggiorna lo stato dell'intervento fino alla risoluzione.               |
| **Admin**        | Gestisce utenti interni, ruoli di sistema e categorie dei disservizi.                                                                     |

---

## ⚡ Funzionalità Principali

### 1. Autenticazione e Verifica Email

Il sistema implementa un processo completo di autenticazione:

* registrazione degli account;
* validazione dei dati tramite `authController`;
* verifica dell'indirizzo email tramite token monouso;
* gestione della verifica tramite `emailVerificationController`;
* autenticazione tramite **JWT (JSON Web Token)**;
* middleware per la protezione delle rotte;
* controllo degli accessi basato sui ruoli.

---

### 2. Macchina a Stati delle Segnalazioni

Ogni segnalazione segue un ciclo di vita definito attraverso le costanti `ReportStatus.ts` e `StatusTransitions.ts`.

| Stato              | Significato                                                  | Transizioni possibili         |
| ------------------ | ------------------------------------------------------------ | ----------------------------- |
| **PENDING**        | Segnalazione appena inserita dal cittadino                   | `APPROVATA`, `RIFIUTATA`      |
| **APPROVATA**      | Segnalazione validata dall'amministrazione                   | `ASSEGNATA`, `IN_LAVORAZIONE` |
| **ASSEGNATA**      | Segnalazione presa in carico da un'azienda o squadra tecnica | `IN_LAVORAZIONE`, `SOSPESA`   |
| **IN_LAVORAZIONE** | Intervento di ripristino in corso                            | `RISOLTA`, `SOSPESA`          |
| **SOSPESA**        | Intervento temporaneamente sospeso                           | `IN_LAVORAZIONE`              |
| **RISOLTA**        | Intervento completato con successo                           | Chiusura ticket               |
| **RIFIUTATA**      | Segnalazione archiviata perché non valida o duplicata        | Chiusura ticket               |

Il file `ReportViewContext.ts` gestisce inoltre il **contesto di esposizione dei dati**, adattando le informazioni mostrate in base alla prospettiva:

* vista pubblica;
* vista cittadino;
* dashboard operativa.

---

### 3. Mappa e Georeferenziazione

La piattaforma integra una mappa interattiva che permette di:

* visualizzare le segnalazioni tramite marker;
* distinguere le segnalazioni in base alla categoria;
* selezionare una posizione direttamente sulla mappa;
* ricercare un indirizzo tramite ricerca testuale;
* filtrare le segnalazioni per stato;
* filtrare per categoria;
* applicare filtri geografici.

---

### 4. Storage Multimediale con MinIO

Gli allegati fotografici delle segnalazioni vengono gestiti attraverso **MinIO**.

Le funzionalità principali comprendono:

* upload delle immagini tramite `fileController`;
* validazione degli allegati;
* integrazione con un client S3-compatible;
* creazione automatica del bucket durante l'inizializzazione;
* recupero controllato delle immagini tramite URL dedicati.

I componenti principali coinvolti sono:

```text
initMinio.ts
minioClient.ts
fileController.ts
```

---

### 5. Assegnazione Operativa alle Aziende

Il sistema permette di gestire le aziende incaricate degli interventi di manutenzione.

Le funzionalità comprendono:

* gestione delle anagrafiche delle aziende;
* gestione degli appalti di manutenzione;
* assegnazione delle segnalazioni;
* inoltro della segnalazione all'azienda competente in base al territorio o alla categoria.

La logica relativa alla gestione delle aziende è implementata principalmente attraverso `companyController`.

---

### 6. Aggiornamenti Real-Time — WebSocket

Participium integra un sistema di comunicazione **real-time** tramite WebSocket.

Il server WebSocket è integrato in `server.ts` e permette di notificare tempestivamente i client quando si verificano eventi rilevanti.

Gli eventi principali includono:

```text
REPORT_CREATED
REPORT_STATUS_CHANGED
REPORT_ASSIGNED
```

È inoltre disponibile uno smoke test per verificare rapidamente la connettività WebSocket:

```bash
node scripts/ws-smoke.js
```

---

## 🛠 Stack Tecnologico

### Backend

| Tecnologia            | Utilizzo                     |
| --------------------- | ---------------------------- |
| **Node.js**           | Runtime                      |
| **TypeScript**        | Linguaggio                   |
| **Express.js**        | Framework backend            |
| **PostgreSQL**        | Database relazionale         |
| **MinIO**             | Object Storage S3-compatible |
| **ws**                | WebSocket / eventi real-time |
| **Swagger / OpenAPI** | Documentazione API           |
| **Jest**              | Testing                      |
| **ESLint**            | Linting                      |
| **Prettier**          | Code formatting              |

Versione Node.js supportata:

```text
Node.js >= 18
```

### Frontend

| Tecnologia        | Utilizzo                       |
| ----------------- | ------------------------------ |
| **React**         | Framework frontend             |
| **TypeScript**    | Linguaggio                     |
| **Leaflet**       | Mappe                          |
| **React-Leaflet** | Integrazione Leaflet con React |
| **Axios**         | Comunicazione REST             |
| **WebSocket**     | Comunicazione real-time        |
| **Tailwind CSS**  | Styling                        |
| **Bootstrap**     | UI e componenti                |

---

## 📡 Specifiche API e WebSocket

### Swagger / OpenAPI

Una volta avviato il backend, la documentazione interattiva delle API è disponibile all'indirizzo:

```text
http://localhost:5000/api-docs
```

### Autenticazione

| Metodo | Endpoint                        | Descrizione                     |
| ------ | ------------------------------- | ------------------------------- |
| `POST` | `/api/auth/register`            | Registrazione cittadino         |
| `POST` | `/api/auth/login`               | Login e rilascio JWT            |
| `GET`  | `/api/auth/verify-email`        | Verifica dell'indirizzo email   |
| `POST` | `/api/auth/resend-verification` | Reinoltro del token di verifica |

### Segnalazioni

| Metodo  | Endpoint                  | Descrizione                      |
| ------- | ------------------------- | -------------------------------- |
| `GET`   | `/api/reports`            | Recupero segnalazioni con filtri |
| `GET`   | `/api/reports/:id`        | Dettaglio di una segnalazione    |
| `POST`  | `/api/reports`            | Creazione di una segnalazione    |
| `PATCH` | `/api/reports/:id/status` | Aggiornamento dello stato        |
| `PATCH` | `/api/reports/:id/assign` | Assegnazione a un'azienda        |

### File e Media

| Metodo | Endpoint               | Descrizione                 |
| ------ | ---------------------- | --------------------------- |
| `POST` | `/api/files/upload`    | Upload di immagini su MinIO |
| `GET`  | `/api/files/:filename` | Recupero di un allegato     |

### Gestione Interna

| Metodo | Endpoint              | Descrizione                |
| ------ | --------------------- | -------------------------- |
| `GET`  | `/api/internal-users` | Gestione operatori interni |
| `GET`  | `/api/roles`          | Gestione ruoli             |
| `GET`  | `/api/categories`     | Gestione categorie         |
| `GET`  | `/api/companies`      | Gestione aziende           |

### WebSocket

Endpoint:

```text
ws://localhost:5000/ws
```

Eventi supportati:

```text
REPORT_CREATED
REPORT_STATUS_CHANGED
REPORT_ASSIGNED
```

---

# 🚀 Installazione e Configurazione

## Prerequisiti

Prima di avviare il progetto assicurarsi di avere installato:

* **Node.js >= 18**
* **Docker**
* **Docker Compose**

---

## 1. Avvio dell'infrastruttura Docker

Entrare nella directory del backend e avviare i servizi di supporto:

```bash
cd Back-end
docker compose up -d
```

L'infrastruttura comprende principalmente:

* PostgreSQL
* MinIO

### Porte utilizzate

| Servizio      | Endpoint                |
| ------------- | ----------------------- |
| PostgreSQL    | `localhost:5432`        |
| MinIO API     | `localhost:9000`        |
| MinIO Console | `http://localhost:9001` |

La **MinIO Console** permette di accedere alla dashboard amministrativa dello storage.

---

## 2. Avvio del Backend

Entrare nella directory del backend:

```bash
cd Back-end
```

Creare il file `.env` partendo dal template:

```bash
cp .env.example .env
```

Installare le dipendenze:

```bash
npm install
```

Eseguire il seed iniziale:

```bash
npm run seed
```

oppure eseguire direttamente lo script:

```text
1_InitialSeed.ts
```

Avviare il server in modalità sviluppo:

```bash
npm run dev
```

Il backend sarà disponibile su:

```text
http://localhost:5000
```

---

## 3. Avvio del Frontend

Entrare nella directory frontend:

```bash
cd ../Front-end
```

Installare le dipendenze:

```bash
npm install
```

Configurare le variabili d'ambiente nel file `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws
```

Avviare il client:

```bash
npm run dev
```

Il frontend sarà disponibile su:

```text
http://localhost:5173
```

---

# 🔐 Variabili d'Ambiente

Il backend utilizza un file `.env` per la configurazione dell'applicazione.

| Variabile           | Descrizione                               | Valore di esempio            |
| ------------------- | ----------------------------------------- | ---------------------------- |
| `PORT`              | Porta HTTP del backend                    | `5000`                       |
| `NODE_ENV`          | Profilo di esecuzione                     | `development` / `production` |
| `DB_HOST`           | Host PostgreSQL                           | `localhost`                  |
| `DB_PORT`           | Porta PostgreSQL                          | `5432`                       |
| `DB_USER`           | Username PostgreSQL                       | `postgres`                   |
| `DB_PASSWORD`       | Password PostgreSQL                       | `postgres`                   |
| `DB_NAME`           | Nome del database                         | `participium_db`             |
| `JWT_SECRET`        | Chiave segreta utilizzata per i token JWT | `stringa_segreta`            |
| `JWT_EXPIRES_IN`    | Durata di validità del token              | `1d`                         |
| `MINIO_ENDPOINT`    | Host MinIO                                | `localhost`                  |
| `MINIO_PORT`        | Porta MinIO                               | `9000`                       |
| `MINIO_ACCESS_KEY`  | Access Key MinIO                          | `minioadmin`                 |
| `MINIO_SECRET_KEY`  | Secret Key MinIO                          | `minioadmin`                 |
| `MINIO_BUCKET_NAME` | Bucket per le immagini                    | `participium-reports`        |

> **Nota:** i valori riportati sono valori di esempio per l'ambiente locale. In un ambiente di produzione è necessario utilizzare credenziali e secret appropriati.

---

# 🧪 Testing e Qualità del Software

Il progetto adotta un approccio Agile e include materiale relativo alle retrospettive e alla copertura dei test nella directory:

```text
Retrospective/
```

Sono presenti documenti relativi agli sprint **1–4**.

### Test

Eseguire unit test e integration test:

```bash
npm test
```

### Coverage

Calcolare la coverage:

```bash
npm run test:coverage
```

### WebSocket Smoke Test

Verificare la connettività WebSocket:

```bash
node scripts/ws-smoke.js
```

### Linting

```bash
npm run lint
```

### Code Formatting

```bash
npm run format
```

---

# 📁 Struttura del Repository

```text
Participium/
│
├── Back-end/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── initMinio.ts
│   │   │   ├── minioClient.ts
│   │   │   └── swagger.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── ReportStatus.ts
│   │   │   ├── ReportViewContext.ts
│   │   │   └── StatusTransitions.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── citizenController.ts
│   │   │   ├── companyController.ts
│   │   │   ├── emailVerificationController.ts
│   │   │   ├── fileController.ts
│   │   │   ├── InternalUserController.ts
│   │   │   ├── reportController.ts
│   │   │   └── roleController.ts
│   │   │
│   │   ├── data/
│   │   │   ├── migrations/
│   │   │   └── seed/
│   │   │       └── images/
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── scripts/
│   │   └── ws-smoke.js
│   │
│   ├── Retrospective/
│   │
│   ├── Dockerfile
│   ├── docker-compose.yaml
│   ├── jest.config.js
│   ├── eslint.config.mjs
│   └── package.json
│
├── Front-end/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── package.json
│   └── index.html
│
└── README.md
```

### Backend — principali directory

| Directory          | Responsabilità                                   |
| ------------------ | ------------------------------------------------ |
| `config/`          | Configurazione database, MinIO e Swagger         |
| `constants/`       | Stati, transizioni e contesti di visualizzazione |
| `controllers/`     | Controller delle API REST                        |
| `data/migrations/` | Migrazioni e inizializzazione del database       |
| `data/seed/`       | Dati iniziali e asset fotografici                |
| `scripts/`         | Script di supporto e smoke test                  |
| `Retrospective/`   | Documentazione delle retrospettive degli sprint  |

### Frontend — principali directory

| Directory     | Responsabilità                                       |
| ------------- | ---------------------------------------------------- |
| `components/` | Componenti UI, marker, modali, form e navigation bar |
| `pages/`      | Pagine della mappa, form di segnalazione e dashboard |
| `services/`   | Comunicazione con le API e gestione WebSocket        |
| `types/`      | Tipi e interfacce TypeScript                         |

---

## 📌 Stato del Progetto

Participium integra in un'unica piattaforma:

* segnalazioni urbane geolocalizzate;
* autenticazione e autorizzazione;
* gestione dei ruoli;
* workflow a stati;
* assegnazione degli interventi;
* gestione delle aziende;
* storage delle immagini;
* mappa interattiva;
* API REST;
* documentazione Swagger/OpenAPI;
* comunicazione real-time tramite WebSocket;
* test e strumenti di qualità del codice.
