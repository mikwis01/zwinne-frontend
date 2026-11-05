# Frontend

Frontend aplikacji do zarządzania projektami (Programowanie zwinne). Kontrakt z backendem: [`docs/api-contract.md`](docs/api-contract.md).

## Stack

- **React 19** + **TypeScript 7** + **Vite 8**
- **TanStack Router** (file-based routing in `src/pages`, route tree generated into `src/routeTree.gen.ts`)
- **TanStack Query** + **axios** (`src/api/service/query-client.ts`, `src/api/service/api.ts`)
- **Tailwind CSS 4** + **daisyUI 5** (theme in `src/index.css`) + `cn()` helper (`clsx` + `tailwind-merge`)
- **react-hook-form** + **zod** (forms and validation)
- **MSW** (API mocks in `src/mocks`, toggled with `VITE_API_MOCKING`)
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

## Mock mode

With `VITE_API_MOCKING=true` (the default in `.env.example`) the API is served by MSW in the browser, no backend needed. Demo accounts (password `haslo1234`):

- `student@example.com` (Student)
- `prowadzacy@example.com` (Prowadzący)

"Kontynuuj z Google" simulates the OAuth redirect. Registered users are kept in `localStorage` (`mock.users`). To use the real backend, set `VITE_API_MOCKING=false`.

## Environment variables

| Variable               | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `VITE_API_URL`         | REST API base URL, e.g. `http://localhost:8080/api` |
| `VITE_GOOGLE_AUTH_URL` | Backend endpoint that starts Google OAuth2          |
| `VITE_API_MOCKING`     | `true` = MSW mocks instead of the backend           |

`VITE_*` variables are baked in at build time.

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

// src/pages/_authenticated/users/index.tsx
export const Route = createFileRoute('/_authenticated/users/')({
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
