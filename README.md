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

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Import in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import `Bernabas-Tesema/GC_2026`
4. Framework should auto-detect **Next.js** — leave defaults

### 3. Add environment variables (required)

In Vercel → **Project → Settings → Environment Variables**, add every value from your `.env.local`:

| Variable | Required |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Optional |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes (for uploads) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Yes (for uploads) |
| `NEXT_PUBLIC_TELEGRAM_GROUP_URL` | Optional |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Yes (manager login emails) |

Apply to **Production**, **Preview**, and **Development**, then click **Deploy**.

If you see `auth/invalid-api-key` in production, the Firebase variables are missing or wrong in Vercel. Re-copy them from Firebase Console → Project settings → Your apps → Web app config.

### 4. Firebase: allow your live domain

After the first deploy, copy your Vercel URL (e.g. `gc-2026.vercel.app`).

In [Firebase Console](https://console.firebase.google.com):

1. **Authentication → Settings → Authorized domains**
2. Add your Vercel domain (e.g. `gc-2026.vercel.app`)
3. Add a custom domain too if you connect one later

### 5. Deploy Firestore rules

From your project folder (with [Firebase CLI](https://firebase.google.com/docs/cli) installed):

```bash
npm install -g firebase-tools
firebase login
firebase use amu-digital-book-2026
firebase deploy --only firestore:rules
```

Or paste `firestore.rules` manually in Firebase Console → Firestore → Rules → Publish.

### 6. Cloudinary upload preset

In Cloudinary → **Settings → Upload → Upload presets**:

- Preset name must match `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (e.g. `student_uploads`)
- Set signing mode to **Unsigned** if using the current upload API

### 7. Verify after deploy

- Cover page loads
- Login / signup works
- Profile photo upload works
- Managers panel works with your admin email

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
