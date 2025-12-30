import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Home from './pages/Home'
import ProtectedRoute from '../components/ProtectedRoute'
import VerificationTerminal from './verify/page'
import VerificationHistoryPage from './verify/history/page'
import VerifiedRoute from '../components/VerifiedRoute'
import Layout from '../components/Layout'
import SosPage from './sos/page'
import PwaAnonymous from './pwa/anonymous'
import SosQueueInspector from './sos/queue'
import DevLogs from './dev/logs'
import AssistPage from './assist/page'
import ComplaintsIndex from './complaints/page'
import RightsPage from './rights/page'
import DashboardPage from './dashboard/page'
// app-level styles moved to /styles
import '../styles/App.css'

export default function App(): JSX.Element {
  return (
    <Routes>
      {/* Public PWA/SOS routes (no login required) */}
      <Route path="/sos-anonymous" element={<SosPage anonymous />} />
      <Route path="/pwa/anonymous" element={<PwaAnonymous />} />
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
          <VerifiedRoute>
            <Layout>
              <VerificationTerminal />
            </Layout>
          </VerifiedRoute>
        }
      />
      <Route
        path="/sos"
        element={
          <ProtectedRoute>
            <Layout>
              <SosPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assist"
        element={
          <ProtectedRoute>
            <AssistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <ComplaintsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints/new/:typeId"
        element={
          <ProtectedRoute>
            {/* ComplaintForm is rendered in page wrapper which picks schema from route */}
            <ComplaintsIndex />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sos/queue"
        element={
          <ProtectedRoute>
            <Layout>
              <SosQueueInspector />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rights"
        element={
          <ProtectedRoute>
            <RightsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dev/logs"
        element={
          <ProtectedRoute>
            <Layout>
              <DevLogs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify/history"
        element={
          <VerifiedRoute>
            <Layout>
              <VerificationHistoryPage />
            </Layout>
          </VerifiedRoute>
        }
      />
    </Routes>
  )
}