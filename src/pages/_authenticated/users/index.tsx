import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PageHeading } from '@/components/PageHeading'
import { requireRole } from '@/utils/auth/guards'
import { ROLE_LABELS } from '@/consts/roles'
import type { Role } from '@/types/auth'
import { toast } from '@/utils/toast'

type UserItem = {
  id: number
  imie: string
  nazwisko: string
  email: string
  nrIndeksu: string
  roles: Role[]
}

const INITIAL_USERS: UserItem[] = [
  {
    id: 1,
    imie: 'Jan',
    nazwisko: 'Kowalski',
    email: 'prowadzacy@example.com',
    nrIndeksu: '000001',
    roles: ['PROWADZACY']
  },
  {
    id: 2,
    imie: 'Anna',
    nazwisko: 'Nowak',
    email: 'student@example.com',
    nrIndeksu: '123456',
    roles: ['STUDENT']
  },
  {
    id: 3,
    imie: 'Piotr',
    nazwisko: 'Zieliński',
    email: 'p.zielinski@example.com',
    nrIndeksu: '123457',
    roles: ['STUDENT']
  }
]

const UsersPage = () => {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    imie: '',
    nazwisko: '',
    email: '',
    nrIndeksu: '',
    role: 'STUDENT' as Role
  })

  const toggleRole = (userId: number) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newRoles: Role[] = u.roles.includes('PROWADZACY')
            ? ['STUDENT']
            : ['PROWADZACY']
          toast.success(
            `Zmieniono rolę dla ${u.imie} ${u.nazwisko} na: ${ROLE_LABELS[newRoles[0]]}`
          )
          return { ...u, roles: newRoles }
        }
        return u
      })
    )
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.imie || !formData.nazwisko) {
      toast.error('Wypełnij wszystkie wymagane pola')
      return
    }

    const newUser: UserItem = {
      id: Date.now(),
      imie: formData.imie,
      nazwisko: formData.nazwisko,
      email: formData.email,
      nrIndeksu: formData.nrIndeksu || 'brak',
      roles: [formData.role]
    }

    setUsers(prev => [newUser, ...prev])
    toast.success(`Utworzono użytkownika ${newUser.email}`)
    setIsModalOpen(false)
    setFormData({
      imie: '',
      nazwisko: '',
      email: '',
      nrIndeksu: '',
      role: 'STUDENT'
    })
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeading title="Użytkownicy i uprawnienia">
          Zarządzaj kontami studentów, prowadzących oraz przypisuj odpowiednie
          role.
        </PageHeading>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn gap-2 btn-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Dodaj użytkownika
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr className="bg-base-200/60 text-sm">
                <th>Użytkownik</th>
                <th>E-mail</th>
                <th>Nr indeksu</th>
                <th>Rola</th>
                <th className="text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="font-semibold">
                      {u.imie} {u.nazwisko}
                    </div>
                  </td>
                  <td className="text-base-content/80">{u.email}</td>
                  <td>
                    <span className="badge badge-ghost font-mono">
                      {u.nrIndeksu}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      {u.roles.map(r => (
                        <span
                          key={r}
                          className={`badge ${
                            r === 'PROWADZACY'
                              ? 'badge-primary'
                              : 'badge-secondary'
                          }`}
                        >
                          {ROLE_LABELS[r]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => toggleRole(u.id)}
                      className="btn btn-outline btn-sm"
                    >
                      Zmień na{' '}
                      {u.roles.includes('PROWADZACY')
                        ? 'Studenta'
                        : 'Prowadzącego'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal dodawania użytkownika */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Nowy użytkownik</h3>
            <form
              onSubmit={handleCreateUser}
              className="mt-4 flex flex-col gap-3"
            >
              <div>
                <label className="label">
                  <span className="label-text">Imię</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.imie}
                  onChange={e =>
                    setFormData({ ...formData, imie: e.target.value })
                  }
                  className="input-bordered input w-full"
                  placeholder="np. Jan"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Nazwisko</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nazwisko}
                  onChange={e =>
                    setFormData({ ...formData, nazwisko: e.target.value })
                  }
                  className="input-bordered input w-full"
                  placeholder="np. Kowalski"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Adres e-mail</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-bordered input w-full"
                  placeholder="np. jan.kowalski@pbs.edu.pl"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Numer indeksu</span>
                </label>
                <input
                  type="text"
                  value={formData.nrIndeksu}
                  onChange={e =>
                    setFormData({ ...formData, nrIndeksu: e.target.value })
                  }
                  className="input-bordered input w-full"
                  placeholder="np. 123456"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Rola</span>
                </label>
                <select
                  value={formData.role}
                  onChange={e =>
                    setFormData({ ...formData, role: e.target.value as Role })
                  }
                  className="select-bordered select w-full"
                >
                  <option value="STUDENT">Student</option>
                  <option value="PROWADZACY">Prowadzący</option>
                </select>
              </div>

              <div className="modal-action mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Anuluj
                </button>
                <button type="submit" className="btn btn-primary">
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export const Route = createFileRoute('/_authenticated/users/')({
  beforeLoad: () => requireRole('PROWADZACY'),
  component: UsersPage
})
