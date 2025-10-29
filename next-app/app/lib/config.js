// Shared API base for frontend. Computes from current host to avoid localhost issues on other devices.
export function getApiBase() {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
}

export function getApiUrl() {
  return `${getApiBase()}/api`;
}

// For convenience, export constants (but use functions in components for dynamic resolution)
export const API_BASE = getApiBase();
export const API_URL = getApiUrl();
