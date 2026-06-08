# GC 2026 Digital Yearbook

A bilingual (English / Amharic) digital yearbook for the 2026 graduating class of Arba Minch University Christian Fellowship.

## Features

- **Book cover landing page** with fellowship branding
- **Firebase Authentication** — email/password signup and login
- **Student profiles** — name, departments, phone, last words, photos
- **Cloudinary image uploads** — large and small profile photos
- **Digital book experience** — GC speech, graduate gallery, department pages
- **Bilingual UI** — English and Amharic language switcher
- **Filters** — browse graduates by fellowship or academic department

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4, Framer Motion
- **Auth & Database:** Firebase Authentication, Firestore
- **Images:** Cloudinary
- **Hosting:** Vercel (free tier)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Email/Password** authentication
3. Create a **Firestore** database
4. Deploy the Firestore security rules from `firestore.rules` (Firebase Console → Firestore → Rules → paste and publish)

5. Copy your Firebase config into `.env.local`

### 3. Set up Cloudinary

1. Create an account at [Cloudinary](https://cloudinary.com)
2. Create an **unsigned upload preset** (Settings → Upload → Upload presets)
3. Add your cloud name and preset to `.env.local`

### 4. Configure environment

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push the project to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy

## Project Structure

```
src/
├── app/                  # Next.js pages
│   ├── page.tsx          # Book cover (landing)
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── profile/          # Profile setup
│   ├── book/             # Yearbook pages
│   │   ├── gc-speech/    # GC ቤንሃናን message
│   │   ├── gallery/      # Graduate gallery
│   │   └── departments/  # Department memories
│   └── api/upload/       # Cloudinary upload API
├── components/           # Reusable UI components
├── contexts/             # Auth & language providers
├── lib/                  # Firebase, types, constants
└── messages/             # i18n translations (en, am)
```

## Customization

- **GC photo:** Place `gc-benhanan.jpg` in the `public/` folder
- **Fellowship logo:** Replace `public/logo.svg` with your logo
- **Departments:** Edit lists in `src/lib/constants.ts`
- **GC speech:** Update text in `src/messages/en.json` and `am.json`

## License

Built for Arba Minch University Christian Fellowship — Class of 2026.
