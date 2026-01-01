<!--
Sync Impact Report
- Version: 1.0.0 -> 2.0.0
- Modified Principles: Standards-First Lightweight Delivery -> Minimal Surface & Clarity; Security & Privacy Baseline -> Read-Only Safety & Privacy; Automated Verification Discipline -> Containerized Determinism & Verification; Deterministic Delivery & Traceability -> Containerized Determinism & Verification; Documentation & Accessibility Commitments -> Keyboard-First Accessibility; new TypeScript Everywhere principle added.
- Added Sections: none
- Removed Sections: none
- Templates requiring updates: .specify/templates/plan-template.md ✅, .specify/templates/spec-template.md ⚠ (no change needed), .specify/templates/tasks-template.md ⚠ (no change needed)
- Follow-up TODOs: none
-->

# simple-browser Constitution

## Core Principles

### I. Minimal Surface & Clarity
- Favor simple, legible flows over abstraction; avoid feature creep that bloats the directory viewer.
- Keep dependency footprint lean; each new package MUST document purpose, size impact, and removal plan.
- User-facing performance MUST stay responsive for large trees; avoid heavy assets and unnecessary network calls.
Rationale: A minimal surface keeps the browser fast, predictable, and easy to maintain.

### II. TypeScript Everywhere
- Frontend and backend MUST be TypeScript; shared types or schemas MUST live in one source of truth.
- Public APIs MUST return typed responses and validate inputs to keep client and server in sync.
- Mixing languages or untyped tooling requires explicit justification and migration steps.
Rationale: Consistent typing reduces drift, catches errors early, and aligns contracts across the stack.

### III. Read-Only Safety & Privacy
- Mounted volumes are read-only: no feature may write, modify, or delete files/directories in the served path.
- Path handling MUST prevent traversal and restrict requests to the configured root; sanitize names before rendering.
- Secrets MUST NOT be stored in plaintext; telemetry is disabled unless explicitly documented, opt-in, and justified.
Rationale: The app surfaces user data; strict safety avoids unintended writes and data exposure.

### IV. Containerized Determinism & Verification
- Docker is the primary runtime; builds MUST be reproducible via documented commands and committed lockfiles.
- CI/CD MUST run the same commands as local setup; dependencies remain pinned to avoid drift.
- Primary user flows MUST have automated tests (unit or headless) that run in CI without manual steps.
Rationale: Deterministic builds and automated verification prevent regressions and environment surprises.

### V. Keyboard-First Accessibility
- All navigation MUST work via keyboard with visible focus states; mouse-free use is a first-class path.
- Interactive elements require ARIA labels and semantic markup so screen readers can traverse trees and viewer controls.
- Documentation MUST reflect interaction changes, shortcuts, and accessibility constraints.
Rationale: A minimal UI still has to be usable by everyone, including keyboard-only users.

## Additional Constraints
- No databases; data comes from filesystem reads only.
- Preferences, if needed, live in a local JSON file scoped to the container and never touch mounted volumes.
- Avoid reliance on persistent external services; catalog any APIs/CDNs with fallbacks that do not break core browsing.

## Development Workflow
- Planning artifacts MUST capture Constitution Check outcomes: dependency rationale, type ownership, read-only enforcement, container build steps, test scope, and accessibility coverage.
- Code reviews MUST verify typed API contracts, read-only guarantees, dependency justification, and documentation updates before merge.
- Releases/merges MUST show green CI (including automated tests), committed lockfiles, and a successful Docker build from documented commands.

## Governance
- This constitution supersedes prior practices for simple-browser.
- Amendments require maintainer approval, an updated Sync Impact Report, and alignment of affected templates.
- Versioning: MAJOR for principle removals/redefinitions, MINOR for new or materially expanded principles, PATCH for clarifications.
- Compliance reviews: PRs and specs MUST document Constitution Check results; any exceptions need explicit follow-up tasks.

**Version**: 2.0.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-01
