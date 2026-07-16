# init-sudoku-post12 — shared foundation

Generated deterministically by DevOps from the approved project-decomposition.

**Stack:** TypeScript (npm workspaces)
- install: `npm install`
- build: `npm run build`
- test: `npm test`

## Subsystems (one feature team each)
- **web-client** — Web Client: Browser-based SPA that renders an interactive 9x9 Sudoku board, allows difficulty selection, fetches puzzles from the Puzzle Service, submits completed boards for validation, sends results to the Scores Service, and displays the leaderboard.
  - owns: packages/web
  - dependsOn: puzzle-service, scores-service
- **puzzle-service** — Puzzle Service: Stateless HTTP service that generates valid, uniquely-solvable Sudoku puzzles per difficulty and validates submitted boards by re-checking Sudoku rules directly (no stored solution). No caching. No persistence is required for core functionality; any audit logging is optional and out of MVP scope unless separately requested.
  - owns: packages/puzzle-service
  - dependsOn: none
- **scores-service** — Scores Service: HTTP service that persists completed-game results (player name, difficulty, time-to-solve) and serves a per-difficulty top-10 leaderboard. Owns a required SQLite database with WAL mode and composite index.
  - owns: packages/scores-service
  - dependsOn: none

## Shared contracts
- packages/contracts (TypeScript type-only package: Difficulty, PuzzleResponse, ValidateRequest/Response, ScoreSubmission, LeaderboardEntry/Response, ApiError). Ownership: this is shared foundation/platform substrate, not a feature team — it is not assigned to web-client, puzzle-service, or scores-service, and none of their ownedPaths include packages/contracts. It is owned and maintained by DevOps/platform tooling as a versioned, compile-time-only devDependency consumed by all three subsystems; changes require a coordinated version bump reviewed against all three consumers before release.
