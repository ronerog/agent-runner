'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'

function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setIsLoading(true)
    try {
      await register(name, email, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { email?: string[]; detail?: string } } }
      if (apiError.response?.data?.email) {
        setError(apiError.response.data.email[0])
      } else if (apiError.response?.data?.detail) {
        setError(apiError.response.data.detail)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">💍</div>
            <h1 className="font-serif text-3xl font-semibold text-slate-800 mb-2">
              Start Your Story
            </h1>
            <p className="text-slate-500 text-sm">
              Create your free wedding website today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <Input
              id="name"
              label="Your name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sofia & Rafael"
              required
            />

            <Input
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full mt-2"
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-rose-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  )
}
