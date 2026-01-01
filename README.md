# simple-browser

A web-based directory viewer for browsing and viewing images from mounted volumes.

## Features

- Browse directory tree with lazy-loaded subdirectories
- View image thumbnails with configurable density (3, 5, or 7 per row)
- Full-size image modal with zoom and keyboard navigation
- Fully keyboard accessible interface
- Docker-based deployment with read-only volume mounts

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Backend**: Node.js + Fastify + TypeScript
- **Runtime**: Docker Compose
- **Shared Types**: TypeScript definitions for API contracts

## Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- npm or yarn

## Quick Start

### Local Development

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd simple-browser
   cp .env.example .env
   # Edit .env to set your ROOT_DIRECTORY
   ```

2. **Install dependencies**:
   ```bash
   # Backend
   cd backend && npm install && cd ..
   
   # Frontend
   cd frontend && npm install && cd ..
   
   # Shared types
   cd shared && npm install && npm run build && cd ..
   ```

3. **Run backend** (in one terminal):
   ```bash
   cd backend
   npm run dev
   ```

4. **Run frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8765

### Docker Deployment

1. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit ROOT_DIRECTORY to point to your image directory
   ```

2. **Build and run**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8765

4. **Stop services**:
   ```bash
   docker-compose down
   ```

## Project Structure

```
simple-browser/
├── backend/           # Fastify API server
│   ├── src/
│   │   └── index.ts   # Server entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── App.tsx    # Main app component
│   │   └── ...
│   ├── Dockerfile
│   ├── nginx.conf     # Production nginx config
│   └── package.json
├── shared/            # Shared TypeScript types
│   ├── src/
│   │   └── types.ts   # API contracts
│   └── package.json
├── docker-compose.yml # Container orchestration
└── .env.example       # Configuration template
```

## Configuration

### Environment Variables

- `ROOT_DIRECTORY`: Path to the directory to serve (mounted as `/data` in Docker)
- `PORT`: Backend API port (default: 8765)
- `VITE_API_BASE_URL`: Frontend API endpoint (default: http://localhost:8765)
- `NODE_ENV`: Environment mode (`development` or `production`)

## Development Workflow

### Build Commands

```bash
# Backend build
cd backend && npm run build

# Frontend build
cd frontend && npm run build

# Shared types build
cd shared && npm run build
```

### Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/hello` - Test endpoint
- `GET /api/directories/:path` - List directories (coming soon)
- `GET /api/images/:path` - List images in directory (coming soon)
- `GET /api/image-content/:path` - Stream image file (coming soon)

## Constitution & Principles

This project follows strict principles defined in [spec/constitution.md](spec/constitution.md):

1. **Minimal Surface & Clarity**: Keep it simple and lean
2. **TypeScript Everywhere**: Shared types, validated contracts
3. **Read-Only Safety**: No writes to mounted volumes, path traversal protection
4. **Containerized Determinism**: Reproducible Docker builds with lockfiles
5. **Keyboard-First Accessibility**: Full keyboard navigation support

## Contributing

See [spec/tasks.md](spec/tasks.md) for implementation roadmap and current progress.

## License

ISC
