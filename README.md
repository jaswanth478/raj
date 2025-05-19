# Netflix Clone with Next.js 14

A Netflix-inspired web application built with Next.js 14, React, TypeScript, and Tailwind CSS. Features include Google authentication, responsive design, and movie data from TMDB API.

## Features

- 🎭 Google Authentication with NextAuth.js
- 🎬 Movie data from TMDB API
- 📱 Responsive design (mobile, tablet, desktop)
- 🎨 Netflix-inspired UI with Tailwind CSS
- 🖼️ Optimized images with Next.js Image component
- ✨ Parallax effect on hero banner
- 🔒 Protected routes for authenticated users

## Prerequisites

- Node.js 18+ and npm
- Google OAuth credentials
- TMDB API key

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd netflix-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
   ```

4. Get your Google OAuth credentials:
   - Go to the [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to Credentials > Create Credentials > OAuth Client ID
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

5. Get your TMDB API key:
   - Create an account on [TMDB](https://www.themoviedb.org)
   - Go to Settings > API > Request an API Key

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # App router pages
├── components/          # React components
├── types/              # TypeScript types
└── styles/             # Global styles
```

## Built With

- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [TMDB API](https://www.themoviedb.org/documentation/api)

## License

This project is licensed under the MIT License.
