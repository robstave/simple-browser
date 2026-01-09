# Implementation Tasks: simple-browser

**Created**: 2026-01-01  
**Input**: [spec/specification.md](specification.md), [spec/constitution.md](constitution.md)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- File paths assume web app structure: `frontend/`, `backend/`, `shared/`

---

## Phase 1: Project Setup & Structure

**Purpose**: Initialize project with Docker, TypeScript, and shared types

- [x] T001 Create project directory structure (frontend/, backend/, shared/, docker/)
- [x] T002 [P] Initialize backend Node.js + TypeScript project in backend/
- [x] T003 [P] Initialize frontend Vite + React + TypeScript project in frontend/
- [x] T004 [P] Create shared types package in shared/ for contracts
- [x] T005 Create root docker-compose.yml for frontend + backend services
- [x] T006 [P] Create backend/Dockerfile with Node.js TypeScript build
- [x] T007 [P] Create frontend/Dockerfile with Vite production build
- [x] T008 [P] Configure TypeScript in backend/ with strict mode and path aliases
- [x] T009 [P] Configure TypeScript in frontend/ with React + strict mode
- [x] T010 [P] Setup ESLint and Prettier for both projects
- [x] T011 Add .dockerignore files to frontend/ and backend/
- [x] T012 Create .env.example for configuration (root directory path, ports)
- [x] T013 Update README.md with build/run instructions per constitution

**Constitution Check**:
- ✅ Minimal surface: Vite (lean), Fastify (minimal), no extra frameworks
- ✅ TypeScript everywhere: All projects use TS with shared types
- ✅ Determinism: Lockfiles committed, Docker builds documented

---

## Phase 2: Foundational Infrastructure (BLOCKS ALL STORIES)

**Purpose**: Core infrastructure required before any user story can work

**⚠️ CRITICAL**: No feature work can begin until this phase completes

- [x] T014 [P] Define shared types in shared/src/types.ts (DirectoryEntry, ImageFile, ApiResponse)
- [x] T015 [P] Implement path validation utility in backend/src/utils/path-validator.ts (prevent traversal)
- [x] T016 Setup Fastify server in backend/src/server.ts with CORS and error handling
- [x] T017 Create environment config loader in backend/src/config.ts (read ROOT_DIR from env)
- [x] T018 [P] Add helmet middleware for security headers in backend/
- [x] T019 [P] Setup backend logging infrastructure (pino or similar)
- [x] T020 [P] Create frontend API client in frontend/src/services/api.ts (typed fetch wrapper)
- [x] T021 [P] Setup React Router in frontend/src/App.tsx (single route for now)
- [x] T022 [P] Create base layout components in frontend/src/components/Layout.tsx
- [x] T023 Add docker-compose volume mount for test directory
- [x] T024 Create sample test directory structure for development
- [x] T025 Verify Docker build and startup scripts work end-to-end

**Checkpoint**: Foundation ready - services start, communicate, and enforce read-only safety

---

## Phase 3: User Story 1 - Directory Tree Display (Priority: P1) 🎯 MVP

**Goal**: Display collapsible directory tree on left pane with lazy loading

**Independent Test**: Mount a volume with nested directories, verify tree renders and expands on click

### Tests for User Story 1 (required) ⚠️

- [x] T026 [P] [US1] Integration test: GET /api/directories returns valid tree structure in backend/tests/directories.test.ts
- [x] T027 [P] [US1] Unit test: path validator rejects traversal attempts in backend/tests/path-validator.test.ts
- [ ] T028 [P] [US1] Component test: DirectoryTree renders and handles expand/collapse in frontend/tests/DirectoryTree.test.tsx

### Implementation for User Story 1

- [x] T029 [P] [US1] Implement GET /api/directories/:path endpoint in backend/src/routes/directories.ts
- [x] T030 [US1] Create directory scanning service in backend/src/services/directory-service.ts (fs readdir + stat)
- [x] T031 [P] [US1] Create DirectoryTree component in frontend/src/components/DirectoryTree.tsx
- [x] T032 [P] [US1] Create TreeNode component in frontend/src/components/TreeNode.tsx (expandable item)
- [x] T033 [US1] Implement lazy loading logic in DirectoryTree (fetch children on expand)
- [x] T034 [US1] Add keyboard navigation (arrow keys, enter to expand) to TreeNode
- [x] T035 [US1] Style DirectoryTree with visible focus states and indentation
- [x] T036 [US1] Add ARIA attributes (role="tree", aria-expanded) to tree components
- [x] T037 [US1] Integrate DirectoryTree into main layout left pane

