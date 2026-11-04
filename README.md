# Frontend

React + Vite SPA boilerplate.

## Stack

- **React 19** + **TypeScript 7** + **Vite 8**
- **TanStack Router** (file-based routing in `src/routes`, route tree generated into `src/routeTree.gen.ts`)
- **TanStack Query** + **axios** (`src/lib/query-client.ts`, `src/lib/api-client.ts`)
- **Tailwind CSS 4** (configured in `src/index.css`) + `cn()` helper (`clsx` + `tailwind-merge`)
- **oxlint** (linting), **Prettier** (formatting, Tailwind class sorting)
- **husky** + **lint-staged** + **commitlint**

## Getting started

```bash
nvm use
npm install
cp .env.example .env
npm run dev
```

App runs on `http://localhost:3000`.

## Scripts

| Script                 | Description                    |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Start dev server               |
| `npm run build`        | Typecheck and build to `dist/` |
| `npm run preview`      | Serve the production build     |
| `npm run typecheck`    | Run TypeScript                 |
| `npm run lint`         | Lint with oxlint               |
| `npm run lint:fix`     | Lint and autofix               |
| `npm run format`       | Format with Prettier           |
| `npm run format:check` | Check formatting               |

## Fetching data

Define queries with `queryOptions` and preload them in route loaders:

```ts
// src/api/users.ts
export const usersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: () => apiClient.get<User[]>('/users').then(res => res.data)
})

// src/routes/users.tsx
export const Route = createFileRoute('/users')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(usersQueryOptions),
  component: UsersPage
})

const UsersPage = () => {
  const { data } = useSuspenseQuery(usersQueryOptions)
  // ...
}
```

## Git

Pre-commit runs lint-staged (oxlint + Prettier on staged files) and typecheck.

Commit messages are enforced by commitlint:

```
[FT-<ticket>][<type>] - <description>
```

e.g. `[FT-12][feat] - add login page`. Allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`. Max 100 characters.
