'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'login' ? '/api/auth/sign-in' : '/api/auth/sign-up'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Authentication failed')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border border-[#E5DFD6] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition-colors placeholder:text-[#C4BDB5] focus:border-[#111111]'
  const labelClass = 'mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-[#9E9690]'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F4EF] px-4 pt-20">
      <div className="w-full max-w-sm">

        {/* Eyebrow + heading */}
        <div className="mb-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: '#9B6F47' }}>Taaron</p>
          <h1
            className="mt-3 text-[#111111]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.01em',
              fontWeight: 400,
            }}
          >
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your full name"
                required={mode === 'signup'}
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-[#111111] py-3.5 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#9B6F47] disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 border-t border-[#E5DFD6] pt-6 text-center text-[12px] text-[#5C5652]">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button
                onClick={() => { setMode('signup'); setError('') }}
                className="font-medium text-[#9B6F47] hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have one?{' '}
              <button
                onClick={() => { setMode('login'); setError('') }}
                className="font-medium text-[#9B6F47] hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-[11px] uppercase tracking-widest text-[#9E9690] hover:text-[#111111] transition-colors">
            ← Back to shop
          </Link>
        </div>
      </div>
    </div>
  )
}
