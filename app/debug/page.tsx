"use client";

import { API_BASE_URL, API_ENDPOINTS } from '@/lib/constants';
import { getApiUrl } from '@/lib/config';
import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<Record<string, unknown> | null>(null);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();
      setTestResult({ success: true, data });
    } catch (error: any) {
      setTestResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  const testCourseInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_COURSE_INFO}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: ['https://www.udemy.com/course/test/'] })
      });
      const data = await response.json();
      setTestResult({ success: true, data });
    } catch (error: any) {
      setTestResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  // Tracking / GTM verification (client-side)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const d: Record<string, unknown> = {};
    d.dataLayerExists = Array.isArray(window.dataLayer);
    d.dataLayerLength = window.dataLayer?.length ?? 0;
    d.dataLayerEvents = window.dataLayer
      ?.map((e: { event?: string }) => e?.event)
      .filter((x): x is string => Boolean(x))
      .filter((v, i, a) => a.indexOf(v) === i) ?? [];
    d.gtmLoaded = typeof (window as unknown as { google_tag_manager?: unknown }).google_tag_manager !== 'undefined';
    d.fbqLoaded = typeof (window as unknown as { fbq?: unknown }).fbq !== 'undefined';
    const gtmContainers = (window as unknown as { google_tag_manager?: Record<string, unknown> }).google_tag_manager;
    d.gtmContainerIds = gtmContainers ? Object.keys(gtmContainers) : [];
    setTrackingStatus(d);
  }, []);

  const runTrackingCheck = () => {
    if (typeof window === 'undefined') return;
    const d: Record<string, unknown> = {};
    d.dataLayerExists = Array.isArray(window.dataLayer);
    d.dataLayerLength = window.dataLayer?.length ?? 0;
    d.dataLayerEvents = window.dataLayer
      ?.map((e: { event?: string }) => e?.event)
      .filter((x): x is string => Boolean(x))
      .filter((v, i, a) => a.indexOf(v) === i) ?? [];
    d.gtmLoaded = typeof (window as unknown as { google_tag_manager?: unknown }).google_tag_manager !== 'undefined';
    d.fbqLoaded = typeof (window as unknown as { fbq?: unknown }).fbq !== 'undefined';
    const gtmContainers = (window as unknown as { google_tag_manager?: Record<string, unknown> }).google_tag_manager;
    d.gtmContainerIds = gtmContainers ? Object.keys(gtmContainers) : [];
    setTrackingStatus(d);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>🔍 Debug Page - API Configuration</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>📝 Current Configuration</h2>
        <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{JSON.stringify({
  'API_BASE_URL (from constants)': API_BASE_URL,
  'API_URL (from config)': getApiUrl(),
  'NEXT_PUBLIC_API_URL (env)': process.env.NEXT_PUBLIC_API_URL,
  'NODE_ENV': process.env.NODE_ENV,
  'API_ENDPOINTS': API_ENDPOINTS,
  'window.location': typeof window !== 'undefined' ? window.location.href : 'server-side'
}, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>🧪 API Tests</h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={testAPI}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Testing...' : 'Test Health Check'}
          </button>

          <button 
            onClick={testCourseInfo}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Testing...' : 'Test Get Course Info'}
          </button>
        </div>

        {testResult && (
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            background: testResult.success ? '#d1fae5' : '#fee2e2',
            border: testResult.success ? '2px solid #059669' : '2px solid #dc2626'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              marginBottom: '10px',
              color: testResult.success ? '#059669' : '#dc2626'
            }}>
              {testResult.success ? '✅ Success' : '❌ Error'}
            </h3>
            <pre style={{ 
              background: '#fff', 
              padding: '15px', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '14px'
            }}>
{JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Tracking / GTM Verification */}
      <div style={{ background: '#e0f2fe', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #0ea5e9' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>📊 Tracking / GTM / Pixel</h2>
        <button
          onClick={runTrackingCheck}
          style={{ padding: '10px 20px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '15px' }}
        >
          🔄 Kiểm tra lại
        </button>
        {trackingStatus && (
          <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px', overflow: 'auto', fontSize: '14px' }}>
            {JSON.stringify(trackingStatus, null, 2)}
          </pre>
        )}
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#0c4a6e' }}>
          ✅ dataLayerExists: true, gtmLoaded: true = GTM chạy đúng. 
          dataLayerEvents cần có: page_view, set_user_properties.
        </p>
      </div>

      <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', border: '2px solid #ffc107' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>💡 Troubleshooting Tips</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>If API_BASE_URL is wrong:</strong> Rebuild Next.js with correct .env</li>
          <li><strong>If getting CORS errors:</strong> Check backend CORS configuration</li>
          <li><strong>If connection refused:</strong> Ensure backend is running on port 3000</li>
          <li><strong>If timeout:</strong> Check if backend is reachable from frontend</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#e0e7ff', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>🔧 Quick Fixes</h3>
        <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px', fontSize: '13px' }}>
{`# If API URL is wrong, run these commands:

# 1. Update .env.production
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.production

# 2. Rebuild Next.js
npm run build

# 3. Restart PM2
pm2 restart client-nextjs --update-env

# 4. Check if backend is running
curl http://localhost:3000/`}
        </pre>
      </div>
    </div>
  );
}
