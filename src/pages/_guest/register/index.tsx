import { createFileRoute, Link } from '@tanstack/react-router'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { AuthCard } from '@/components/AuthCard'
import { RegistrationForm } from './components/RegistrationForm'

const RegisterPage = () => (
  <AuthCard title="Rejestracja studenta">
    <RegistrationForm />
    <div className="divider my-0 text-sm text-base-content/50">lub</div>
    <GoogleSignInButton label="Zarejestruj się przez Google" />
    <p className="text-center text-base-content/70">
      Masz już konto?{' '}
      <Link
        to="/login"
        className="font-medium text-base-content underline underline-offset-4"
      >
        Zaloguj się
      </Link>
    </p>
  </AuthCard>
)

export const Route = createFileRoute('/_guest/register/')({
  component: RegisterPage
})
