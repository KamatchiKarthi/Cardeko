interface HomeApiErrorProps {
  message?: string
}

export default function HomeApiError({
  message = 'Could not load this section. Make sure the API server is running.',
}: HomeApiErrorProps) {
  return (
    <p className="rounded-lg border border-status-error/20 bg-red-50 px-4 py-3 text-sm text-status-error">
      {message}
    </p>
  )
}
