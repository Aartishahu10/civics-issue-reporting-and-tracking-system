import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ReportIssuePage from './pages/ReportIssuePage'
import ComplaintsPage from './pages/ComplaintsPage'
import ComplaintDetailsPage from './pages/ComplaintDetailsPage'
import MapPage from './pages/MapPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import AssistantPage from './pages/AssistantPage'
import AdminPage from './pages/AdminPage'
import AdminComplaintsPage from './pages/AdminComplaintsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminDepartmentsPage from './pages/AdminDepartmentsPage'
import AdminAnalyticsPage from './pages/AdminAnalyticsPage'
import StaffPage from './pages/StaffPage'
import StaffTasksPage from './pages/StaffTasksPage'
import StaffTaskDetailPage from './pages/StaffTaskDetailPage'
import AuthLayout from './layouts/AuthLayout'

const user = () => JSON.parse(localStorage.getItem('user') || 'null')

function ProtectedRoute({ children, allowedRoles = [] }) {
  const currentUser = user()
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  if (allowedRoles.length && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function App() {
  const currentUser = user()

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AuthLayout />}> 
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['citizen']}><DashboardPage /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute allowedRoles={['citizen']}><ReportIssuePage /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute allowedRoles={['citizen']}><ComplaintsPage /></ProtectedRoute>} />
        <Route path="/complaints/:id" element={<ProtectedRoute allowedRoles={['citizen', 'staff', 'admin']}><ComplaintDetailsPage /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute allowedRoles={['citizen', 'admin']}><MapPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute allowedRoles={['citizen']}><NotificationsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['citizen', 'staff', 'admin']}><ProfilePage /></ProtectedRoute>} />
        <Route path="/assistant" element={<ProtectedRoute allowedRoles={['citizen']}><AssistantPage /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
        <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['admin']}><AdminComplaintsPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><AdminDepartmentsPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsPage /></ProtectedRoute>} />

        <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffPage /></ProtectedRoute>} />
        <Route path="/staff/tasks" element={<ProtectedRoute allowedRoles={['staff']}><StaffTasksPage /></ProtectedRoute>} />
        <Route path="/staff/tasks/:id" element={<ProtectedRoute allowedRoles={['staff']}><StaffTaskDetailPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to={currentUser ? `/${currentUser.role}` : '/login'} replace />} />
    </Routes>
  )
}

export default App