**Checkpoint**: Directory tree renders, expands lazily, and supports keyboard navigation

---

## Phase 4: User Story 2 - Image Thumbnail Grid (Priority: P1)

**Goal**: Display image thumbnails in configurable grid on right pane

**Independent Test**: Navigate to directory with images, verify thumbnails render in selected density

### Tests for User Story 2 (required) ⚠️

- [x] T038 [P] [US2] Integration test: GET /api/images/:path returns image list in backend/tests/images.test.ts
- [x] T039 [P] [US2] Integration test: GET /api/image-content/:path streams image in backend/tests/image-content.test.ts
- [ ] T040 [P] [US2] Component test: ThumbnailGrid renders images with correct density in frontend/tests/ThumbnailGrid.test.tsx

### Implementation for User Story 2

- [x] T041 [P] [US2] Implement GET /api/images/:path endpoint in backend/src/routes/images.ts (filter image extensions)
- [x] T042 [P] [US2] Implement GET /api/image-content/:path endpoint in backend/src/routes/image-content.ts (stream file)
- [x] T043 [US2] Create image filtering utility in backend/src/utils/image-filter.ts (.jpg, .png, .gif, .webp)
- [x] T044 [P] [US2] Create ThumbnailGrid component in frontend/src/components/ThumbnailGrid.tsx
- [x] T045 [P] [US2] Create Thumbnail component in frontend/src/components/Thumbnail.tsx (lazy load image)
- [x] T046 [P] [US2] Create density selector in frontend/src/components/DensitySelector.tsx (3/5/7 per row)
- [x] T047 [US2] Add state management for selected directory and thumbnail density in frontend/src/App.tsx
- [x] T048 [US2] Implement thumbnail click handler (prepare for modal in next story)
- [x] T049 [US2] Add keyboard navigation (tab, arrow keys) to thumbnail grid
- [x] T050 [US2] Style thumbnails with visible focus rings and responsive grid
- [x] T051 [US2] Add ARIA labels (role="img", alt text) to thumbnails
- [x] T052 [US2] Connect DirectoryTree selection to ThumbnailGrid image loading

**Checkpoint**: Clicking directory shows image thumbnails; density selector changes layout

---

## Phase 5: User Story 3 - Image Viewer Modal (Priority: P1)

**Goal**: Click thumbnail to open full-size modal with zoom and navigation

**Independent Test**: Click any thumbnail, verify modal opens with zoom/navigation controls working

### Tests for User Story 3 (required) ⚠️

- [ ] T053 [P] [US3] Component test: ImageModal opens/closes correctly in frontend/tests/ImageModal.test.tsx
- [ ] T054 [P] [US3] Component test: Zoom controls increase/decrease scale in frontend/tests/ImageModal.test.tsx
- [ ] T055 [P] [US3] Component test: Navigation arrows cycle through images in frontend/tests/ImageModal.test.tsx

### Implementation for User Story 3

- [ ] T056 [P] [US3] Create ImageModal component in frontend/src/components/ImageModal.tsx
- [ ] T057 [P] [US3] Create ZoomControls component in frontend/src/components/ZoomControls.tsx (+ / - buttons)
- [ ] T058 [P] [US3] Create NavigationControls component in frontend/src/components/NavigationControls.tsx (← / →)
- [ ] T059 [US3] Implement zoom state management (scale factor, pan offset) in ImageModal
- [ ] T060 [US3] Add mouse wheel zoom and pan drag functionality to ImageModal
- [ ] T061 [US3] Implement keyboard controls (arrows, +/-, escape) in ImageModal
- [ ] T062 [US3] Add boundary logic (disable arrows at first/last image)
- [ ] T063 [US3] Style modal with overlay, centered image, and visible controls
- [ ] T064 [US3] Add ARIA attributes (role="dialog", aria-modal, aria-label) to modal
- [ ] T065 [US3] Trap focus within modal when open (prevent tab escape)
- [ ] T066 [US3] Connect thumbnail click to open modal with correct image
- [ ] T067 [US3] Test modal on various image sizes and aspect ratios

**Checkpoint**: Full user flow works - browse tree, select directory, view thumbnails, open modal

---

## Phase 6: Configuration & Preferences (Priority: P2)

