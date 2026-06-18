# User Stories

User stories describe features from the user's perspective. They drive product decisions and define the scope of each component.

Format:

> As a **\<user role\>**, I want **\<action\>**, so that **\<value\>**.

Each story has acceptance criteria — testable conditions that mark the story as "done".

---

## Feature: TODO management

### Story 1: View a task

> As a user, I want to see the text of each task, so that I remember what I need to do.

**Acceptance criteria:**
- The task text is visible.
- The task's completed/active state is visually distinguishable.

**Status:** planned
**Components involved:** `TodoItem`

---

### Story 2: Mark a task as completed

> As a user, I want to mark a task as completed, so that I can track my progress.

**Acceptance criteria:**
- Clicking the checkbox toggles the completed state.
- A completed task is visually different (e.g. strikethrough, muted color).
- The action is reversible — clicking again uncompletes the task.

**Status:** planned
**Components involved:** `TodoItem`

---

### Story 3: Delete a task

> As a user, I want to delete a task, so that the list stays relevant and clean.

**Acceptance criteria:**
- Each task has a visible delete control.
- Clicking it removes the task from the list immediately.

**Status:** planned
**Components involved:** `TodoItem`, `TodoList`

---

### Story 4: Add a new task

> As a user, I want to add a new task by typing its text, so that I can capture things to do.

**Acceptance criteria:**
- A text input is always visible.
- Submitting the form (Enter or "Add" button) creates a new task.
- After submission, the input is cleared and ready for the next entry.
- Empty or whitespace-only input does not create a task.

**Status:** planned
**Components involved:** `AddTodoForm`

---

## Feature: Filtering (planned)

### Story 5: Filter tasks by status

> As a user, I want to filter tasks by status (All / Active / Completed), so that I can focus on what's relevant.

**Acceptance criteria:**
- Three filter options are available.
- Selecting a filter narrows the visible list.
- The active filter is visually highlighted.

**Status:** planned
**Components involved:** `TodoFilter`, `TodoList`
