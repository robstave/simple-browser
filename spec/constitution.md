# Constitution

This project uses Spec Kit with a focus on a minimal, accessible directory viewer.

Principles:
- Minimal surface and clarity: keep flows simple, dependencies lean, and browsing responsive even on large trees.
- TypeScript everywhere: frontend and backend share typed contracts and validated inputs/outputs.
- Read-only safety and privacy: no writes to mounted volumes, defend against path traversal, and avoid plaintext secrets or default telemetry.
- Containerized determinism and verification: Docker is the primary runtime; builds are reproducible with lockfiles and automated tests for primary flows.
- Keyboard-first accessibility: navigation works without a mouse, with visible focus states and ARIA-aware components.

Constraints:
- No databases; data comes from filesystem reads only.
- Preferences, if present, live in a container-scoped JSON file (never on mounted volumes).
- External services require fallbacks and must not block core browsing.
