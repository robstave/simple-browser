# Specification: simple-browser

A web-based directory viewer for browsing and viewing images from mounted volumes.

## Overview

The application provides a split-pane interface:
- **Left pane**: Directory tree with lazy-loaded subdirectories
- **Right pane**: Image thumbnail grid with configurable density
- **Modal viewer**: Full-size image display with zoom and navigation

## Core Features

### Directory Navigation
- Display directory tree rooted at a configured path (mounted volume)
- Show only directories in the tree; lazy-load subdirectories on demand
- Support keyboard navigation with visible focus states

### Image Display
- Render image thumbnails in a configurable grid (3, 5, or 7 per row)
- Thumbnail density controlled from top menu bar
- Click thumbnail to open modal viewer

### Image Viewer Modal
- Display full-size image with zoom in/out capability
- Navigate between images using left/right arrows (within current directory)
- Keyboard accessible with standard controls (arrow keys, escape, etc.)

## Technical Architecture

### Stack
- **Frontend**: TypeScript web application
- **Backend**: TypeScript API server
- **Runtime**: Docker containers with volume mounts
- **Communication**: HTTP REST API

### Backend API
- Directory listing endpoint (returns subdirectories and image files)
- Image streaming endpoint (serves file content)
- Minimal API surface focused on read-only operations

### Type Safety
- Shared TypeScript types between frontend and backend
- Single source of truth for contracts and data models
- Input validation on all API requests

## Configuration

- Root directory provided via environment variable or config file
- Mounted as Docker volume at runtime
- No database required; all data sourced from filesystem

## Constraints

### Security & Safety
- Mounted directory is **read-only**; no writes permitted
- Path traversal protection required on all file access
- Filenames sanitized before rendering

### Build & Deployment
- Docker is the primary runtime environment
- Reproducible builds with committed lockfiles
- CI/CD must mirror local build commands

### Performance
- Must remain responsive when browsing large directory trees
- Lazy loading required to avoid loading entire tree upfront
- Thumbnail generation/scaling strategy TBD

### Accessibility
- Full keyboard navigation support required
- Visible focus indicators on all interactive elements
- ARIA labels for screen reader compatibility