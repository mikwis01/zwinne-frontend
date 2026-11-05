# zwinne-frontend

Frontend aplikacji do zarządzania projektami (Programowanie zwinne). React + Vite + TanStack Router/Query + daisyUI.

## Uruchomienie

```bash
npm install
cp .env.example .env
npm run dev
```

Aplikacja działa na `http://localhost:3000`.

## Tryb demo

Domyślnie (`VITE_API_MOCKING=true`) API jest mockowane w przeglądarce, backend nie jest potrzebny. Konta demo, hasło `haslo1234`:

- `student@example.com`
- `prowadzacy@example.com`

Żeby korzystać z prawdziwego backendu, ustaw `VITE_API_MOCKING=false` i `VITE_API_URL`.

## Więcej

- Kontrakt z backendem: [`docs/api-contract.md`](docs/api-contract.md)
- Struktura projektu i konwencje: [`CLAUDE.md`](CLAUDE.md)
