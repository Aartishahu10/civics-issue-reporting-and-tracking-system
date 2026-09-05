import { Link } from 'react-router-dom'
import { ArrowRight, Bot, CheckCircle2, MapPinned, ShieldCheck, Sparkles } from 'lucide-react'

const steps = ['Report', 'AI Analysis', 'Authority', 'Resolution']

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 font-bold text-white">C</div>
          <span className="text-xl font-bold">CivicConnect AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-600">Login</Link>
          <Link to="/register" className="rounded-xl bg-primary px-4 py-2 text-white">Register</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-primary">Smart Civic Reporting</span>
          <h1 className="mt-6 text-5xl font-extrabold leading-tight">Report. Track. Resolve.</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">Making cities smarter, one civic issue at a time.</p>
          <div className="mt-8 flex gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white">Report an Issue <ArrowRight size={18} /></Link>
            <Link to="/login" className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700">Track Complaint</Link>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-8 shadow-soft">
          <div className="grid gap-4">
            {[1,2,3].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Pothole near school gate</span>
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">Critical</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <MapPinned size={16} /> Sector 15, Noida
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-primary">{index + 1}</div>
                <h3 className="font-semibold">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">Features</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ['AI Detection', 'Image analysis and auto-classification', <Sparkles className="text-teal-600" />],
            ['Smart Priority', 'Prediction driven by urgency and risk signals', <CheckCircle2 className="text-teal-600" />],
            ['Live Tracking', 'Monitor complaint status with transparent updates', <MapPinned className="text-teal-600" />],
          ].map(([title, description, Icon]) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">{Icon}</div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Bot className="mx-auto mb-4 text-teal-400" />
          <h3 className="text-3xl font-bold">CivicAssist</h3>
          <p className="mt-3 text-slate-300">AI-powered help for reporting, tracking, and resolving civic concerns faster.</p>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
