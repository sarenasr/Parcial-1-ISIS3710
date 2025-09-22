
import Link from 'next/link'
import Navbar from '../components/Navbar'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Parcial 1',
  description: 'Parcial 1 Santiago Arenas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        <main>{children}</main>
      </body>
    </html>
  )
}