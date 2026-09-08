## Summary
Integrate the "Second Brain" Kanban task queue for agent coordination directly into the local fred-dashboard SQLite/Node backend, replacing the static data currently used in KanbanBoard.tsx.

## Acceptance Criteria
- AC-1: A new table `agent_tasks` is added to `data/habits.sqlite` via `server/index.mjs` setup to store tasks with an id, status, text, tag, and agent info.
- AC-2: `server/index.mjs` exposes a `GET /api/tasks` endpoint returning all tasks, and a `POST /api/tasks` endpoint to upsert tasks.
- AC-3: `src/components/KanbanBoard.tsx` is updated to fetch tasks from `GET /api/tasks` and render them in the existing MoSCoW columns (Must, Should, Could based on task status/priority) instead of `src/data/static.ts`.
- AC-4: Toggling a task completion in `KanbanBoard.tsx` sends a POST request to update the task status in the backend.

## Non-Goals
- NG-1: Do not change the habit tracking MVP logic or the Telegram reminder scheduler.
- NG-2: Do not build an overarching project management app. Keep the dashboard offline-first and simple.

## Notes
- `KanbanBoard.tsx` currently expects tags to filter. It might make sense to keep the tags as "must", "should", "could" for the queue columns.
