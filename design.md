# AccessAlly Design and Architecture

This document outlines the design principles and technical architecture of the AccessAlly application.

## 1. Design Philosophy

The design aims to be **clean, modern, and accessible**. The user experience should feel supportive and empowering, reducing the stress often associated with finding and applying for assistance. The interface prioritizes clarity and ease of use.

## 2. Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit)
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 3. UI and Styling

### 3.1. Color Palette
The application uses a custom, professional color palette defined with HSL variables in `src/app/globals.css`. It supports both light and dark modes.

- **Background (`--background`):** A light, soft off-white to create a calm and clean canvas.
- **Foreground (`--foreground`):** A dark, near-black for high contrast and readability.
- **Primary (`--primary`):** A muted, friendly blue used for interactive elements like buttons and links.
- **Accent (`--accent`):** A slightly stronger teal/blue used to highlight key information and icons.
- **Muted (`--muted`):** A light gray for card backgrounds and separators.

### 3.2. Typography
Typography is chosen for readability and a professional feel, using Google Fonts.

- **Headlines:** `Playfair Display` (a serif font) is used for main page titles to give a sense of importance and elegance.
- **Body & UI Text:** `PT Sans` (a sans-serif font) is used for all other text for its clarity and readability on screens.

### 3.3. Layout
- **Main Structure:** The app uses a two-column layout on desktop screens, featuring a fixed sidebar for navigation and a main content area.
- **Responsiveness:** On mobile devices, the sidebar collapses into a slide-out "sheet" menu to maximize screen real estate for content.
- **Component-Based:** The UI is built from reusable React components located in `src/components/`, promoting consistency and maintainability.

## 4. Architecture

### 4.1. Project Structure
- `src/app/(app)`: Contains the main application pages, grouped using Next.js route groups.
- `src/components/`: Contains reusable UI components, including custom components and those from `shadcn/ui`.
- `src/ai/flows/`: Contains the server-side Genkit flows that handle all interactions with the AI models.
- `src/hooks/`: Contains custom React hooks, such as `useBookmarks` for managing local storage.
- `src/lib/`: Contains shared utilities, type definitions, and constants.

### 4.2. AI Integration
- All AI functionality is encapsulated within **Genkit Flows** in the `src/ai/flows/` directory.
- Each flow is a self-contained, server-side function (`'use server'`) that defines the prompt, input/output schemas (using Zod), and the specific model to be called.
- Client-side components (e.g., forms) call these flows directly as asynchronous functions to get AI-generated content. This keeps the frontend clean and separates concerns effectively.

### 4.3. State Management
- **UI State:** Managed locally within React components using hooks like `useState` and `useForm`.
- **Persistent State:** User bookmarks are managed via the `useBookmarks` custom hook, which abstracts the logic for reading from and writing to the browser's `localStorage`. This ensures data privacy as no user-specific application data is stored on a server.
