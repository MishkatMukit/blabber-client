# Blabber

> Less lurking, more talking.

Blabber is a full-stack social discussion platform where users can share thoughts ("blabs"), react to them with "applause", reply with "echoes", and explore what the community is talking about. It features Firebase authentication, a secured REST API, personal dashboards, and a modern, animated UI.

## Screenshot

<!-- Replace the path below with an actual screenshot of the running app -->
<!-- ![Blabber Screenshot](./src/assets/logo.png) -->

> Add a screenshot at `src/assets/screenshot.png` and update the path above to display the app preview here.

## Tech Stack

- **React 19** — UI library
- **Vite 7** — build tool & dev server (HMR)
- **Tailwind CSS 4** + **daisyUI 5** — styling & component library
- **Firebase Authentication** — email/password & Google sign-in
- **Firebase Hosting** — deployment
- **React Router 7** — client-side routing with protected routes
- **TanStack React Query 5** — server-state management, caching & mutations
- **Axios** — HTTP client with JWT interceptors
- **Motion** — animations
- **React Toastify / SweetAlert2** — notifications & alerts

## Key Features

- **Authentication** — Register, log in, and log out with email/password + Google sign-in
- **JWT-Secured API** — Axios attaches Firebase ID tokens and auto-logs-out on 401/403
- **Create Blabs** — Post new blabs via a rich text composer with emoji support
- **Browse All Blabs** — Explore the full community feed
- **Blab Details** — View a single blab with its echoes (replies)
- **Applause** — Like blabs and echoes with optimistic React Query mutations
- **Dashboard** — Manage your own blabs (My Blabs)
- **User Profiles** — Visit individual user dashboards
- **Protected Routes** — Private pages guarded by authentication
- **Polished UX** — Skeleton loaders, Lottie animations, responsive glassmorphism UI

## Project Structure

```
src/
├── API/            # React Query data hooks (blabs, echoes, my blabs)
├── Components/     # Auth, Cards, Dashboard, Shared UI (Navbar, Composer, Skeletons)
├── Firebase/       # Firebase initialization
├── Hooks/          # useAuth, useAxiosPublic, useAxiosSecure, useApplause, etc.
├── Layouts/        # MainLayout
├── Pages/          # Home, AllBlabs, AddBlabs, BlabDetails, Dashboard, UserDashboard
├── Provider/       # AuthProvider (auth context)
├── Router/         # App routes
└── Routes/         # PrivateRoute guard
```

## Dependencies

### Runtime

| Package | Purpose |
| --- | --- |
| `react`, `react-dom` | Core UI library |
| `react-router` | Client-side routing |
| `firebase` | Authentication |
| `@tanstack/react-query` | Server-state management & mutations |
| `axios` | HTTP client |
| `tailwindcss`, `@tailwindcss/vite` | Styling |
| `motion` | Animations |
| `lottie-react`, `react-loading-skeleton` | Loading UI |
| `emoji-picker-react` | Emoji picker for composer |
| `react-icons` | Icons |
| `react-toastify`, `sweetalert2` | Notifications & alerts |
| `react-helmet-async` | Document head management |

### Dev

| Package | Purpose |
| --- | --- |
| `vite`, `@vitejs/plugin-react` | Build tooling |
| `eslint` + plugins | Linting |
| `daisyui` | Tailwind component library |
| `@types/react`, `@types/react-dom`, `globals` | Type definitions |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A [Firebase](https://firebase.google.com/) project (for authentication)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/MishkatMukit/blabber-client.git
   cd blabber-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   Update the Firebase config in `src/Firebase/firebase.init.js` with your own project credentials.

4. **Configure the API base URL**

   The client talks to the backend defined in `src/Hooks/useAxiosPublic.jsx` and `src/Hooks/useAxiosSecure.jsx`. Point these to your server (defaults to the hosted API, with a commented-out `http://localhost:3000` for local development).

5. **Run the development server**

   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:5173` by default.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

### Deployment (Firebase Hosting)

```bash
npm run build
firebase deploy
```

## Links

- **Live Demo:** [https://blabber404.web.app](https://blabber404.web.app)
- **GitHub Repository:** [MishkatMukit/blabber-client](https://github.com/MishkatMukit/blabber-client)
- **API Base URL:** [https://blabber-server.vercel.app](https://blabber-server.vercel.app)
