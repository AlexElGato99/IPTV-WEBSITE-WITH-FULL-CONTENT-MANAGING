const fs = require('fs');
const path = require('path');

const dashboardContent = `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getApiUrl, getApiBase } from '../../lib/config'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [activeSection, setActiveSection] = useState('analytics')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Analytics state
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('')
  const [googleMeasurementId, setGoogleMeasurementId] = useState('')
  const [liveVisitors, setLiveVisitors] = useState(0)
  const [analyticsMessage, setAnalyticsMessage] = useState('')

  // Settings state
  const [logoUrl, setLogoUrl] = useState('')
  const [logoText, setLogoText] = useState('')
  const [useLogoImage, setUseLogoImage] = useState(true)
  const [logoWidth, setLogoWidth] = useState(150)
  const [contactEmail, setContactEmail] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  
  // Account settings state
  const [currentEmail, setCurrentEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Plans state
  const [plans, setPlans] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // FAQs state
  const [faqs, setFaqs] = useState([])
  const [newFaqQ, setNewFaqQ] = useState('')
  const [newFaqA, setNewFaqA] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (authenticated) {
      loadSettings()
      loadPlans()
      loadFaqs()
      loadAccountInfo()
      loadAnalytics()
      
      const interval = setInterval(loadAnalytics, 30000)
      return () => clearInterval(interval)
    }
  }, [authenticated])

  const checkAuth = async () => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/auth/check\`, {
        credentials: 'include'
      })
      const data = await res.json()
      
      if (!data.authenticated) {
        router.push('/admin/login')
        return
      }
      
      setAuthenticated(true)
    } catch (error) {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const loadAccountInfo = async () => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/account/info\`, {
        credentials: 'include'
      })
      const data = await res.json()
      setCurrentEmail(data.email || '')
    } catch (error) {
      console.error('Failed to load account info:', error)
    }
  }

  const loadAnalytics = async () => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/analytics/realtime\`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.activeUsers !== undefined) {
        setLiveVisitors(data.activeUsers)
      }
      if (data.message) {
        setAnalyticsMessage(data.message)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  const loadSettings = async () => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/settings\`)
      const data = await res.json()
      setLogoUrl(data.logo_url || '')
      setLogoText(data.logo_text || '')
      setUseLogoImage(data.use_logo_image !== false)
      setLogoWidth(data.logo_width || 150)
      setContactEmail(data.contact_email || '')
      setWhatsappNumber(data.whatsapp_number || '')
      setGoogleAnalyticsId(data.google_analytics_id || '')
      setGoogleMeasurementId(data.google_analytics_measurement_id || '')
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const loadPlans = async () => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/plans\`)
      const data = await res.json()
      setPlans(data)
    } catch (error) {
      console.error('Failed to load plans:', error)
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('logo', file)

    try {
      const apiUrl = getApiUrl()
      const apiBase = getApiBase()
      const res = await fetch(\`\${apiUrl}/upload/logo\`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)

      const fullUrl = \`\${apiBase}\${data.url}\`
      setLogoUrl(fullUrl)
      showMessage('success', 'Logo uploaded successfully! Click Save Settings to apply.')
    } catch (error) {
      showMessage('error', error.message)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/settings\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          logo_url: logoUrl,
          logo_text: logoText,
          use_logo_image: useLogoImage,
          logo_width: parseInt(logoWidth) || 150,
          contact_email: contactEmail,
          whatsapp_number: whatsappNumber,
          google_analytics_id: googleAnalyticsId,
          google_analytics_measurement_id: googleMeasurementId
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      showMessage('success', 'Settings saved successfully!')
    } catch (error) {
      showMessage('error', error.message)
    } finally {
      setSaving(false)
    }
  }

  const updateEmail = async () => {
    setSaving(true)
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/account/update-email\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newEmail, currentPassword: emailPassword })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update email')
      }

      showMessage('success', data.message + ' Logging out...')
      
      setTimeout(() => {
        router.push('/admin/login')
      }, 2000)
    } catch (error) {
      showMessage('error', error.message)
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    setSaving(true)
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/account/change-password\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      showMessage('success', data.message)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      showMessage('error', error.message)
    } finally {
      setSaving(false)
    }
  }

  const updatePlan = async (planId, updates) => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/plans/\${planId}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      const updatedPlan = await res.json()
      setPlans(plans.map(p => p.id === planId ? updatedPlan : p))
      showMessage('success', 'Plan updated successfully!')
    } catch (error) {
      showMessage('error', error.message)
    }
  }

  const loadFaqs = async () => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/faqs\`)
      const data = await res.json()
      setFaqs(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to load FAQs:', e)
    }
  }

  const addFaq = async () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) {
      showMessage('error', 'Please fill question and answer')
      return
    }
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/faqs\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question: newFaqQ.trim(), answer: newFaqA.trim() })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add FAQ')
      }
      const created = await res.json()
      setFaqs(prev => [...prev, created].sort((a,b) => (a.display_order - b.display_order) || (a.id - b.id)))
      setNewFaqQ('')
      setNewFaqA('')
      showMessage('success', 'FAQ added')
    } catch (e) {
      showMessage('error', e.message)
    }
  }

  const updateFaq = async (id, updates) => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/faqs/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update FAQ')
      }
      const updated = await res.json()
      setFaqs(prev => prev.map(f => f.id === id ? updated : f))
      showMessage('success', 'FAQ updated')
    } catch (e) {
      showMessage('error', e.message)
    }
  }

  const deleteFaq = async (id) => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(\`\${apiUrl}/faqs/\${id}\`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete FAQ')
      }
      setFaqs(prev => prev.filter(f => f.id !== id))
      showMessage('success', 'FAQ deleted')
    } catch (e) {
      showMessage('error', e.message)
    }
  }

  const handleLogout = async () => {
    const apiUrl = getApiUrl()
    await fetch(\`\${apiUrl}/auth/logout\`, {
      method: 'POST',
      credentials: 'include'
    })
    router.push('/admin/login')
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const filteredPlans = plans.filter(p => p.device_tab === activeTab)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}>
        <p style={{ color: '#86ff00', fontSize: '20px' }}>Loading...</p>
      </div>
    )
  }

  if (!authenticated) return null

  const menuItems = [
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'account', icon: '🔐', label: 'Account Settings' },
    { id: 'site', icon: '⚙️', label: 'Site Settings' },
    { id: 'pricing', icon: '💰', label: 'Pricing Plans' },
    { id: 'faqs', icon: '❓', label: 'FAQs' }
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f' }}>
      {/* Sidebar - COMPLETE SIDEBAR CODE WILL BE IN THE ACTUAL FILE */}
      <div style={{
        width: sidebarOpen ? '280px' : '80px',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
        borderRight: '1px solid #2a2a2a',
        transition: 'width 0.3s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #2a2a2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && (
            <h2 style={{ margin: 0, color: '#86ff00', fontSize: '20px', fontWeight: '800' }}>
              ADMIN PANEL
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'transparent',
              border: '1px solid #3a3a3a',
              color: '#86ff00',
              padding: '8px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: '1'
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: '100%',
                padding: sidebarOpen ? '14px 20px' : '14px 0',
                background: activeSection === item.id ? 'rgba(134, 255, 0, 0.1)' : 'transparent',
                border: 'none',
                borderLeft: activeSection === item.id ? '4px solid #86ff00' : '4px solid transparent',
                color: activeSection === item.id ? '#86ff00' : '#999',
                fontSize: '15px',
                fontWeight: activeSection === item.id ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '20px', minWidth: '24px', textAlign: 'center' }}>
                {item.icon}
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{
          padding: '20px',
          borderTop: '1px solid #2a2a2a'
        }}>
          {sidebarOpen && (
            <div style={{ marginBottom: '12px', color: '#666', fontSize: '13px' }}>
              <div style={{ color: '#999', fontSize: '11px', marginBottom: '4px' }}>Logged in as:</div>
              <div style={{ color: '#86ff00', fontSize: '14px', fontWeight: '600', wordBreak: 'break-all' }}>
                {currentEmail}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #8b1e1e',
              background: 'transparent',
              color: '#ff6666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '280px' : '80px',
        transition: 'margin-left 0.3s ease',
        padding: '40px 40px',
        overflowY: 'auto'
      }}>
        {message.text && (
          <div style={{
            padding: '16px 24px',
            borderRadius: '12px',
            marginBottom: '24px',
            background: message.type === 'success' ? '#2d5016' : '#8b1e1e',
            border: \`1px solid \${message.type === 'success' ? '#86ff00' : '#ff4444'}\`,
            color: '#fff',
            fontSize: '15px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>
              {message.type === 'success' ? '✅' : '❌'}
            </span>
            {message.text}
          </div>
        )}

        {activeSection === 'analytics' && <h1 style={{ color: '#fff' }}>📊 Analytics Dashboard - Coming Soon</h1>}
        {activeSection === 'account' && <h1 style={{ color: '#fff' }}>🔐 Account Settings - Coming Soon</h1>}
        {activeSection === 'site' && <h1 style={{ color: '#fff' }}>⚙️ Site Settings - Coming Soon</h1>}
        {activeSection === 'pricing' && <h1 style={{ color: '#fff' }}>💰 Pricing Plans - Coming Soon</h1>}
        {activeSection === 'faqs' && <h1 style={{ color: '#fff' }}>❓ FAQs - Coming Soon</h1>}
      </div>
    </div>
  )
}
`;

const filePath = path.join(__dirname, 'next-app', 'app', 'admin', 'dashboard', 'page.jsx');
fs.writeFileSync(filePath, dashboardContent, 'utf8');
console.log('✅ Dashboard created successfully!');
console.log('File:', filePath);
