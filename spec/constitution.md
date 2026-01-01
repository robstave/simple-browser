# Constitution: simple-browser

This project follows Spec Kit principles with a focus on building a minimal, accessible directory viewer.

## Core Principles

### I. Minimal Surface & Clarity
Keep flows simple, dependencies lean, and browsing responsive even on large directory trees. Avoid feature creep that bloats the viewer.

### II. TypeScript Everywhere
Frontend and backend share typed contracts and validated inputs/outputs. No mixing of languages or untyped tooling without explicit justification.

### III. Read-Only Safety & Privacy
No writes to mounted volumes. Defend against path traversal. Avoid plaintext secrets and default telemetry.

### IV. Containerized Determinism & Verification
Docker is the primary runtime. Builds are reproducible with lockfiles and automated tests for primary flows.

### V. Keyboard-First Accessibility
Navigation works without a mouse, with visible focus states and ARIA-aware components.

## Technical Constraints

### Data & Storage
- No databases; all data comes from filesystem reads only
- Preferences, if present, live in a container-scoped JSON file (never on mounted volumes)
- External services require fallbacks and must not block core browsing

### Stack Choices
- **Frontend**: Vite + React + TypeScript
- **Backend**: Node.js + TypeScript with Fastify (or Express)
- **Runtime**: Docker Compose with separate services for frontend and backend
- **Architecture**: Keep concerns separated—UI in frontend, filesystem/API in backend

