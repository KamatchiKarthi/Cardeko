import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-32 text-center">
      <p className="mb-4 text-8xl font-black text-brand-accent opacity-20">404</p>
      <h1 className="mb-2 text-2xl font-bold text-text-primary">Page not found</h1>
      <p className="mb-8 text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 font-semibold text-white transition hover:brightness-110"
      >
        Back to home
      </Link>
    </div>
  )
}
