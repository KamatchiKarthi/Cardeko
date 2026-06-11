import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cardeko',
  description: 'Cardeko — Buy and sell cars with confidence',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
