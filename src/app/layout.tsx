import './globals.css'

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "MBTI",
  description: "A project of a MBTI stored block chain",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
      <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
