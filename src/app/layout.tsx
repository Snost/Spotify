import localFont from 'next/font/local'
import { AuthProvider } from '@/features/auth/model/auth-context'
import './globals.css'

const sfPro = localFont({
  src: [
    {
      path: '../fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/SF-Pro-Display-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/SF-Pro-Display-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-sf',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className={`${sfPro.variable} font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}