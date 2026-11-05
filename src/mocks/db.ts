import type { Project } from '@/api/projects'
import type { Role } from '@/types/auth'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from './demo-accounts'

export type MockUser = {
  studentId: number
  imie: string
  nazwisko: string
  nrIndeksu: string | null
  email: string
  stacjonarny: boolean
  password: string | null
  roles: Role[]
}

const STORAGE_KEY = 'mock.users'

const SEED_USERS: MockUser[] = [
  {
    studentId: 1,
    imie: 'Anna',
    nazwisko: 'Nowak',
    nrIndeksu: '123456',
    email: DEMO_ACCOUNTS.student,
    stacjonarny: true,
    password: DEMO_PASSWORD,
    roles: ['STUDENT']
  },
  {
    studentId: 2,
    imie: 'Piotr',
    nazwisko: 'Kowalski',
    nrIndeksu: null,
    email: DEMO_ACCOUNTS.prowadzacy,
    stacjonarny: false,
    password: DEMO_PASSWORD,
    roles: ['PROWADZACY']
  }
]

const loadUsers = (): MockUser[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as MockUser[]) : SEED_USERS
  } catch {
    return SEED_USERS
  }
}

let users = loadUsers()

const saveUsers = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch {}
}

export const findUserByEmail = (email: string) =>
  users.find(user => user.email.toLowerCase() === email.toLowerCase())

export const findUserByNrIndeksu = (nrIndeksu: string) =>
  users.find(user => user.nrIndeksu === nrIndeksu)

export const addUser = (user: Omit<MockUser, 'studentId'>) => {
  const created = {
    ...user,
    studentId: Math.max(0, ...users.map(({ studentId }) => studentId)) + 1
  }
  users = [...users, created]
  saveUsers()
  return created
}

const PROJECTS: [string, string][] = [
  [
    'Rozpoznawanie znaków drogowych',
    'Projekt i implementacja wielowarstwowej sieci neuronowej.'
  ],
  [
    'System rezerwacji sal wykładowych',
    'Rezerwacja sal z podglądem dostępności w kalendarzu.'
  ],
  [
    'Budżet domowy',
    'Aplikacja do śledzenia wydatków z kategoriami i raportami miesięcznymi.'
  ],
  [
    'Platforma e-learningowa',
    'Kursy, quizy i śledzenie postępów dla szkół średnich.'
  ],
  [
    'Analiza sentymentu opinii',
    'Klasyfikacja opinii klientów z wykorzystaniem modeli NLP.'
  ],
  [
    'Sklep z częściami rowerowymi',
    'Sklep internetowy z koszykiem i integracją płatności.'
  ],
  [
    'Symulator ruchu drogowego',
    'Symulacja skrzyżowań i optymalizacja cykli świateł.'
  ],
  ['Przewodnik po kampusie', 'Mobilna mapa budynków i sal z wyszukiwarką.'],
  ['Chatbot dziekanatu', 'Odpowiedzi na najczęstsze pytania studentów 24/7.'],
  [
    'Zgłaszanie awarii w akademiku',
    'Zgłoszenia usterek ze statusami i powiadomieniami.'
  ],
  [
    'Generator planu zajęć',
    'Układanie planu z uwzględnieniem ograniczeń prowadzących.'
  ],
  [
    'Monitoring jakości powietrza',
    'Czujniki IoT i dashboard z historią pomiarów.'
  ],
  [
    'Gra edukacyjna z matematyki',
    'Gra przeglądarkowa dla uczniów szkół podstawowych.'
  ],
  [
    'Wyszukiwarka praktyk studenckich',
    'Agregator ofert praktyk z filtrowaniem po kierunku.'
  ],
  ['Nauka słówek', 'Fiszki z algorytmem powtórek rozłożonych w czasie.'],
  ['System biblioteczny', 'Katalog, wypożyczenia i rezerwacje książek.'],
  ['Rozpoznawanie mowy', 'Transkrypcja nagrań w języku polskim.'],
  ['Wymiana podręczników', 'Portal ogłoszeń wymiany używanych książek.'],
  ['Dziennik treningowy', 'Plany treningowe i statystyki postępów.'],
  [
    'Wizualizacja algorytmów sortowania',
    'Animacje krok po kroku dla popularnych algorytmów.'
  ],
  [
    'Głosowanie online dla samorządu',
    'Anonimowe głosowania z weryfikacją uprawnień.'
  ],
  ['Dzielenie rachunków', 'Rozliczanie wspólnych wydatków w grupie znajomych.'],
  ['Kalendarz wydarzeń uczelnianych', 'Wydarzenia, zapisy i przypomnienia.']
]

const DAY_MS = 24 * 60 * 60 * 1000

const toLocalDateTime = (date: Date) => date.toISOString().slice(0, 23)
const toLocalDate = (date: Date) => date.toISOString().slice(0, 10)

const now = Date.now()

export const projects: Project[] = PROJECTS.map(([nazwa, opis], index) => {
  const createdAt = now - (90 - index * 3) * DAY_MS
  return {
    projektId: index + 1,
    nazwa,
    opis,
    dataczasUtworzenia: toLocalDateTime(new Date(createdAt)),
    dataczasModyfikacji: toLocalDateTime(
      new Date(createdAt + (index + 1) * DAY_MS)
    ),
    dataOddania: toLocalDate(new Date(now + (index * 6 - 30) * DAY_MS))
  }
})
