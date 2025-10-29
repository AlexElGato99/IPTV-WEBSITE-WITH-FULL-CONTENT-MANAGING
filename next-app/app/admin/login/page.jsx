'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '../../lib/config'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [recovering, setRecovering] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // check if the email is valid format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(email)) {
        setError('Please enter a valid email address')
        setLoading(false)
        return
      }

      const apiUrl = getApiUrl()
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      router.push('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRecoverPassword = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setError('')
    setSuccess('')
    setRecovering(true)

    try {
      const apiUrl = getApiUrl()
      const res = await fetch(`${apiUrl}/auth/recover-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Recovery failed')
      }

      setSuccess(data.message)
      
      // If default email, clear password field for retry
      if (data.isDefaultEmail) {
        setPassword('')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setRecovering(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    }}>
      <div style={{
        background: '#2a2a2a',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #3a3a3a'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          color: '#86ff00',
          fontSize: '28px',
          fontWeight: '800',
          textAlign: 'center'
        }}>
          Admin Panel
        </h1>
        <p style={{ 
          margin: '0 0 30px 0', 
          color: '#999',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          Sign in to manage your IPTV website
        </p>

        {error && (
          <div style={{
            background: '#ff4444',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#2d5016',
            color: '#86ff00',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #86ff00'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#ddd', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@site.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #3a3a3a',
                background: '#1a1a1a',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#86ff00'}
              onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#ddd', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #3a3a3a',
                background: '#1a1a1a',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#86ff00'}
              onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: loading ? '#555' : '#86ff00',
              color: '#000',
              fontSize: '16px',
              fontWeight: '800',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#75e600'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#86ff00'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={handleRecoverPassword}
          disabled={recovering || !email}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #3a3a3a',
            background: 'transparent',
            color: (recovering || !email) ? '#666' : '#86ff00',
            fontSize: '14px',
            fontWeight: '600',
            cursor: (recovering || !email) ? 'not-allowed' : 'pointer',
            marginTop: '12px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!recovering && email) {
              e.target.style.background = '#1a1a1a'
              e.target.style.borderColor = '#86ff00'
            }
          }}
          onMouseLeave={(e) => {
            if (!recovering && email) {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = '#3a3a3a'
            }
          }}
        >
          {recovering ? 'Recovering...' : 'Recover Password'}
        </button>

        <p style={{ 
          marginTop: '16px', 
          color: '#666', 
          fontSize: '12px', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          If you forgot your password: <br/>Enter your email above and click “Recover Password” to reset your password.
        </p>

        <p style={{ 
          marginTop: '12px', 
          color: '#666', 
          fontSize: '13px', 
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Need help? Contact your system administrator.
        </p>
      </div>
    </div>
  )
}
