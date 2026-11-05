import { createFileRoute, Link } from '@tanstack/react-router'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { config } from '@/consts/config'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '@/mocks/demo-accounts'
import { AuthCard } from '@/components/AuthCard'
import { LoginForm } from './components/LoginForm'
import { loginSearchSchema } from './consts/login-search'

const LoginPage = () => {
  const { redirect } = Route.useSearch()

  return (
    <AuthCard title="Zaloguj się">
      {config.apiMocking && (
        <p role="note" className="rounded-2xl bg-base-100 px-5 py-4 text-sm">
          Tryb demo. Zaloguj się jako{' '}
          <strong className="font-semibold">{DEMO_ACCOUNTS.student}</strong> lub{' '}
          <strong className="font-semibold">{DEMO_ACCOUNTS.prowadzacy}</strong>,
          hasło <strong className="font-semibold">{DEMO_PASSWORD}</strong>.
        </p>
      )}
      <LoginForm redirectTo={redirect} />
      <div className="divider my-0 text-sm text-base-content/50">lub</div>
      <GoogleSignInButton />
      <p className="text-center text-base-content/70">
        Nie masz konta?{' '}
        <Link
          to="/register"
          className="font-medium text-base-content underline underline-offset-4"
        >
          Zarejestruj się
        </Link>
      </p>
    </AuthCard>
  )
}

export const Route = createFileRoute('/_guest/login/')({
  validateSearch: loginSearchSchema,
  component: LoginPage
})
