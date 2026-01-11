# Asset Declaration System (ADS)

A Next.js 16 Progressive Web App (PWA) for public officer asset declarations with **offline-first capabilities**.

## 🌟 Features

- **Offline-First Architecture**: Continue working without internet using IndexedDB (Dexie.js)
- **Multi-Step Declaration Form**: Wizard-style form with auto-save and draft recovery
- **Role-Based Access**: Different dashboards for Officers, Admins, Verifiers, and Super Admins
- **Mock Authentication**: Login system with session persistence
- **PWA Support**: Installable app with service worker caching (Serwist)
- **Modern UI**: Built with Shadcn UI and Tailwind CSS

## 📚 Documentation

- [Technology Stack](./docs/TECHNOLOGY.md) - Framework and library choices
- [Architecture & Offline Strategy](./docs/ARCHITECTURE.md) - System design and data flow
- [Security Considerations](./docs/SECURITY.md) - Frontend security measures

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS, Shadcn UI
- **State**: Redux Toolkit
- **Offline**: Dexie.js (IndexedDB wrapper)
- **Forms**: React Hook Form + Zod
- **PWA**: Serwist
- **Mock API**: json-server

## 🌳 Branch Structure

This project follows a **stacked branch workflow**:

```
main
 └── feature/setup-and-docs
      └── feature/login-ui
           └── feature/offline-declaration
                └── feature/admin-dashboard
```

Each branch builds on the previous one through rebasing.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Application

You need to run **two servers** simultaneously:

#### 1. Start the Mock Backend (Required for Login)
In one terminal:
```bash
pnpm start:backend
```
This runs `json-server` on `http://localhost:4000`

#### 2. Start the Frontend
In another terminal:
```bash
pnpm dev
```
This runs Next.js on `http://localhost:3000` (using Webpack mode for PWA compatibility)

## 🧪 Testing

### Login Credentials

Use these mock credentials to test different roles:

| Role | Email | Password |
|------|-------|----------|
| Public Officer | `officer@mda.gov` | `password` |
| ADS Admin | `admin@ads.gov` | `password` |
| Super Admin | `super@system.gov` | `password` |

### Testing Offline Functionality

1. Login as **Officer** (`officer@mda.gov` / `password`)
2. Navigate to **New Declaration**
3. Fill out the form partially
4. **Reload the page** - your draft should be restored
5. Go offline (DevTools → Network → Offline)
6. Complete and submit the form
7. Check the Officer Dashboard - "Pending Sync" count should increment
8. Go back online - the queued submission will be processed

## 📦 Building for Production

```bash
pnpm build
pnpm start
```

## 📝 Available Scripts

- `pnpm dev` - Start development server (Webpack mode)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm start:backend` - Start json-server mock API
- `pnpm lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Protected dashboard routes
│   └── sw.ts             # Service Worker
├── components/
│   ├── auth/             # Auth-related components
│   ├── forms/            # Declaration form components
│   ├── layout/           # Layout components (Sidebar, TopNav)
│   └── ui/               # Shadcn UI components
├── lib/
│   ├── db.ts             # Dexie database schema
│   └── store/            # Redux store and slices
└── services/             # API and business logic
```

## 🔐 Security Notes

- Demo uses mock authentication (**not production-ready**)
- Sensitive data stored in IndexedDB (device should be secured)
- See [SECURITY.md](./docs/SECURITY.md) for full details

## 📄 License

MIT
