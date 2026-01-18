# ReadFlow Project State
**Date:** January 18, 2026

## Core Architecture
*   **Stack:** MERN (MongoDB Atlas, Express, React+Vite, Node.js).
*   **Deployment Target:** Vercel Serverless (Backend) + Vercel Static (Frontend).
*   **Local Dev:** Uses `local-server.js` (Express) to mimic Vercel's `/api/*` function routing on port 3000. Client on port 5173.

## Data Model (MongoDB)
*   **`Post` Schema:** 
    *   `title` (String), `content` (String), `type` ('text' | 'image'), `typography` (Animation settings).
    *   Supports **Cursor-based Pagination** (no offset/limit performance hits).

## Frontend Components (React + Framer Motion)
1.  **`FeedStream` (Main View):**
    *   Vertical Scroll-Snap feed (TikTok style).
    *   infinite scrolling powered by `useInView`.
    *   **Logic:** Renders `ScrollItem`s until one is clicked.
    *   **Exclusive Modes:** If a post is clicked, `FeedStream` unmounts and `ReaderView` mounts (mutually exclusive).

2.  **`ScrollItem` (Feed Item):**
    *   Displays Kinetic Typography (Slide/Fade/Distort) using custom hooks.
    *   Acts as a preview card.

3.  **`ReaderView` (Deep Read Mode):**
    *   **Physics-based Reader:** Splits text into sentences (`FocusLine` component).
    *   **Focus Logic:** Uses `useScroll` + `useSpring` to blur/fade lines at the edges (0.2-0.8 range) and zoom/sharpen the center line (1.2x scale).
    *   **Snapping:** Strict `snap-y` behavior for "one line at a time" reading.

4.  **Modals:**
    *   `CreatePostModal`: Add new text thoughts with animation presets.
    *   `ManagePostsModal`: View/Delete existing archives.

## Current Interaction Flow
1.  User enters `http://localhost:5173`.
2.  Scrolls vertical feed of titles (Snap Scroll).
3.  Clicks a title -> enters **Reader Focus Mode**.
4.  In Reader Mode, user scrolls sentence-by-sentence with kinetic blur effects.
5.  User clicks "EXIT" (top right) or "Close" in header to return to feed.

## Key Files
*   `/api/feed.js`: Serverless handler for GET (cursor pagination), POST (create), DELETE.
*   `/client/src/components/organisms/ReaderView.jsx`: The core physics-reading engine.
*   `/client/src/hooks/useInfiniteFeed.js`: Data fetching logic.

## Known Constraints
*   **Styling:** Mobile-first, Tailwind CSS. Dark mode default (Black bg, White text).
*   **Scroll:** CSS `scroll-snap-type: y mandatory` used heavily.
