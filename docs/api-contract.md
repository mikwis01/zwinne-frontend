# Kontrakt frontend ↔ backend

Ustalenia, na których opiera się frontend. Zmiana po stronie backendu → aktualizujemy ten plik
i odpowiednie miejsce we froncie (podane przy każdej sekcji).

Bazowy adres API: `VITE_API_URL` (domyślnie `http://localhost:8080/api`).

## Autoryzacja (JWT)

Frontend: `src/api/auth.ts`, `src/api/service/api.ts`, `src/utils/auth/session.ts`

| Endpoint             | Body                                                          | Odpowiedź                       |
| -------------------- | ------------------------------------------------------------- | ------------------------------- |
| `POST /api/register` | `{ imie, nazwisko, nrIndeksu, email, stacjonarny, password }` | `200`, bez body                 |
| `POST /api/login`    | `{ email, password }`                                         | `{ accessToken, refreshToken }` |
| `POST /api/refresh`  | `{ refreshToken }`                                            | `{ accessToken, refreshToken }` |

- Każde inne żądanie idzie z nagłówkiem `Authorization: Bearer <accessToken>`.
- **401** = token wygasł lub jest nieprawidłowy. Front wtedy raz woła `/refresh` i ponawia żądanie,
  a gdy refresh też się nie uda, wylogowuje użytkownika.
- **403** = zalogowany, ale bez uprawnień (np. student na endpoincie prowadzącego).
- Hasło: 8–25 znaków (limit z `Credentials`; `Student.password` pozwala na 64, ale z takim
  hasłem nie dałoby się zalogować).
- Błędy: front pokazuje pole `message` z body odpowiedzi, jeśli jest. Przykład: `409 { "message": "Konto z tym adresem e-mail już istnieje" }`.

### Claimy w access tokenie

Front nie weryfikuje podpisu, tylko czyta claimy do UI:

| Claim              | Przykład                | Wymagany |
| ------------------ | ----------------------- | -------- |
| `sub`              | `"student@example.com"` | tak      |
| `exp`              | standardowy             | tak      |
| `roles`            | `["STUDENT"]`           | tak      |
| `imie`, `nazwisko` | `"Anna"`, `"Nowak"`     | nie      |

`roles` może być tablicą albo stringiem `"A,B"`, z prefiksem `ROLE_` lub bez.
Role: `STUDENT`, `PROWADZACY`. W `JwtService.generateAccessToken` trzeba je dodać do `extraClaims`.

## Logowanie przez Google (OAuth2)

Frontend: `src/utils/auth/google-login.ts`, `src/pages/auth/callback.tsx`

1. Przycisk „Kontynuuj z Google” przekierowuje przeglądarkę na `VITE_GOOGLE_AUTH_URL`
   (domyślnie `http://localhost:8080/oauth2/authorization/google`, standard Spring `oauth2Login`).
2. Backend obsługuje flow z Google. W success handlerze tworzy użytkownika przy pierwszym
   logowaniu (rola `STUDENT`) i generuje te same tokeny co `/api/login`.
3. Backend przekierowuje na frontend:
   - sukces: `http://localhost:3000/auth/callback#accessToken=...&refreshToken=...`
   - błąd: `http://localhost:3000/auth/callback#error=<komunikat>`

Tokeny są w hashu (`#`), a nie w query (`?`), bo hash nie trafia do serwera ani do logów.

## Projekty

Frontend: `src/api/projects.ts`

`GET /api/projekty?page=0&size=10&sort=nazwa[&nazwa=fraza]`, odpowiedź w formacie `PagedModel`
(`@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)`):

```json
{
  "content": [
    {
      "projektId": 8,
      "nazwa": "Rozpoznawanie znaków drogowych",
      "opis": "Projekt i implementacja wielowarstwowej sieci neuronowej.",
      "dataczasUtworzenia": "2026-04-17T22:25:35.258",
      "dataczasModyfikacji": "2026-04-17T22:25:35.258",
      "dataOddania": "2026-06-15"
    }
  ],
  "page": { "size": 10, "number": 0, "totalElements": 23, "totalPages": 3 }
}
```

`page` liczone od 0. Nazwy pól daty: `dataczasUtworzenia` / `dataczasModyfikacji`
(w instrukcji pojawia się też wariant `dataCzas...`, więc trzeba ustalić jeden).

`DELETE /api/projekty/{projektId}` usuwa projekt razem z zadaniami. Odpowiedź `200` bez body.
Front pokazuje wszystkie akcje każdej roli, więc uprawnienia sprawdza backend (np. `403` przy próbie usunięcia przez studenta).

## CORS

Frontend w dev działa na `http://localhost:3000` (nie 4200 jak w instrukcji),
ten adres musi być w `setAllowedOrigins(...)`.
