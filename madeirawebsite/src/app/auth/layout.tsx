import { Toaster } from 'react-hot-toast';

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      
      <div className="min-h-screen bg-gray-50">
        {children}
        <Toaster 
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    )
  }