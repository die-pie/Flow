import React from 'react'
import FeedStream from './components/organisms/FeedStream'
import LoginPage from './components/pages/LoginPage'
import AuroraBackground from './components/atoms/AuroraBackground'
import { AuthProvider, useAuth } from './context/AuthContext'

const ProtectedApp = () => {
  const { token, loading, login } = useAuth();

  if (loading) return null; // Or a spinner

  if (!token) {
      return <LoginPage onLoginSuccess={(t) => login(t)} />;
  }

  return (
    <main>
        <AuroraBackground />
        <FeedStream />
    </main>
  )
}

const App = () => {
  return (
    <AuthProvider>
        <ProtectedApp />
    </AuthProvider>
  )
}

export default App
