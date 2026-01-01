# Specification

The application is a web-based directory viewer.

Features:
- Display a directory tree rooted at a configured path.
- Allow users to navigate folders.
- Display image files in a simple viewer.
- Run entirely in Docker containers.
- Support a frontend and backend written in TypeScript.

Interaction details:
- Directory tree renders on the left and lazy-loads subdirectories; the root is the mounted volume and only directories appear in the tree.
- Image thumbnails render on the right; thumbnail density is selectable from the top menu (3, 5, or 7 per row).
- Clicking an image opens a modal with zoom in/out and left/right navigation within the current directory.
- Keyboard navigation is required for tree traversal, thumbnail focus, and modal navigation; visible focus states must be present.

Constraints:
- The mounted directory is read-only.
- The backend exposes a minimal API for directory listing and file access.
- Docker is the primary runtime; builds must be reproducible with committed lockfiles.
- Frontend and backend are TypeScript; shared types should come from a single source of truth.