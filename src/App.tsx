import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Home from './pages/Home'
import ProtectedRoute from '../components/ProtectedRoute'
import VerificationTerminal from './verify/page'
import VerificationHistoryPage from './verify/history/page'
import Layout from '../components/Layout'
// app-level styles moved to /styles
import '../styles/App.css'

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify"
        element={
          <ProtectedRoute>
            <Layout>
              <VerificationTerminal />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify/history"
        element={
          <ProtectedRoute>
            <Layout>
              <VerificationHistoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}