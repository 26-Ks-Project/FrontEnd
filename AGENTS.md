# Project Context: @figma/my-make-file

This project is a high-performance frontend application based on Vite 6 and React 18.

## Tech Stack & Core Libraries

- **Framework**: React 18.3 (TypeScript)
- **Build Tool**: Vite 6.3
- **Styling**:
  - **Tailwind CSS 4.1**: Utilizes the latest engine, adhering to utility-first styling principles.
  - **MUI (Material UI) 7**: Component utilization using `@mui/material`.
  - **Emotion**: Serves as the style engine for MUI via `@emotion/react` and `@emotion/styled`.
- **UI Primitives**: **Radix UI** (Extensively utilizes primitives including Accordion, Dialog, Popover, and Select).
- **Routing**: **React Router 7** (Complies with the latest data APIs and routing patterns).
- **Animation**: **Motion (Framer Motion 12)**.
- **Forms**: **React Hook Form 7.55**.
- **Charts**: **Recharts 2.15**.
- **Icons**: **Lucide React**.
- **Utilities**: `tailwind-merge`, `clsx`, `date-fns`, `vaul` (Drawer).

## Coding Standards & Rules

1. **Component Pattern**:
   - All components must be written as functional components (`const Component = () => {}`).
   - Explicit TypeScript Interfaces must be defined and used for all Props.
2. **Styling**:
   - Tailwind CSS utility classes take the highest priority. Use the `cn()` utility (clsx + tailwind-merge) for combining classes.
   - Complex UI layouts must be customized based on Radix UI Primitives, mixing Material UI components only when necessary.
3. **Routing**: Strict adherence to React Router 7 architectural patterns (v7-specific Hooks, loaders, etc.) is highly recommended.
4. **State Management**: Form states are strictly managed via `react-hook-form`. Asynchronous data processing must comply with respective library specifications.
5. **Animation**: Use `motion` components for implementing animations in a declarative manner.

## Key File Structure (Expected)

- `/src/components`: UI Components (Radix/MUI-based)
- `/src/routes` or `/src/views`: Page-level Components
- `/src/hooks`: Custom Hooks
- `/src/lib`: Utility functions (cn, API client, etc.)

## Pull Request (PR) & Documentation Rules (STRICT CONTROLS)

- **Zero-Emoji Policy**:
  - Do NOT include any emojis under any circumstances in Pull Request (PR) titles, body descriptions, commit logs, or generated documentation files.
  - Maintain an exclusively professional, text-only, and engineering-focused technical tone.
- **Strict Project Root Constraint**:
  - All automated artifact creation, PR template generation, and code analysis tasks must be executed strictly within the current project workspace root directory.
  - The agent is strictly prohibited from escaping the current workspace or generating any directories/files in parent or external system paths. All relative file paths must resolve using the project root as the absolute base.
