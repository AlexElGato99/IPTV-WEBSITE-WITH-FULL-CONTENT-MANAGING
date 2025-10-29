'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

function getApiUrl() {
  if (typeof window !== 'undefined') {
    return 'http://localhost:5000/api'
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState('')
  const [tokenValid, setTokenValid] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const apiUrl = getApiUrl()

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '#374151' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 1) return { strength: 25, label: 'Weak', color: '#ef4444' }
    if (strength <= 2) return { strength: 50, label: 'Fair', color: '#eab308' }
    if (strength <= 3) return { strength: 75, label: 'Good', color: '#3b82f6' }
    return { strength: 100, label: 'Strong', color: '#22c55e' }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. No token provided.')
      setLoading(false)
      return
    }
    verifyToken()
  }, [token])

  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (success && countdown === 0) {
      router.push('/admin/login')
    }
  }, [success, countdown, router])

  const verifyToken = async () => {
    try {
      const res = await fetch(`${apiUrl}/auth/verify-reset-token/${token}`)
      const data = await res.json()

      if (data.valid) {
        setTokenValid(true)
        setEmail(data.email)
      } else {
        setError(data.error || 'Invalid or expired reset token')
      }
    } catch (err) {
      setError('Failed to verify reset token')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message)
        setCountdown(3)
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1a1a1a, #2d2d2d, #000)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        input:focus {
          outline: none;
          border-color: #86ff00 !important;
          box-shadow: 0 0 0 2px rgba(134, 255, 0, 0.3);
        }
        button:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
        .link:hover {
          color: #86ff00 !important;
        }
      `}</style>

      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div style={{
          background: 'rgba(45, 45, 45, 0.5)',
          backdropFilter: 'blur(16px)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '2rem'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(to right, #86ff00, #75e600)',
              borderRadius: '50%',
              marginBottom: '1rem',
              boxShadow: '0 10px 30px rgba(134, 255, 0, 0.3)'
            }}>
              <svg style={{ width: '2rem', height: '2rem', color: '#000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <FaLock /> Reset Password
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Create a secure password for your account</p>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div className="spinner" style={{
                display: 'inline-block',
                width: '3rem',
                height: '3rem',
                border: '4px solid #4b5563',
                borderTop: '4px solid #86ff00',
                borderRadius: '50%',
                marginBottom: '1rem'
              }}></div>
              <p style={{ color: '#9ca3af', fontWeight: '500' }}>Verifying reset link...</p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>Please wait</p>
            </div>
          )}

          {/* Invalid Token */}
          {!loading && !tokenValid && (
            <div>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ flexShrink: 0 }}>
                    <svg style={{ width: '1.5rem', height: '1.5rem', color: '#ef4444' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.125rem', margin: 0 }}>Invalid Reset Link</h3>
                    <p style={{ color: '#fca5a5', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: '0' }}>{error}</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem', marginBottom: '0' }}>The link may have expired or already been used.</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/admin/login')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #374151, #4b5563)',
                  color: '#fff',
                  fontWeight: '600',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </button>
            </div>
          )}

          {/* Valid Token - Form */}
          {!loading && tokenValid && (
            <div>
              {/* Email Badge */}
              {email && (
                <div style={{
                  background: 'linear-gradient(to right, rgba(55, 65, 81, 0.5), rgba(75, 85, 99, 0.5))',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  border: '1px solid #4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', color: '#86ff00', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500', margin: 0 }}>Resetting password for</p>
                    <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.875rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444', flexShrink: 0, marginTop: '0.125rem' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p style={{ color: '#fca5a5', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.5)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <svg style={{ width: '1.5rem', height: '1.5rem', color: '#22c55e', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '1.125rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCheckCircle /> Password Reset Successful!
                      </h3>
                      <p style={{ color: '#86efac', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: '0' }}>{success}</p>
                      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="spinner" style={{
                          width: '1rem',
                          height: '1rem',
                          border: '2px solid #9ca3af',
                          borderTop: '2px solid #fff',
                          borderRadius: '50%'
                        }}></div>
                        <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                          Redirecting to login in <span style={{ fontWeight: 'bold', color: '#fff' }}>{countdown}</span> seconds...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* New Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', marginBottom: '0.5rem' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 3rem 0.75rem 1rem',
                        background: 'rgba(55, 65, 81, 0.5)',
                        border: '1px solid #4b5563',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}
                      placeholder="Enter new password"
                      disabled={submitting || success}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '0.25rem'
                      }}
                      disabled={submitting || success}
                    >
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  
                  {/* Strength Indicator */}
                  {newPassword && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>Password Strength:</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '0.5rem', background: '#374151', borderRadius: '0.25rem', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${passwordStrength.strength}%`,
                          background: passwordStrength.color,
                          transition: 'all 0.3s'
                        }}></div>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem', marginBottom: 0 }}>
                        Use 8+ characters with uppercase, lowercase, numbers & symbols
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', marginBottom: '0.5rem' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 3rem 0.75rem 1rem',
                        background: 'rgba(55, 65, 81, 0.5)',
                        border: '1px solid #4b5563',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}
                      placeholder="Confirm new password"
                      disabled={submitting || success}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '0.25rem'
                      }}
                      disabled={submitting || success}
                    >
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showConfirmPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  
                  {/* Match Indicator */}
                  {confirmPassword && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {newPassword === confirmPassword ? (
                        <>
                          <svg style={{ width: '1rem', height: '1rem', color: '#22c55e' }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: '500' }}>Passwords match</span>
                        </>
                      ) : (
                        <>
                          <svg style={{ width: '1rem', height: '1rem', color: '#ef4444' }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: '500' }}>Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || success || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  style={{
                    width: '100%',
                    background: submitting || success || !newPassword || !confirmPassword || newPassword !== confirmPassword
                      ? 'rgba(134, 255, 0, 0.5)'
                      : 'linear-gradient(to right, #86ff00, #75e600)',
                    color: '#000',
                    fontWeight: 'bold',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: submitting || success || !newPassword || !confirmPassword || newPassword !== confirmPassword ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    boxShadow: '0 10px 30px rgba(134, 255, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                  }}
                >
                  {submitting ? (
                    <>
                      <div className="spinner" style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        border: '3px solid #000',
                        borderTop: '3px solid transparent',
                        borderRadius: '50%'
                      }}></div>
                      <span>Resetting Password...</span>
                    </>
                  ) : success ? (
                    <>
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Password Reset Successfully
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Reset Password
                    </>
                  )}
                </button>

                {/* Back Link */}
                <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => router.push('/admin/login')}
                    className="link"
                    style={{
                      color: '#9ca3af',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'color 0.2s',
                      padding: '0.25rem'
                    }}
                  >
                    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.75rem', marginTop: '1.5rem', fontWeight: '500' }}>
          © {new Date().getFullYear()} IPTV Admin Panel • All rights reserved
        </p>
      </div>
    </div>
  )
}
