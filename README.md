# Blabber

> Less lurking, more talking.

Blabber is a social discussion platform where users can share thoughts, join conversations, and build communities. Post your "blabs", react with "echoes", and explore trending topics across the community.


> Add a screenshot at `src/assets/screenshot.png` (or update the path above) to display the app preview here.

## Tech Stack

- **React 19** — UI library
- **Vite 8** — build tool & dev server (HMR)
- **Tailwind CSS 4** + **daisyUI 5** — styling & component library
- **Firebase Authentication** — email/password & Google sign-in
- **React Router 7** — client-side routing
- **Motion** — animations
- **shadcn** — UI primitives

## Key Features

- **Authentication** — Register, log in, and log out with email/password
- **Google Sign-In** — One-click login via Google
- **Animated Feed Preview** — Live, motion-driven post cards on the landing page
- **Responsive UI** — Mobile-first layout built with Tailwind CSS and daisyUI
- **Glassmorphism Design** — Modern frosted-glass navbar and cards
- **404 Handling** — Custom error page for unknown routes

## Dependencies

### Runtime

| Package | Purpose |
| --- | --- |
| `react`, `react-dom` | Core UI library |
| `react-router` | Client-side routing |
| `firebase` | Authentication |
| `tailwindcss`, `@tailwindcss/vite` | Styling |
| `daisyui` | Tailwind component library |
| `motion` | Animations |
| `lottie-react` | Lottie animations |
| `lucide-react`, `react-icons` | Icons |
| `sweetalert2` | Alerts & modals |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Class utilities |

### Dev

| Package | Purpose |
| --- | --- |
| `vite`, `@vitejs/plugin-react` | Build tooling |
| `eslint` + plugins | Linting |
| `shadcn`, `tw-animate-css` | UI utilities |
| `@types/*`, `globals` | Type definitions |

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

   Update the Firebase config in `src/Firebase/firebase.init.js` with your own project credentials, or move them into environment variables:

   ```js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   ```

4. **Run the development server**

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

## Links

- **Live Demo:** _Coming soon_
- **GitHub Repository:** [MishkatMukit/blabber-client](https://github.com/MishkatMukit/blabber-client)
