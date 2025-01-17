import { PropsWithChildren } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}