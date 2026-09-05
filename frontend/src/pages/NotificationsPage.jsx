const notifications = [
  'Your complaint CIV-2026-00001 has been assigned to the Road Department.',
  'Complaint CIV-2026-00003 has been verified by the admin.',
  'Work started on your garbage complaint.',
]

function NotificationsPage() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div key={index} className="rounded-xl border border-slate-200 p-4 text-slate-700">🔔 {notification}</div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsPage
