import { createFileRoute } from '@tanstack/react-router'

const HomePage = () => (
  <div className="flex flex-1 items-center justify-center">
    <h1 className="text-3xl font-bold">Hello 👋</h1>
  </div>
)

export const Route = createFileRoute('/')({
  component: HomePage
})
