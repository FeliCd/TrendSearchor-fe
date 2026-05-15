# Agent Collaboration Guidelines

## Communication Language

- All code, comments, variable names, file names, and commit messages must be written in **English only**.
- Vietnamese is not allowed in any code files, comments, or documentation files.
- Commit messages must be clear, concise, and written in English.

## Code Style

### No Emoji in Code or Commit Messages

- Do not use emoji characters in source code, comments, commit messages, or documentation.
- Use text-based labels, icons (e.g., SVG icons), or purely visual indicators instead of emoji in the UI.
- Example: Use `[pending]`, `status-badge`, or SVG icon instead of emoji in UI elements.

### Naming Conventions

- Use `camelCase` for variables and functions.
- Use `PascalCase` for component names and React component files.
- Use `SCREAMING_SNAKE_CASE` for constants.
- Use descriptive, meaningful names. Avoid single-letter variable names except in short loops.

## Security

### No Hardcoded Sensitive Values

- Never hardcode sensitive values such as API keys, secrets, access tokens, passwords, or credentials directly into source code.
- All sensitive values must be stored in environment variables (`.env` files) and accessed via `import.meta.env` or `process.env`.
- The `.env` file must be listed in `.gitignore`.
- Use a `.env.example` file to document required environment variables (without actual values).
- Example of correct usage:

```javascript
// ✅ GOOD
const apiKey = import.meta.env.VITE_API_KEY;

// ❌ BAD
const apiKey = "sk_live_abc123xyz";
```

## Code Organization

### No Dirty Code

All code must follow strict separation of concerns and maintainability principles:

1. **No inline JavaScript logic in JSX**: Extract complex logic into custom hooks, utility functions, or separate modules.

```jsx
// ❌ BAD
const Component = ({ users }) => {
  return (
    <ul>
      {users.filter(u => u.active).map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
};

// ✅ GOOD
// In useUserFilter.js
export const useUserFilter = (users) => {
  return users.filter(u => u.active);
};

// In Component.jsx
const Component = ({ users }) => {
  const activeUsers = useUserFilter(users);
  return (
    <ul>
      {activeUsers.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
};
```

2. **Mock data must be in separate files**: All mock/fake data used for development or testing must be stored in dedicated files (e.g., `src/mocks/`, `src/__mocks__/`).

```javascript
// ✅ GOOD
// src/mocks/users.js
export const mockUsers = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
];

// In Component.jsx
import { mockUsers } from '@/mocks/users';
```

3. **Utility functions must be separated**: Reusable helper functions go in dedicated utility files (e.g., `src/utils/`, `src/helpers/`).

4. **API calls must be in service files**: All API/network logic must be encapsulated in service files (e.g., `src/services/`).

5. **Use props for dynamic data**: Component customization and data injection must use React props. Do not embed data directly into component files.

```jsx
// ❌ BAD
const UserCard = () => {
  return <div>Alice</div>;
};

// ✅ GOOD
const UserCard = ({ name }) => {
  return <div>{name}</div>;
};
```

### File Structure Principles

- Keep files small and focused. A file should have a single responsibility.
- Group related files by feature or domain (feature-based structure is preferred over type-based structure).
- Prefer deep imports (`import { Button } from '@/components/ui/Button'`) over barrel exports when only one item is needed.
- Do not create "god files" that contain everything. Break large files into smaller, focused modules.

### Component Guidelines

- Use functional components with hooks.
- Extract reusable logic into custom hooks (`src/hooks/`).
- Colocate component-specific styles, tests, and utilities with the component when possible.
- Use prop types or TypeScript interfaces for component props.

### Constants

- Magic numbers and magic strings must be extracted into named constants or a constants file (`src/constants/`).

```javascript
// ❌ BAD
setTimeout(() => { /* ... */ }, 86400000);

// ✅ GOOD
// In src/constants/time.js
export const ONE_DAY_MS = 86_400_000;

// In your file
setTimeout(() => { /* ... */ }, ONE_DAY_MS);
```

## Testing

- Write tests for business logic, utilities, and critical components.
- Mock data used in tests must come from dedicated mock files.
- Do not hardcode test data inline within test files if it is reusable.

## Version Control

### Commit Messages

- Write commit messages in English, following conventional commits format:

```
feat: add user authentication
fix: resolve login redirect issue
refactor: extract API service layer
docs: update README
```

- Keep commits small and focused on a single change.
- Do not commit sensitive values or debug code.

### Branch Naming

- Use descriptive branch names in English: `feature/user-auth`, `fix/login-redirect`, `refactor/api-layer`

## Dependencies

- Do not add unnecessary packages. Evaluate the need for each new dependency.
- Pin major versions in `package.json` for critical dependencies.
- Use a lock file (`package-lock.json`) and commit it.

## Performance Considerations

- Avoid unnecessary re-renders in React components. Use `useMemo`, `useCallback`, or `React.memo` when appropriate.
- Lazy load routes and heavy components using dynamic imports.
- Optimize images and assets.

## Accessibility

- Ensure interactive elements have proper semantic HTML and ARIA attributes where needed.
- Maintain keyboard navigability for all interactive features.

## Summary Checklist

Before completing any task, verify:

- [ ] Code and comments are in English only.
- [ ] No emoji used in code or commit messages.
- [ ] No sensitive values hardcoded in source code.
- [ ] Mock data separated into dedicated mock files.
- [ ] Complex logic extracted into hooks, utilities, or service modules.
- [ ] Components receive data via props.
- [ ] Files are small, focused, and follow single responsibility principle.
- [ ] Commit messages are in English and follow conventional commits format.
