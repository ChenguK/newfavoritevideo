# Technical Overview – Your New Favorite Video

This document explains architectural decisions, tradeoffs, and evolution from a front-end prototype to a deployed full-stack application.

## Architecture Overview

Client (HTML/CSS/JS)
⬇
Express Server (Node.js backend proxy)
⬇
YouTube Data API

The backend exists to:

- Protect API keys

- Handle external API requests securely

- Prepare the project for deployment environments

## Key Architectural Decisions

### 1️⃣ Backend Proxy

Originally, API calls were made directly from the browser.
This was replaced with an Express server that:

- Uses Axios to fetch data from YouTube

- Stores API keys in environment variables

- Prevents exposing sensitive keys in the client

Why:
Security and production readiness.

### 2️⃣ State Management Strategy

The UI transitions through several states:

- Initial (large form + placeholder)

- Results loaded (form shrinks, layout shifts)

- Video playing (placeholder hidden, media visible)

State is controlled through:

- Class toggling

- DOM manipulation

- Conditional rendering logic

This required careful sequencing to avoid hidden iframe issues.

### 3️⃣ Session Storage vs Persistent Storage

Early versions stored play history persistently.

This was intentionally changed to session-based behavior so that:

- Play history resets on refresh

- Input value can still persist if desired

- UX feels lightweight and fresh for each session

This reflects deliberate state design rather than accidental persistence.

### 4️⃣ Layout Engineering

The most complex layout challenge involved:

- Keeping the hero illustration top-aligned

- Expanding the video area without shifting layout

- Making playlist scrollable at video height

- Preventing media from collapsing or centering unintentionally

Solutions involved:

- Flexbox refinements

- Explicit width constraints

- Align-items adjustments

- Media queries for stacking under 900px


### 5️⃣ Modal-to-Playback Transition

Initial concept:
Modal displays thumbnail and description.

Improved interaction:
Clicking modal closes it and loads video into embedded player, then scrolls to top.

This required:

- Proper event binding

- Ensuring iframe is visible before assigning src

- Avoiding race conditions with class toggling

## Deployment Considerations

- Axios dependency required installation (`npm install`)

- Environment variables handled via process.env

- Production deployment required dependency management

- Rollback errors identified missing dependency installation

This version is structured to support scalable deployment.

## What I Would Improve Next

- Separate UI logic into modular components

- Add centralized state object

- Improve error messaging UX

- Add loading indicators

- Introduce testing (Jest or similar)