**Goal**: Allow density preference persistence and configurable root path

**Independent Test**: Change density, refresh page, verify preference restored

### Implementation

- [ ] T068 [P] Create preferences service in frontend/src/services/preferences.ts (localStorage wrapper)
- [ ] T069 Connect density selector to preferences service
- [ ] T070 Load saved preferences on app mount
- [ ] T071 Document ENV variables in README and .env.example
- [ ] T072 Add validation for ROOT_DIR env variable in backend config

---

## Phase 7: Error Handling & Polish (Priority: P2)

**Goal**: Graceful error states and loading indicators

### Implementation

- [ ] T073 [P] Create ErrorBoundary component in frontend/src/components/ErrorBoundary.tsx
- [ ] T074 [P] Create LoadingSpinner component in frontend/src/components/LoadingSpinner.tsx
- [ ] T075 Add loading states to DirectoryTree during expansion
- [ ] T076 Add loading states to ThumbnailGrid during image fetch
- [ ] T077 Handle backend errors (404, 500) with user-friendly messages
- [ ] T078 Add empty state UI (no directories, no images)
- [ ] T079 Handle invalid image files gracefully (show placeholder)
- [ ] T080 Add retry logic for failed image loads

---

## Phase 8: Testing & Documentation (Priority: P1)

**Goal**: Achieve constitution-required test coverage and documentation

### Testing

- [ ] T081 [P] Create integration test suite for all API endpoints in backend/tests/integration/
- [ ] T082 [P] Add unit tests for path validation edge cases
- [ ] T083 [P] Add component tests for all keyboard interactions
- [ ] T084 [P] Add accessibility tests (aria attributes, focus management)
- [ ] T085 Setup CI/CD pipeline (.github/workflows/ci.yml) running all tests
- [ ] T086 Verify tests run in Docker (mirror local environment)

### Documentation

- [ ] T087 Document API endpoints in backend/README.md or OpenAPI spec
- [ ] T088 Document keyboard shortcuts in frontend/README.md
- [ ] T089 Create quickstart guide (how to run locally)
- [ ] T090 Document development workflow (build, test, run)
- [ ] T091 Add architecture diagram showing frontend/backend/volume relationships

---

## Phase 9: Performance Optimization (Priority: P3)

**Goal**: Ensure responsiveness on large directory trees

### Implementation

- [ ] T092 Add pagination or virtualization to ThumbnailGrid for 100+ images
- [ ] T093 Implement image caching strategy in frontend
- [ ] T094 Add backend caching for frequently accessed directory lists
- [ ] T095 Optimize thumbnail loading (lazy load only visible items)
- [ ] T096 Add debouncing to directory tree expansion
- [ ] T097 Profile and optimize initial load time

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup (Phase 1)**: No dependencies - start immediately
2. **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
3. **User Stories (Phases 3-5)**: All depend on Foundational; should be done sequentially for MVP
4. **Config & Error Handling (Phases 6-7)**: Depends on core features (Phases 3-5)
5. **Testing & Docs (Phase 8)**: Should run alongside feature development
6. **Performance (Phase 9)**: After MVP is functional

### Parallel Opportunities
- Within Phase 1: Tasks marked [P] can run simultaneously
- Within Phase 2: Most tasks marked [P] are independent
- Tests within each user story can be written in parallel
- Documentation tasks (T087-T091) can run in parallel

### Critical Path (MVP)
```
T001-T013 → T014-T025 → T026-T037 → T038-T052 → T053-T067 → T081-T091
(Setup)   → (Foundation) → (Tree)   → (Grid)   → (Modal)   → (Tests/Docs)
```

---

## Constitution Compliance Checklist

- [x] **Minimal surface**: Using Vite + React + Fastify (all lean choices)
- [x] **TypeScript everywhere**: All code in TS with shared types
- [x] **Read-only safety**: Path validator prevents traversal, no write operations
- [x] **Determinism**: Docker + lockfiles + documented build commands
- [x] **Keyboard-first**: Dedicated tasks for keyboard nav and ARIA labels
- [x] **Tests required**: Each user story has 3+ automated tests before implementation
- [x] **Documentation**: README, API docs, keyboard shortcuts all covered

---

## Notes

- Commit frequently after each task or logical group
- Run tests before moving to next phase
- Verify Docker builds successfully after infrastructure changes
- Stop at each checkpoint to validate independently
- Flag performance issues early if large directories are slow
