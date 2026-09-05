function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold">Profile</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Name</div><div className="text-lg font-semibold">{user.name}</div></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Email</div><div className="text-lg font-semibold">{user.email}</div></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Phone</div><div className="text-lg font-semibold">{user.phone || 'Not provided'}</div></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Role</div><div className="text-lg font-semibold capitalize">{user.role}</div></div>
      </div>
    </div>
  )
}

export default ProfilePage
